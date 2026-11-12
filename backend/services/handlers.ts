import { createHash, randomUUID } from 'node:crypto'
import { isIP } from 'node:net'
import { BadRequestError, AppError } from '../core/errors'
import { getConfig, type AppConfig } from '../config/env'
import type { Repositories } from '../database/repositories/types'
import { extractNexrayDownloadUrl, resolveProviderRaw } from './provider-execution'
import { buildPublicCatalog } from './catalog'
import { buildPublicStatus } from './status'
import { getDefaultProviderClient } from '../providers/http/client'
import { executeProviderBinaryEndpoint } from './provider-execution'

export interface NativeContext {
  config: AppConfig
  repos: Repositories
  query: Record<string, unknown>
  body: Record<string, unknown>
  requestId: string
  clientIp: string
  endpointSlug?: string
}

function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key]
  return typeof value === 'string' ? value : ''
}

function decodeBase64(text: string): string {
  const normalized = text.replace(/-/g, '+').replace(/_/g, '/')
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(normalized)) {
    throw new BadRequestError('The text value is not valid Base64.')
  }
  return Buffer.from(normalized, 'base64').toString('utf8')
}

function encodeBase64(text: string): string {
  return Buffer.from(text, 'utf8').toString('base64')
}

function percentDecode(text: string): string {
  try {
    return decodeURIComponent(text)
  } catch {
    throw new BadRequestError('The text value is not a valid URL-encoded string.')
  }
}

function timezoneOffset(datetime: Date, timeZone: string): string {
  const formatter = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'longOffset' })
  const parts = formatter.formatToParts(datetime)
  const name = parts.find((part) => part.type === 'timeZoneName')?.value ?? 'GMT+00:00'
  return name.replace('GMT', 'UTC')
}

async function callJagomotion(
  context: NativeContext,
  action: '/send' | '/verify',
  body: Record<string, string>,
): Promise<unknown> {
  if (!context.config.jagomotionApiKey) {
    throw new AppError(503, 'SERVICE_UNAVAILABLE', 'This service is not configured yet.')
  }
  const client = getDefaultProviderClient()
  const response = await client.request({
    url: `https://jagomotion.biz.id/api/v1/am${action}`,
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-API-KEY': context.config.jagomotionApiKey,
      'User-Agent': 'kyyinfinite-platform/2.0',
    },
    body: JSON.stringify(body),
    timeoutMs: 15_000,
    maxBytes: 1_048_576,
    allowedHosts: ['jagomotion.biz.id'],
    enforceHostAllowlist: true,
  })
  let parsed: unknown
  try {
    parsed = JSON.parse(new TextDecoder().decode(response.bytes))
  } catch {
    throw new AppError(502, 'UPSTREAM_ERROR', 'The activation provider returned an invalid response.')
  }
  if (response.status < 200 || response.status >= 300) {
    throw new AppError(502, 'UPSTREAM_ERROR', 'The activation provider could not complete the request.')
  }
  return parsed
}

type NativeHandler = (context: NativeContext) => Promise<unknown>

export const nativeHandlers: Record<string, NativeHandler> = {
  'alight-motion-send': async (context) => {
    const email = readString(context.body, 'email')
    return callJagomotion(context, '/send', { email })
  },
  'alight-motion-verify': async (context) => {
    const email = readString(context.body, 'email')
    const link = readString(context.body, 'link')
    return callJagomotion(context, '/verify', { email, link })
  },
  'tools-info': async (context) => ({
    message: 'Welcome to Kyyinfinite',
    service: 'kyyinfinite',
    apiVersion: context.config.apiVersion,
    free: true,
  }),
  'tools-uuid': async (context) => {
    const count = Number(context.query.count ?? 1)
    const uuids = Array.from({ length: count }, () => randomUUID())
    return { count: uuids.length, uuids }
  },
  'tools-base64': async (context) => {
    const action = readString(context.body, 'action')
    const text = readString(context.body, 'text')
    const result = action === 'encode' ? encodeBase64(text) : decodeBase64(text)
    return { action, result }
  },
  'tools-hash': async (context) => {
    const algorithm = readString(context.body, 'algorithm')
    const text = readString(context.body, 'text')
    const digest = createHash(algorithm).update(text, 'utf8').digest('hex')
    return { algorithm, digest }
  },
  'tools-url-encode': async (context) => {
    const action = readString(context.body, 'action')
    const text = readString(context.body, 'text')
    const result = action === 'encode' ? encodeURIComponent(text) : percentDecode(text)
    return { action, result }
  },
  'info-time': async (context) => {
    const timeZone = readString(context.query as Record<string, string>, 'tz') || 'UTC'
    const now = new Date()
    try {
      new Intl.DateTimeFormat('en-US', { timeZone }).format(now)
    } catch {
      throw new AppError(422, 'INVALID_PARAMS', 'The tz value is not a known IANA timezone.')
    }
    const datetime = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZoneName: 'longOffset',
    }).formatToParts(now)
    const part = (type: string) => datetime.find((entry) => entry.type === type)?.value ?? ''
    const dayOfWeek = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'long' }).format(now)
    return {
      timezone: timeZone,
      datetime: `${part('year')}-${part('month')}-${part('day')}T${part('hour') === '24' ? '00' : part('hour')}:${part('minute')}:${part('second')}.000${part('timeZoneName').replace('GMT', '')}`,
      utcOffset: timezoneOffset(now, timeZone),
      dayOfWeek,
    }
  },
  'info-ip': async (context) => {
    const ip = context.clientIp
    const version = isIP(ip) === 6 ? 'IPv6' : isIP(ip) === 4 ? 'IPv4' : 'unknown'
    return { ip, version }
  },
  'platform-categories': async (context) => {
    const catalog = await buildPublicCatalog(context.repos)
    return { categories: catalog.categories }
  },
  'platform-endpoints': async (context) => {
    const catalog = await buildPublicCatalog(context.repos)
    return { endpoints: catalog.endpoints }
  },
  'platform-status': async (context) => buildPublicStatus(context.repos),
}

type StreamHandler = (context: NativeContext) => Promise<Response>

export const streamHandlers: Record<string, StreamHandler> = {
  'legacy-provider-stream': async (context) => {
    const endpointSlug = context.endpointSlug
    if (!endpointSlug) throw new AppError(503, 'SERVICE_UNAVAILABLE', 'Service temporarily unavailable.')
    const endpoint = await context.repos.endpoints.findBySlug(endpointSlug)
    if (!endpoint || endpoint.kind !== 'stream') throw new AppError(503, 'SERVICE_UNAVAILABLE', 'Service temporarily unavailable.')
    const file = await executeProviderBinaryEndpoint({
      repos: context.repos,
      endpoint,
      query: context.query as Record<string, string>,
      maxBytes: context.config.downloadMaxBytes,
    })
    return new Response(file.bytes, {
      status: 200,
      headers: {
        'Content-Type': file.contentType,
        'Content-Length': String(file.bytes.byteLength),
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  },
  'youtube-relay': async (context) => {
    const config = getConfig()
    const q = readString(context.query as Record<string, string>, 'q')
    const mediaId = readString(context.query as Record<string, string>, 'id')
    const resolved = await resolveProviderRaw({
      repos: context.repos,
      endpointSlug: 'youtube-download',
      query: { q },
    })
    if (!resolved) {
      throw new AppError(503, 'SERVICE_UNAVAILABLE', 'Download delivery is not available right now.')
    }
    const download = extractNexrayDownloadUrl(resolved.raw)
    if (!download) {
      throw new AppError(404, 'NOT_FOUND', 'No downloadable media matched the given id for the given search term.')
    }
    const rawResult = (resolved.raw as { result?: { id?: string } }).result
    if (!rawResult || rawResult.id !== mediaId) {
      throw new AppError(404, 'NOT_FOUND', 'No downloadable media matched the given id for the given search term.')
    }
    const file = await resolved.adapter.fetchFile(
      { ...resolved.spec, fileUrl: download.downloadUrl },
      config.downloadMaxBytes,
    )
    if (/text\/html|application\/json|text\/plain/i.test(file.contentType)) {
      throw new AppError(502, 'UPSTREAM_ERROR', 'The requested file could not be delivered.')
    }
    const extension = file.sourceFileNameHint ?? 'bin'
    const baseName = (download.title ?? `media-${mediaId}`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'media'
    const fileName = `${baseName}.${extension}`
    const asciiName = fileName.replace(/[^\x20-\x7E]/g, '_').replace(/"/g, '')
    return new Response(file.bytes, {
      status: 200,
      headers: {
        'Content-Type': file.contentType,
        'Content-Length': String(file.bytes.byteLength),
        'Content-Disposition': `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'X-Request-Id': context.requestId,
      },
    })
  },
}

export function getNativeHandler(id: string): NativeHandler | null {
  return nativeHandlers[id] ?? null
}

export function getStreamHandler(id: string): StreamHandler | null {
  return streamHandlers[id] ?? null
}
