import { describe, expect, it } from 'vitest'
import {
  NEXRAY_SAMPLE,
  createTestApp,
  fakeProviderFetch,
  fileResponse,
  jsonResponse,
} from '../helpers'

async function textOf(response: Response): Promise<string> {
  return new TextDecoder().decode(new Uint8Array(await response.arrayBuffer()))
}

async function bodyOf(response: Response): Promise<Record<string, unknown>> {
  return JSON.parse(await response.text()) as Record<string, unknown>
}

describe('public dispatcher lifecycle', () => {
  it('serves the welcome envelope with consistent meta and headers', async () => {
    const { app } = createTestApp()
    const response = await app.request('/api/v1/tools/info')
    expect(response.status).toBe(200)
    const body = await bodyOf(response)
    expect(body.status).toBe('success')
    expect(body.code).toBe(200)
    const data = body.data as Record<string, unknown>
    expect(data.message).toBe('Welcome to Kyyinfinite')
    expect(data.free).toBe(true)
    const meta = body.meta as Record<string, unknown>
    expect(String(meta.request_id)).toMatch(/^req_/)
    expect(meta.api_version).toBe('v1')
    expect(Number(meta.response_time_ms)).toBeGreaterThan(0)
    expect(response.headers.get('X-Request-Id')).toMatch(/^req_/)
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff')
    expect(response.headers.get('Cache-Control')).toContain('s-maxage=300')
    expect(response.headers.get('X-Cache')).toBe('MISS')
  })

  it('serves cached GET responses on the second hit', async () => {
    const { app } = createTestApp()
    await app.request('/api/v1/tools/info')
    const second = await app.request('/api/v1/tools/info')
    expect(second.headers.get('X-Cache')).toBe('HIT')
  })

  it('separates cache entries per query parameters', async () => {
    const { app } = createTestApp()
    const first = await app.request('/api/v1/tools/info')
    expect(first.headers.get('X-Cache')).toBe('MISS')
    const second = await app.request('/api/v1/tools/info')
    expect(second.headers.get('X-Cache')).toBe('HIT')
    const uncached = await app.request('/api/v1/tools/uuid?count=2')
    expect(uncached.headers.get('X-Cache')).toBe('BYPASS')
    expect(uncached.headers.get('Cache-Control')).toBe('no-store')
  })

  it('returns a sanitized 404 envelope for unknown endpoints', async () => {
    const { app } = createTestApp()
    const response = await app.request('/api/v1/does/not/exist')
    expect(response.status).toBe(404)
    const body = await bodyOf(response)
    expect(body.status).toBe('error')
    expect((body.error as Record<string, unknown>).type).toBe('NOT_FOUND')
    expect(body.data).toBeNull()
  })

  it('rejects wrong methods with 405', async () => {
    const { app } = createTestApp()
    const response = await app.request('/api/v1/tools/info', { method: 'POST' })
    expect(response.status).toBe(405)
    const body = await bodyOf(response)
    expect((body.error as Record<string, unknown>).type).toBe('METHOD_NOT_ALLOWED')
  })

  it('validates query parameters before executing', async () => {
    const { app } = createTestApp()
    const response = await app.request('/api/v1/youtube/search')
    expect(response.status).toBe(400)
    const body = await bodyOf(response)
    expect((body.error as Record<string, unknown>).type).toBe('INVALID_PARAMS')
  })

  it('rejects unknown parameters with 400', async () => {
    const { app } = createTestApp()
    const response = await app.request('/api/v1/tools/uuid?count=2&injected=1')
    expect(response.status).toBe(400)
  })

  it('executes native tools with validated input', async () => {
    const { app } = createTestApp()
    const hash = await app.request('/api/v1/tools/hash', {
      method: 'POST',
      body: JSON.stringify({ algorithm: 'sha256', text: 'kyyinfinite' }),
      headers: { 'Content-Type': 'application/json' },
    })
    expect(hash.status).toBe(200)
    const hashBody = await bodyOf(hash)
    expect((hashBody.data as Record<string, unknown>).digest).toHaveLength(64)

    const b64 = await app.request('/api/v1/tools/base64', {
      method: 'POST',
      body: JSON.stringify({ action: 'encode', text: 'Hello Kyyinfinite' }),
      headers: { 'Content-Type': 'application/json' },
    })
    expect((await bodyOf(b64)).data).toMatchObject({ result: 'SGVsbG8gS3l5aW5maW5pdGU=' })

    const time = await app.request('/api/v1/info/time?tz=Asia/Jakarta')
    const timeBody = await bodyOf(time)
    expect((timeBody.data as Record<string, unknown>).timezone).toBe('Asia/Jakarta')
    expect(String((timeBody.data as Record<string, unknown>).datetime)).toContain('+07')

    const badTz = await app.request('/api/v1/info/time?tz=Not/AZone')
    expect(badTz.status).toBe(422)

    const uuids = await app.request('/api/v1/tools/uuid?count=3')
    const uuidBody = await bodyOf(uuids)
    expect(((uuidBody.data as Record<string, unknown>).uuids as string[])).toHaveLength(3)
  })

  it('serves the platform catalog without any provider information', async () => {
    const { app } = createTestApp()
    const response = await app.request('/api/v1/endpoints')
    expect(response.status).toBe(200)
    const text = await textOf(response)
    const raw = text.toLowerCase()
    expect(raw).not.toContain('nexray')
    expect(raw).not.toContain('123tokyo')
    expect(raw).not.toContain('base_url')
    expect(raw).not.toContain('internal_name')
    expect(raw).not.toContain('adapter_type')
    expect(raw).not.toContain('provider_path')
    const body = JSON.parse(text) as Record<string, unknown>
    const endpoints = (body.data as { endpoints: Array<Record<string, unknown>> }).endpoints
    expect(endpoints.length).toBeGreaterThan(3)
    const youtube = endpoints.find((endpoint) => endpoint.id === 'youtube-search')
    expect(youtube).toBeDefined()
    expect(youtube?.method).toBe('GET')
    expect(youtube?.path).toBe('/api/v1/youtube/search')
    expect(endpoints.find((endpoint) => endpoint.id === 'platform-endpoints')).toBeUndefined()
    expect(endpoints.find((endpoint) => endpoint.id === 'ai-chat')).toBeUndefined()
  })

  it('serves categories excluding inactive internal groups', async () => {
    const { app } = createTestApp()
    const response = await app.request('/api/v1/categories')
    const body = await bodyOf(response)
    const categories = (body.data as { categories: Array<{ slug: string }> }).categories
    expect(categories.map((category) => category.slug)).not.toContain('platform')
    expect(categories.map((category) => category.slug)).toContain('downloader')
  })

  it('serves public status without internal details', async () => {
    const { app } = createTestApp()
    const response = await app.request('/api/v1/status')
    expect(response.status).toBe(200)
    const text = await textOf(response)
    const raw = text.toLowerCase()
    expect(raw).not.toContain('nexray')
    const body = JSON.parse(text) as Record<string, unknown>
    const data = body.data as { overall: string; serviceGroups: unknown[] }
    expect(['operational', 'degraded']).toContain(data.overall)
    expect(data.serviceGroups.length).toBeGreaterThan(0)
  })

  it('executes the provider pipeline and hides provider identity end to end', async () => {
    const { fetchImpl } = fakeProviderFetch((url) => {
      if (url.includes('/downloader/ytplay')) return jsonResponse(NEXRAY_SAMPLE)
      return fileResponse(new Uint8Array([1, 2, 3, 4]))
    })
    const { app } = createTestApp({ fetchImpl })
    const response = await app.request('/api/v1/youtube/search?q=laufey')
    expect(response.status).toBe(200)
    const text = await textOf(response)
    const raw = text.toLowerCase()
    expect(raw).not.toContain('nexray')
    expect(raw).not.toContain('elrayyxml')
    expect(raw).not.toContain('123tokyo')
    expect(raw).not.toContain('download_url')
    const body = JSON.parse(text) as Record<string, unknown>
    const data = body.data as Record<string, unknown>
    expect(data.title).toBe('Laufey: Tiny Desk Concert')
    expect(data.channel).toBe('NPR Music')
  })

  it('streams relayed downloads without exposing the source domain', async () => {
    const { fetchImpl } = fakeProviderFetch((url) => {
      if (url.includes('/downloader/ytplay')) return jsonResponse(NEXRAY_SAMPLE)
      return fileResponse(new Uint8Array([9, 9, 9]), 'audio/mpeg')
    })
    const { app } = createTestApp({ fetchImpl })
    const response = await app.request('/api/v1/youtube/download/relay?q=laufey&id=avjI3_GIZBw')
    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toContain('audio/mpeg')
    expect(response.headers.get('Content-Disposition')).toContain('filename')
    const raw = [
      response.headers.get('Content-Disposition') ?? '',
      response.headers.get('X-Request-Id') ?? '',
    ]
      .join(' ')
      .toLowerCase()
    expect(raw).not.toContain('123tokyo')
    expect(raw).not.toContain('nexray')
    const bytes = new Uint8Array(await response.arrayBuffer())
    expect(bytes).toEqual(new Uint8Array([9, 9, 9]))
  })

  it('rejects relay requests whose id does not match the lookup', async () => {
    const { fetchImpl } = fakeProviderFetch(() => jsonResponse(NEXRAY_SAMPLE))
    const { app } = createTestApp({ fetchImpl })
    const response = await app.request('/api/v1/youtube/download/relay?q=laufey&id=WRONGID1')
    expect(response.status).toBe(404)
  })

  it('rate limits excessive global traffic', async () => {
    const { app } = createTestApp({ configOverrides: { rateLimitGlobalMax: 3 } })
    for (let i = 0; i < 3; i++) {
      const response = await app.request('/api/v1/tools/info')
      expect(response.status).toBe(200)
    }
    const blocked = await app.request('/api/v1/tools/info')
    expect(blocked.status).toBe(429)
    expect(blocked.headers.get('Retry-After')).toBeTruthy()
    const body = await bodyOf(blocked)
    expect((body.error as Record<string, unknown>).type).toBe('RATE_LIMITED')
  })

  it('rejects oversized request bodies with 413', async () => {
    const { app } = createTestApp()
    const response = await app.request('/api/v1/tools/hash', {
      method: 'POST',
      body: JSON.stringify({ algorithm: 'sha256', text: 'x'.repeat(20_000) }),
      headers: { 'Content-Type': 'application/json' },
    })
    expect(response.status).toBe(413)
    const body = await bodyOf(response)
    expect((body.error as Record<string, unknown>).type).toBe('PAYLOAD_TOO_LARGE')
  })

  it('answers cors preflights for browser clients', async () => {
    const { app } = createTestApp()
    const response = await app.request('/api/v1/tools/info', { method: 'OPTIONS' })
    expect(response.status).toBe(204)
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*')
  })

  it('records usage logs for every request', async () => {
    const { app, repos } = createTestApp()
    await app.request('/api/v1/tools/info')
    await app.request('/api/v1/does/not/exist')
    await new Promise((resolve) => setTimeout(resolve, 50))
    const cutoff = new Date(Date.now() - 60_000).toISOString()
    const logs = await repos.usageLogs.recentSince(cutoff, 100)
    expect(logs.length).toBeGreaterThanOrEqual(2)
    const successLog = logs.find((log) => log.status_code === 200)
    expect(successLog).toBeDefined()
    expect(successLog?.request_id).toMatch(/^req_/)
    expect(successLog?.client_ip_hash).toHaveLength(64)
    const notFoundLog = logs.find((log) => log.status_code === 404)
    expect(notFoundLog).toBeDefined()
    expect(notFoundLog?.endpoint_id).toBeNull()
  })
})
