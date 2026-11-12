import { describe, expect, it } from 'vitest'
import { createTestApp, fakeProviderFetch, jsonResponse, NEXRAY_SAMPLE, fileResponse } from '../helpers'

async function bodyOf(response: Response): Promise<Record<string, unknown>> {
  return JSON.parse(await response.text()) as Record<string, unknown>
}

function adminRequest(
  app: ReturnType<typeof createTestApp>['app'],
  token: string,
  path: string,
  init?: { method?: string; body?: unknown },
): Promise<Response> {
  const promise = app.request(`/api/v1/admin${path}`, {
    method: init?.method ?? 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init?.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
  })
  return Promise.resolve(promise)
}

describe('admin authentication', () => {
  it('rejects requests without a bearer token', async () => {
    const { app } = createTestApp()
    const response = await app.request('/api/v1/admin/endpoints')
    expect(response.status).toBe(401)
  })

  it('rejects invalid bearer tokens', async () => {
    const { app } = createTestApp()
    const response = await adminRequest(app, 'wrong-token', '/endpoints')
    expect(response.status).toBe(401)
    const body = await bodyOf(response)
    expect((body.error as Record<string, unknown>).type).toBe('UNAUTHORIZED')
  })

  it('accepts the configured administrator token and reports the session', async () => {
    const { app, adminToken } = createTestApp()
    const response = await adminRequest(app, adminToken, '/session')
    expect(response.status).toBe(200)
    const body = await bodyOf(response)
    expect(body.email).toBe('admin@kyyinfinite.test')
    expect(body.mode).toBe('memory')
  })
})

describe('admin endpoint management', () => {
  it('lists all endpoints including drafts', async () => {
    const { app, adminToken } = createTestApp()
    const response = await adminRequest(app, adminToken, '/endpoints')
    expect(response.status).toBe(200)
    const body = await bodyOf(response)
    const endpoints = (body as { endpoints: Array<Record<string, unknown>> }).endpoints
    expect(endpoints.find((endpoint) => endpoint.slug === 'ai-chat')?.lifecycle).toBe('draft')
    expect(endpoints.find((endpoint) => endpoint.slug === 'youtube-search')?.is_active).toBe(true)
  })

  it('updates cache ttl and reflects it in the public catalog', async () => {
    const { app, adminToken } = createTestApp()
    const endpoints = await adminRequest(app, adminToken, '/endpoints')
    const list = (await bodyOf(endpoints)) as { endpoints: Array<{ id: string; slug: string; cache_ttl: number }> }
    const target = list.endpoints.find((endpoint) => endpoint.slug === 'youtube-search')
    expect(target).toBeDefined()

    const patched = await adminRequest(app, adminToken, `/endpoints/${target!.id}`, {
      method: 'PATCH',
      body: { cacheTtl: 120 },
    })
    expect(patched.status).toBe(200)

    const publicCatalog = await app.request('/api/v1/endpoints')
    const catalog = (await bodyOf(publicCatalog)) as {
      data: { endpoints: Array<{ id: string; cacheTtlSeconds: number }> }
    }
    expect(catalog.data.endpoints.find((endpoint) => endpoint.id === 'youtube-search')?.cacheTtlSeconds).toBe(120)
  })

  it('disabling an endpoint removes it from routing and the catalog', async () => {
    const { fetchImpl } = fakeProviderFetch((url) => {
      if (url.includes('/downloader/ytplay')) return jsonResponse(NEXRAY_SAMPLE)
      return fileResponse(new Uint8Array([1, 2, 3, 4]))
    })
    const { app, adminToken } = createTestApp({ fetchImpl })
    const alive = await app.request('/api/v1/youtube/search?q=laufey')
    expect(alive.status).toBe(200)

    const endpoints = await adminRequest(app, adminToken, '/endpoints')
    const list = (await bodyOf(endpoints)) as { endpoints: Array<{ id: string; slug: string }> }
    const target = list.endpoints.find((endpoint) => endpoint.slug === 'youtube-search')
    const disabled = await adminRequest(app, adminToken, `/endpoints/${target!.id}`, {
      method: 'PATCH',
      body: { isActive: false },
    })
    expect(disabled.status).toBe(200)

    const gone = await app.request('/api/v1/youtube/search?q=laufey')
    expect(gone.status).toBe(404)

    const catalog = await app.request('/api/v1/endpoints')
    const catalogBody = (await bodyOf(catalog)) as { data: { endpoints: Array<{ id: string }> } }
    expect(catalogBody.data.endpoints.find((endpoint) => endpoint.id === 'youtube-search')).toBeUndefined()

    await adminRequest(app, adminToken, `/endpoints/${target!.id}`, {
      method: 'PATCH',
      body: { isActive: true },
    })
    const restored = await app.request('/api/v1/youtube/search?q=laufey')
    expect(restored.status).toBe(200)
  })

  it('validates the endpoint patch payload', async () => {
    const { app, adminToken } = createTestApp()
    const endpoints = await adminRequest(app, adminToken, '/endpoints')
    const list = (await bodyOf(endpoints)) as { endpoints: Array<{ id: string }> }
    const response = await adminRequest(app, adminToken, `/endpoints/${list.endpoints[0].id}`, {
      method: 'PATCH',
      body: { cacheTtl: -5 },
    })
    expect(response.status).toBe(400)
  })
})

describe('admin categories, providers, incidents, settings', () => {
  it('creates and deletes a category', async () => {
    const { app, adminToken } = createTestApp()
    const created = await adminRequest(app, adminToken, '/categories', {
      method: 'POST',
      body: { name: 'Test Group', slug: 'test-group', description: 'Temporary', icon: 'search', sortOrder: 9 },
    })
    expect(created.status).toBe(201)
    const body = (await bodyOf(created)) as { category: { id: string } }

    const duplicate = await adminRequest(app, adminToken, '/categories', {
      method: 'POST',
      body: { name: 'Test Group', slug: 'test-group' },
    })
    expect(duplicate.status).toBe(400)

    const removed = await adminRequest(app, adminToken, `/categories/${body.category.id}`, { method: 'DELETE' })
    expect(removed.status).toBe(200)
  })

  it('lists providers without leaking secrets or base urls', async () => {
    const { app, adminToken } = createTestApp()
    const response = await adminRequest(app, adminToken, '/providers')
    expect(response.status).toBe(200)
    const body = (await bodyOf(response)) as { providers: Array<Record<string, unknown>> }
    expect(body.providers.length).toBeGreaterThan(0)
    const raw = JSON.stringify(body).toLowerCase()
    expect(raw).not.toContain('base_url')
    expect(raw).not.toContain('secret')
    const provider = body.providers[0]
    expect(provider.internalName).toBe('nexray')
    expect(provider.adapterType).toBe('nexray-http')
  })

  it('toggles provider availability', async () => {
    const { app, adminToken } = createTestApp()
    const providers = (await bodyOf(await adminRequest(app, adminToken, '/providers'))) as {
      providers: Array<{ id: string; isActive: boolean }>
    }
    const target = providers.providers[0]
    const patched = await adminRequest(app, adminToken, `/providers/${target.id}`, {
      method: 'PATCH',
      body: { isActive: false },
    })
    expect(patched.status).toBe(200)
    const reenabled = await adminRequest(app, adminToken, `/providers/${target.id}`, {
      method: 'PATCH',
      body: { isActive: true },
    })
    expect(reenabled.status).toBe(200)
  })

  it('saves and reads settings with a key allowlist', async () => {
    const { app, adminToken } = createTestApp()
    const saved = await adminRequest(app, adminToken, '/settings', {
      method: 'PUT',
      body: { key: 'rate_limit_overrides', value: { global: { windowSeconds: 60, max: 10 }, endpoints: {} } },
    })
    expect(saved.status).toBe(200)

    const forbidden = await adminRequest(app, adminToken, '/settings', {
      method: 'PUT',
      body: { key: 'service_role_key', value: 'attack' },
    })
    expect(forbidden.status).toBe(400)

    const settings = (await bodyOf(await adminRequest(app, adminToken, '/settings'))) as {
      settings: Array<{ setting_key: string; setting_value: unknown }>
    }
    const overrides = settings.settings.find((row) => row.setting_key === 'rate_limit_overrides')
    expect(overrides).toBeDefined()
  })

  it('flushes caches', async () => {
    const { app, adminToken } = createTestApp()
    const response = await adminRequest(app, adminToken, '/cache/flush', { method: 'POST' })
    expect(response.status).toBe(200)
  })

  it('exposes analytics for administrators only', async () => {
    const { app, adminToken } = createTestApp()
    const response = await adminRequest(app, adminToken, '/analytics')
    expect(response.status).toBe(200)
    const body = (await bodyOf(response)) as { mode: string; last24h: { requests: number } }
    expect(body.mode).toBe('memory')
  })
})

describe('maintenance endpoint', () => {
  it('rejects purge requests without a valid secret', async () => {
    const { app } = createTestApp()
    const response = await app.request('/api/v1/maintenance/purge', { method: 'POST' })
    expect(response.status).toBe(403)
  })

  it('purges old usage logs with the configured secret', async () => {
    const { app, adminToken } = createTestApp({ configOverrides: { adminConfigurationSecret: 'maintenance-secret' } })
    await app.request('/api/v1/tools/info')
    const response = await app.request('/api/v1/maintenance/purge', {
      method: 'POST',
      headers: { Authorization: 'Bearer maintenance-secret' },
    })
    expect(response.status).toBe(200)
    void adminToken
  })
})
