import { Hono } from 'hono'
import type { Context } from 'hono'
import { getConfig, type AppConfig } from './config/env'
import { getRepositories } from './database/client'
import { getRateLimiter } from './core/rate-limit'
import { MemoryCache } from './core/cache'
import { RegistryCache } from './core/registry'
import { handlePublicRequest } from './core/dispatcher'
import { createAdminRouter } from './admin/routes'
import { SupabaseAdminAuthenticator, type AdminAuthenticator } from './admin/auth'
import { corsHeaders, corsPreflight, securityHeaderValues } from './middleware/security'
import { errorEnvelope, jsonHeaders } from './core/response'
import {
  ForbiddenError,
  NotFoundError,
  toPublicError,
} from './core/errors'
import { newRequestId } from './core/request'
import type { Repositories } from './database/repositories/types'
import type { RateLimiter } from './core/rate-limit'

export interface AppEnv {
  Variables: {
    'request-id': string
  }
}

export interface AppOverrides {
  repos: Repositories
  limiter: RateLimiter
  config: AppConfig
  authenticator: AdminAuthenticator
}

const DEFAULT_RETENTION_DAYS = 90

export function createApp(overrides?: Partial<AppOverrides>): Hono<AppEnv> {
  const config = overrides?.config ?? getConfig()
  const repos = overrides?.repos ?? getRepositories()
  const limiter = overrides?.limiter ?? getRateLimiter(config)
  const responseCache = new MemoryCache<Record<string, unknown>>()
  const settingsCache = new MemoryCache<unknown>()
  const registry = new RegistryCache(repos)

  const dispatcherDeps = { config, repos, registry, limiter, responseCache, settingsCache }

  const adminDeps = {
    config,
    repos,
    registry,
    responseCache,
    settingsCache,
    authenticator: overrides?.authenticator ?? new SupabaseAdminAuthenticator(config, repos),
  }

  const app = new Hono<AppEnv>()

  app.use('*', async (c, next) => {
    c.set('request-id', newRequestId())
    await next()
  })

  app.options('/api/v1/*', () => corsPreflight())

  app.route('/api/v1/admin', createAdminRouter(adminDeps))

  const maintenance = async (c: Context<AppEnv>): Promise<Response> => {
    const authorization = c.req.header('authorization')
    const token = authorization?.startsWith('Bearer ') ? authorization.slice(7).trim() : ''
    const cronSecret = config.cronSecret
    const adminSecret = config.adminConfigurationSecret
    const authorized = (cronSecret.length > 0 && token === cronSecret) || (adminSecret.length > 0 && token === adminSecret)
    if (!authorized) {
      throw new ForbiddenError('Maintenance access requires a valid secret.')
    }
    const cutoff = new Date(Date.now() - DEFAULT_RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString()
    const purged = await repos.usageLogs.purgeBefore(cutoff)
    return new Response(
      JSON.stringify({
        status: 'success',
        code: 200,
        message: 'Maintenance completed successfully',
        data: { purgedLogs: purged, cutoff },
        meta: {
          request_id: c.get('request-id'),
          timestamp: new Date().toISOString(),
          response_time_ms: 0,
          api_version: config.apiVersion,
        },
      }),
      {
        status: 200,
        headers: { ...jsonHeaders(0), ...securityHeaderValues() },
      },
    )
  }

  app.get('/api/v1/maintenance/purge', maintenance)
  app.post('/api/v1/maintenance/purge', maintenance)

  app.all('/api/v1/*', (c) => handlePublicRequest(dispatcherDeps, c))

  app.onError((error, c) => {
    const publicError = toPublicError(error)
    const requestId = c.get('request-id') || newRequestId()
    const envelope = errorEnvelope({
      config,
      error: publicError,
      requestId,
      startedAt: Date.now(),
    })
    return new Response(JSON.stringify(envelope), {
      status: publicError.statusCode,
      headers: { ...jsonHeaders(0), ...securityHeaderValues(), 'X-Request-Id': requestId },
    })
  })

  app.notFound((c) => {
    const requestId = c.get('request-id') || newRequestId()
    const envelope = errorEnvelope({
      config,
      error: new NotFoundError(),
      requestId,
      startedAt: Date.now(),
    })
    return new Response(JSON.stringify(envelope), {
      status: 404,
      headers: { ...jsonHeaders(0), ...securityHeaderValues(), ...corsHeaders(), 'X-Request-Id': requestId },
    })
  })

  return app
}
