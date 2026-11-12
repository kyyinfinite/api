import type { Context } from 'hono'
import { type AppConfig } from '../config/env'
import {
  AppError,
  BadRequestError,
  InvalidParamsError,
  MethodNotAllowedError,
  NotFoundError,
  PayloadTooLargeError,
  RateLimitedError,
  ServiceUnavailableError,
  logInternalError,
  toPublicError,
} from './errors'
import { errorEnvelope, jsonHeaders, successEnvelope } from './response'
import { buildCacheKey, MemoryCache } from './cache'
import { checkRateLimitSafe, type RateLimiter } from './rate-limit'
import { formatZodIssues, getParamSchema } from './param-schemas'
import type { RegistryCache, ResolvedEndpoint } from './registry'
import { extractClientIp, hashClientIp, newRequestId, sanitizePath } from './request'
import { corsHeaders, securityHeaderValues } from '../middleware/security'
import type { Repositories } from '../database/repositories/types'
import { getNativeHandler, getStreamHandler, type NativeContext } from '../services/handlers'
import { executeProviderEndpoint } from '../services/provider-execution'
import { getRateLimitOverrides } from '../services/settings'
import { recordProviderFailure } from '../services/incidents'
import { logUsageSafe } from '../services/usage'
import { background } from '../core/background'

const MAX_BODY_BYTES = 16_384
const NON_CACHEABLE_SLUGS = new Set(['info-ip', 'info-time', 'tools-uuid'])

export interface DispatcherDeps {
  config: AppConfig
  repos: Repositories
  registry: RegistryCache
  limiter: RateLimiter
  responseCache: MemoryCache<Record<string, unknown>>
  settingsCache: MemoryCache<unknown>
}

function jsonResponse(body: unknown, status: number, headers: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...securityHeaderValues(), ...corsHeaders(), ...headers },
  })
}

export async function handlePublicRequest(deps: DispatcherDeps, c: Context): Promise<Response> {
  const config = deps.config
  const startedAt = Date.now()
  const requestId = newRequestId()
  const method = c.req.method.toUpperCase()
  const headers = c.req.raw.headers
  const clientIp = extractClientIp(headers)
  const ipHash = hashClientIp(clientIp)
  const path = sanitizePath(new URL(c.req.raw.url).pathname)
  let route: ResolvedEndpoint | null = null

  const fail = (error: AppError, extraHeaders: Record<string, string> = {}): Response => {
    const envelope = errorEnvelope({ config, error, requestId, startedAt })
    const responseHeaders: Record<string, string> = {
      ...jsonHeaders(0),
      'X-Request-Id': requestId,
      ...extraHeaders,
    }
    if (error.retryAfterSeconds) {
      responseHeaders['Retry-After'] = String(error.retryAfterSeconds)
    }
    background(logUsageSafe(deps.repos, {
      request_id: requestId,
      endpoint_id: route?.endpointId ?? null,
      client_ip_hash: ipHash,
      status_code: error.statusCode,
      duration_ms: Date.now() - startedAt,
      cache_status: 'MISS',
    }))
    if (error.type === 'UPSTREAM_ERROR' || error.type === 'UPSTREAM_TIMEOUT') {
      recordProviderFailure(deps.repos, route?.endpointId ?? null, error.internalDetails ?? 'upstream failure')
    }
    return jsonResponse(envelope, error.statusCode, responseHeaders)
  }

  if (!path) {
    return fail(new NotFoundError())
  }

  try {
    const snapshot = await deps.registry.get()
    route = snapshot.routes.get(`${method} ${path}`) ?? null
    if (!route) {
      const getRoute = snapshot.routes.get(`GET ${path}`)
      if (getRoute) {
        throw new MethodNotAllowedError('GET')
      }
      throw new NotFoundError()
    }

    const overrides = await getRateLimitOverrides(deps.repos, deps.settingsCache)
    const globalLimit = overrides.global ?? {
      windowSeconds: config.rateLimitWindowSeconds,
      max: config.rateLimitGlobalMax,
    }
    const globalDecision = await checkRateLimitSafe(
      deps.limiter,
      `global:${ipHash}`,
      globalLimit.max,
      globalLimit.windowSeconds,
    )
    let decision = globalDecision
    const endpointLimit = route.slug in overrides.endpoints ? overrides.endpoints[route.slug] : route.rateLimit
    if (endpointLimit) {
      const endpointDecision = await checkRateLimitSafe(
        deps.limiter,
        `endpoint:${route.slug}:${ipHash}`,
        endpointLimit.max,
        endpointLimit.windowSeconds,
      )
      decision = globalDecision.allowed ? endpointDecision : globalDecision
    }
    const rateHeaders: Record<string, string> = {
      'X-RateLimit-Limit': String(decision.limit),
      'X-RateLimit-Remaining': String(decision.remaining),
    }
    if (!decision.allowed) {
      throw new RateLimitedError(decision.retryAfterSeconds)
    }

    let rawBody: Record<string, unknown> = {}
    if (method === 'POST') {
      const contentLength = Number(headers.get('content-length') ?? '0')
      if (contentLength > MAX_BODY_BYTES) {
        throw new PayloadTooLargeError(MAX_BODY_BYTES)
      }
      const text = await c.req.text()
      if (text.length > 0) {
        if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) {
          throw new PayloadTooLargeError(MAX_BODY_BYTES)
        }
        try {
          const parsed: unknown = JSON.parse(text)
          if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
            throw new Error('not an object')
          }
          rawBody = parsed as Record<string, unknown>
        } catch {
          throw new BadRequestError('The request body must be a JSON object.')
        }
      }
    }

    const paramSchema = getParamSchema(route.paramSchemaId)
    if (!paramSchema) {
      throw new ServiceUnavailableError('Service temporarily unavailable.', 'missing param schema')
    }
    const queryRecord = Object.fromEntries(new URL(c.req.raw.url).searchParams.entries())
    let validatedQuery: Record<string, unknown> = queryRecord
    if (paramSchema.query) {
      const parsed = paramSchema.query.safeParse(queryRecord)
      if (!parsed.success) {
        throw new InvalidParamsError(formatZodIssues(parsed.error))
      }
      validatedQuery = parsed.data as Record<string, unknown>
    }
    let validatedBody: Record<string, unknown> = rawBody
    if (paramSchema.body) {
      if (method !== 'POST') {
        throw new MethodNotAllowedError('POST')
      }
      const parsed = paramSchema.body.safeParse(rawBody)
      if (!parsed.success) {
        throw new InvalidParamsError(formatZodIssues(parsed.error))
      }
      validatedBody = parsed.data as Record<string, unknown>
    }

    const ttlSeconds = NON_CACHEABLE_SLUGS.has(route.slug) ? 0 : route.cacheTtlSeconds
    const useCache = method === 'GET' && ttlSeconds > 0
    const cacheKey = useCache ? buildCacheKey(path, queryRecord) : ''
    if (useCache) {
      const cached = deps.responseCache.get(cacheKey)
      if (cached) {
        const envelope = successEnvelope({
          config,
          data: cached,
          requestId,
          startedAt,
        })
        background(logUsageSafe(deps.repos, {
          request_id: requestId,
          endpoint_id: route.endpointId,
          client_ip_hash: ipHash,
          status_code: 200,
          duration_ms: Date.now() - startedAt,
          cache_status: 'HIT',
        }))
        return jsonResponse(envelope, 200, {
          ...jsonHeaders(ttlSeconds),
          'X-Request-Id': requestId,
          'X-Cache': 'HIT',
          ...rateHeaders,
        })
      }
    }

    const nativeContext: NativeContext = {
      config,
      repos: deps.repos,
      query: validatedQuery,
      body: validatedBody,
      requestId,
      clientIp,
      endpointSlug: route.slug,
    }

    let data: Record<string, unknown> | null = null
    let streamResponse: Response | null = null

    if (route.kind === 'native') {
      const handler = getNativeHandler(route.handlerId ?? '')
      if (!handler) {
        throw new ServiceUnavailableError('Service temporarily unavailable.', 'missing handler')
      }
      data = (await handler(nativeContext)) as Record<string, unknown>
    } else if (route.kind === 'provider') {
      const endpointRow = await deps.repos.endpoints.findById(route.endpointId)
      if (!endpointRow || !endpointRow.is_active) {
        throw new ServiceUnavailableError('Service temporarily unavailable.', 'endpoint inactive')
      }
      const execution = await executeProviderEndpoint({
        repos: deps.repos,
        endpoint: endpointRow,
        query: validatedQuery as Record<string, string>,
      })
      data = execution.data
    } else {
      const handler = getStreamHandler(route.handlerId ?? '')
      if (!handler) {
        throw new ServiceUnavailableError('Service temporarily unavailable.', 'missing stream handler')
      }
      streamResponse = await handler(nativeContext)
    }

    background(logUsageSafe(deps.repos, {
      request_id: requestId,
      endpoint_id: route.endpointId,
      client_ip_hash: ipHash,
      status_code: 200,
      duration_ms: Date.now() - startedAt,
      cache_status: 'MISS',
    }))

    if (streamResponse) {
      const forwarded = new Response(streamResponse.body, streamResponse)
      forwarded.headers.set('X-Request-Id', requestId)
      return forwarded
    }

    if (useCache && data) {
      deps.responseCache.set(cacheKey, data, ttlSeconds)
    }

    const envelope = successEnvelope({ config, data: data ?? {}, requestId, startedAt })
    return jsonResponse(envelope, 200, {
      ...jsonHeaders(ttlSeconds),
      'X-Request-Id': requestId,
      'X-Cache': useCache ? 'MISS' : 'BYPASS',
      ...rateHeaders,
    })
  } catch (error) {
    const publicError = toPublicError(error)
    if (!(error instanceof AppError)) {
      logInternalError('dispatcher', error)
    }
    return fail(publicError, {})
  }
}
