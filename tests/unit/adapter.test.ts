import { describe, expect, it } from 'vitest'
import {
  nexrayResponseSchema,
  nexrayResultSchema,
  normalizeSeconds,
  NexrayAdapter,
} from '../../backend/providers/nexray/adapter'
import { getNormalizer } from '../../backend/providers/normalizers'
import { UpstreamError } from '../../backend/core/errors'
import { NEXRAY_SAMPLE, fakeProviderFetch, jsonResponse } from '../helpers'

describe('nexray response schema', () => {
  it('accepts the real provider response shape', () => {
    const parsed = nexrayResponseSchema.safeParse(NEXRAY_SAMPLE)
    expect(parsed.success).toBe(true)
  })

  it('rejects payloads without a result object', () => {
    const parsed = nexrayResponseSchema.safeParse({ status: true })
    expect(parsed.success).toBe(false)
  })

  it('tolerates missing optional result fields', () => {
    const parsed = nexrayResultSchema.safeParse({ id: 'abc123' })
    expect(parsed.success).toBe(true)
  })

  it('normalizes seconds from number and numeric string', () => {
    expect(normalizeSeconds(1147)).toBe(1147)
    expect(normalizeSeconds('19')).toBe(19)
    expect(normalizeSeconds(undefined)).toBeNull()
    expect(normalizeSeconds('abc')).toBeNull()
  })
})

describe('youtube-search normalizer', () => {
  it('strips provider identity fields', () => {
    const normalizer = getNormalizer('youtube-search-v1')
    expect(normalizer).not.toBeNull()
    const data = normalizer!(NEXRAY_SAMPLE, { q: 'laufey' })
    const serialized = JSON.stringify(data)
    expect(serialized).not.toContain('nexray')
    expect(serialized).not.toContain('ElrayyXml')
    expect(serialized).not.toContain('download_url')
    expect(serialized).not.toContain('123tokyo')
    expect(data.title).toBe('Laufey: Tiny Desk Concert')
    expect(data.media).toEqual({ id: 'avjI3_GIZBw', type: 'video' })
    expect(data.query).toBe('laufey')
    expect(data.sourceUrl).toBe('https://youtube.com/watch?v=avjI3_GIZBw')
    expect(data.durationSeconds).toBe(1147)
  })

  it('throws when no media id is present', () => {
    const normalizer = getNormalizer('youtube-search-v1')
    expect(() => normalizer!({ result: { title: 'no id' } }, { q: 'x' })).toThrow(UpstreamError)
  })
})

describe('youtube-download normalizer', () => {
  it('returns relay delivery info without any provider url', () => {
    const normalizer = getNormalizer('youtube-download-v1')
    const data = normalizer!(NEXRAY_SAMPLE, { q: 'laufey' }) as {
      media: { id: string; filename: string }
      delivery: { path: string; method: string }
    }
    const serialized = JSON.stringify(data)
    expect(serialized).not.toContain('123tokyo')
    expect(serialized).not.toContain('download_url')
    expect(data.delivery.path).toBe('/api/v1/youtube/download/relay')
    expect(data.media.id).toBe('avjI3_GIZBw')
    expect(data.media.filename).toMatch(/\.mp4$/)
  })
})

describe('nexray adapter', () => {
  it('fetches and validates json', async () => {
    const { fetchImpl, calls } = fakeProviderFetch(() => jsonResponse(NEXRAY_SAMPLE))
    const adapter = new NexrayAdapter({ fetchImpl })
    const payload = (await adapter.fetchJson({
      baseUrl: 'https://api.nexray.eu.cc',
      providerPath: '/downloader/ytplay',
      query: { q: 'laufey' },
      configuration: {},
    })) as { result: { id: string } }
    expect(payload.result.id).toBe('avjI3_GIZBw')
    expect(calls[0].url).toBe('https://api.nexray.eu.cc/downloader/ytplay?q=laufey')
  })

  it('rejects non-2xx responses', async () => {
    const { fetchImpl } = fakeProviderFetch(() => jsonResponse({ error: 'boom' }, 500))
    const adapter = new NexrayAdapter({ fetchImpl })
    await expect(
      adapter.fetchJson({ baseUrl: 'https://api.nexray.eu.cc', providerPath: '/x', query: {}, configuration: {} }),
    ).rejects.toThrow(UpstreamError)
  })

  it('rejects invalid json bodies', async () => {
    const { fetchImpl } = fakeProviderFetch(
      () => new Response('<html>not json</html>', { status: 200, headers: { 'Content-Type': 'text/html' } }),
    )
    const adapter = new NexrayAdapter({ fetchImpl })
    await expect(
      adapter.fetchJson({ baseUrl: 'https://api.nexray.eu.cc', providerPath: '/x', query: {}, configuration: {} }),
    ).rejects.toThrow(UpstreamError)
  })

  it('rejects schema mismatches', async () => {
    const { fetchImpl } = fakeProviderFetch(() => jsonResponse({ unexpected: true }))
    const adapter = new NexrayAdapter({ fetchImpl })
    await expect(
      adapter.fetchJson({ baseUrl: 'https://api.nexray.eu.cc', providerPath: '/x', query: {}, configuration: {} }),
    ).rejects.toThrow(UpstreamError)
  })

  it('rejects provider failure flags', async () => {
    const { fetchImpl } = fakeProviderFetch(() => jsonResponse({ status: false, result: {} }))
    const adapter = new NexrayAdapter({ fetchImpl })
    await expect(
      adapter.fetchJson({ baseUrl: 'https://api.nexray.eu.cc', providerPath: '/x', query: {}, configuration: {} }),
    ).rejects.toThrow(UpstreamError)
  })

  it('enforces the response size limit', async () => {
    const { fetchImpl } = fakeProviderFetch(() => jsonResponse(NEXRAY_SAMPLE))
    const adapter = new NexrayAdapter({ fetchImpl })
    await expect(
      adapter.fetchJson({
        baseUrl: 'https://api.nexray.eu.cc',
        providerPath: '/x',
        query: {},
        configuration: { maxResponseBytes: 10 },
      }),
    ).rejects.toThrow(UpstreamError)
  })

  it('blocks non-allowlisted hosts for api calls', async () => {
    const { fetchImpl } = fakeProviderFetch(() => jsonResponse(NEXRAY_SAMPLE))
    const adapter = new NexrayAdapter({ fetchImpl })
    await expect(
      adapter.fetchJson({ baseUrl: 'https://evil.example.com', providerPath: '/x', query: {}, configuration: {} }),
    ).rejects.toThrow(UpstreamError)
  })
})
