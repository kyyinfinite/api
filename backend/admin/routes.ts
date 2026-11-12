import { Hono } from 'hono'
import { z } from 'zod'
import type { Context } from 'hono'
import type { AppConfig } from '../config/env'
import type { Repositories } from '../database/repositories/types'
import {
  AppError,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../core/errors'
import { errorEnvelope, jsonHeaders } from '../core/response'
import { newRequestId } from '../core/request'
import { securityHeaderValues } from '../middleware/security'
import type { RegistryCache } from '../core/registry'
import { MemoryCache } from '../core/cache'
import { buildAdminAnalytics } from '../services/analytics'
import type { AdminAuthenticator } from './auth'

export interface AdminDeps {
  config: AppConfig
  repos: Repositories
  registry: RegistryCache
  responseCache: MemoryCache<Record<string, unknown>>
  settingsCache: MemoryCache<unknown>
  authenticator: AdminAuthenticator
}

export interface AdminEnv {
  Variables: {
    'admin-email': string
  }
}

const EDITABLE_SETTINGS_KEYS = ['rate_limit_overrides', 'admin_emails', 'download_limits']

const categoryCreateSchema = z.object({
  name: z.string().trim().min(2).max(60),
  slug: z.string().trim().regex(/^[a-z0-9-]{2,40}$/),
  description: z.string().trim().max(200).optional().default(''),
  icon: z.enum(['ai', 'download', 'search', 'image', 'whatsapp', 'information']).optional().default('information'),
  sortOrder: z.number().int().min(0).max(1000).optional().default(0),
  isActive: z.boolean().optional().default(true),
})

const categoryPatchSchema = z.object({
  name: z.string().trim().min(2).max(60).optional(),
  description: z.string().trim().max(200).optional(),
  icon: z.enum(['ai', 'download', 'search', 'image', 'whatsapp', 'information']).optional(),
  sortOrder: z.number().int().min(0).max(1000).optional(),
  isActive: z.boolean().optional(),
})

const endpointPatchSchema = z.object({
  isActive: z.boolean().optional(),
  cacheTtl: z.number().int().min(0).max(86_400).optional(),
  rateLimit: z
    .object({ windowSeconds: z.number().int().min(1).max(3600), max: z.number().int().min(1).max(10_000) })
    .nullable()
    .optional(),
})

const settingPutSchema = z.object({
  key: z.string().regex(/^[a-z0-9_]{2,60}$/),
  value: z.unknown(),
})

function maskConfiguration(configuration: Record<string, unknown>): Record<string, unknown> {
  const masked: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(configuration)) {
    masked[key] = /secret|token|password|credential|private/i.test(key) ? '***' : value
  }
  return masked
}

function adminJson(c: Context, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...jsonHeaders(0),
      ...securityHeaderValues(),
      'X-Request-Id': c.req.header('x-request-id') ?? newRequestId(),
    },
  })
}

export function createAdminRouter(deps: AdminDeps): Hono<AdminEnv> {
  const router = new Hono<AdminEnv>()

  router.onError((error, c) => {
    const appError =
      error instanceof AppError
        ? error
        : new AppError(500, 'INTERNAL_ERROR', 'An unexpected error occurred.', {
            internalDetails: error instanceof Error ? error.message : String(error),
          })
    const envelope = errorEnvelope({
      config: deps.config,
      error: appError,
      requestId: c.req.header('x-request-id') ?? newRequestId(),
      startedAt: Date.now(),
    })
    return adminJson(c, envelope, appError.statusCode)
  })

  router.use('*', async (c, next) => {
    const header = c.req.header('authorization')
    if (!header || !header.startsWith('Bearer ')) {
      throw new UnauthorizedError()
    }
    const user = await deps.authenticator.verify(header.slice(7).trim())
    if (!user) {
      throw new UnauthorizedError('The supplied credentials are not valid for this dashboard.')
    }
    c.set('admin-email', user.email)
    await next()
  })

  router.get('/session', (c) => adminJson(c, { email: c.get('admin-email'), mode: deps.repos.mode }))

  router.get('/categories', async (c) => {
    const rows = await deps.repos.categories.list()
    return adminJson(c, { categories: rows })
  })

  router.post('/categories', async (c) => {
    const parsed = categoryCreateSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) {
      throw new BadRequestError('The category payload is invalid.', parsed.error.issues[0]?.message)
    }
    const existing = await deps.repos.categories.list()
    if (existing.some((row) => row.slug === parsed.data.slug)) {
      throw new BadRequestError('A category with this slug already exists.')
    }
    const created = await deps.repos.categories.create({
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description,
      icon: parsed.data.icon,
      sort_order: parsed.data.sortOrder,
      is_active: parsed.data.isActive,
    })
    deps.registry.invalidate()
    return adminJson(c, { category: created }, 201)
  })

  router.patch('/categories/:id', async (c) => {
    const parsed = categoryPatchSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) {
      throw new BadRequestError('The category payload is invalid.', parsed.error.issues[0]?.message)
    }
    const updated = await deps.repos.categories.update(c.req.param('id'), {
      ...(parsed.data.name !== undefined ? { name: parsed.data.name } : {}),
      ...(parsed.data.description !== undefined ? { description: parsed.data.description } : {}),
      ...(parsed.data.icon !== undefined ? { icon: parsed.data.icon } : {}),
      ...(parsed.data.sortOrder !== undefined ? { sort_order: parsed.data.sortOrder } : {}),
      ...(parsed.data.isActive !== undefined ? { is_active: parsed.data.isActive } : {}),
    })
    if (!updated) {
      throw new NotFoundError('Category not found.')
    }
    deps.registry.invalidate()
    return adminJson(c, { category: updated })
  })

  router.delete('/categories/:id', async (c) => {
    const removed = await deps.repos.categories.remove(c.req.param('id'))
    if (!removed) {
      throw new BadRequestError('The category is still in use or does not exist.')
    }
    deps.registry.invalidate()
    return adminJson(c, { removed: true })
  })

  router.get('/endpoints', async (c) => {
    const rows = await deps.repos.endpoints.listAll()
    return adminJson(c, { endpoints: rows })
  })

  router.patch('/endpoints/:id', async (c) => {
    const parsed = endpointPatchSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success) {
      throw new BadRequestError('The endpoint payload is invalid.', parsed.error.issues[0]?.message)
    }
    const existing = await deps.repos.endpoints.findById(c.req.param('id'))
    if (!existing) {
      throw new NotFoundError('Endpoint not found.')
    }
    const patch: Record<string, unknown> = {}
    if (parsed.data.isActive !== undefined) {
      patch.is_active = parsed.data.isActive
      patch.lifecycle = parsed.data.isActive ? 'active' : existing.lifecycle === 'active' ? 'disabled' : existing.lifecycle
    }
    if (parsed.data.cacheTtl !== undefined) {
      patch.cache_ttl = parsed.data.cacheTtl
    }
    if (parsed.data.rateLimit !== undefined) {
      patch.rate_limit = parsed.data.rateLimit
    }
    const updated = await deps.repos.endpoints.update(existing.id, patch)
    if (!updated) {
      throw new NotFoundError('Endpoint not found.')
    }
    deps.registry.invalidate()
    return adminJson(c, { endpoint: updated })
  })

  router.get('/providers', async (c) => {
    const rows = await deps.repos.providers.list()
    return adminJson(c, {
      providers: rows.map((row) => ({
        id: row.id,
        internalName: row.internal_name,
        adapterType: row.adapter_type,
        isActive: row.is_active,
        configuration: maskConfiguration(row.configuration),
        updatedAt: row.updated_at,
      })),
    })
  })

  router.patch('/providers/:id', async (c) => {
    const body = await c.req.json().catch(() => null)
    const parsed = z.object({ isActive: z.boolean() }).safeParse(body)
    if (!parsed.success) {
      throw new BadRequestError('The provider payload is invalid.')
    }
    const updated = await deps.repos.providers.update(c.req.param('id'), {
      is_active: parsed.data.isActive,
    })
    if (!updated) {
      throw new NotFoundError('Provider not found.')
    }
    deps.registry.invalidate()
    return adminJson(c, { provider: { id: updated.id, isActive: updated.is_active } })
  })

  router.get('/mappings', async (c) => {
    const rows = await deps.repos.mappings.list()
    return adminJson(c, {
      mappings: rows.map((row) => ({
        id: row.id,
        endpointId: row.endpoint_id,
        providerId: row.provider_id,
        providerPath: row.provider_path,
        priority: row.priority,
        isActive: row.is_active,
      })),
    })
  })

  router.get('/incidents', async (c) => {
    const rows = await deps.repos.incidents.recent(50)
    return adminJson(c, { incidents: rows })
  })

  router.patch('/incidents/:id/resolve', async (c) => {
    const resolved = await deps.repos.incidents.resolve(c.req.param('id'))
    if (!resolved) {
      throw new NotFoundError('Incident not found.')
    }
    return adminJson(c, { incident: resolved })
  })

  router.get('/analytics', async (c) => {
    const analytics = await buildAdminAnalytics(deps.repos)
    return adminJson(c, analytics)
  })

  router.get('/settings', async (c) => {
    const rows = await deps.repos.settings.all()
    return adminJson(c, { settings: rows })
  })

  router.put('/settings', async (c) => {
    const parsed = settingPutSchema.safeParse(await c.req.json().catch(() => null))
    if (!parsed.success || !EDITABLE_SETTINGS_KEYS.includes(parsed.data.key)) {
      throw new BadRequestError('This setting key cannot be modified.')
    }
    await deps.repos.settings.set(parsed.data.key, parsed.data.value)
    deps.settingsCache.flush()
    deps.registry.invalidate()
    return adminJson(c, { saved: true })
  })

  router.post('/cache/flush', (c) => {
    deps.responseCache.flush()
    deps.settingsCache.flush()
    deps.registry.invalidate()
    return adminJson(c, { flushed: true })
  })

  return router
}
