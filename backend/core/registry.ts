import { endpointDefinitions } from '../seed/definitions'
import { getNativeHandler, getStreamHandler } from '../services/handlers'
import { getNormalizer } from '../providers/normalizers'
import { getParamSchema } from './param-schemas'
import { recordIncidentSafe } from '../services/incidents'
import type { EndpointKind, EndpointRateLimit } from './registry-types'
import type { EndpointWithCategory, Repositories } from '../database/repositories/types'

export interface ResolvedEndpoint {
  endpointId: string
  slug: string
  publicPath: string
  method: 'GET' | 'POST'
  kind: EndpointKind
  handlerId: string | null
  normalizerId: string | null
  paramSchemaId: string
  cacheTtlSeconds: number
  rateLimit: EndpointRateLimit | null
  categorySlug: string
}

export interface RegistrySnapshot {
  routes: Map<string, ResolvedEndpoint>
  loadedAt: number
  source: 'supabase' | 'fallback'
}

const REGISTRY_TTL_MS = 60_000
const FORBIDDEN_PREFIXES = ['/api/v1/admin', '/api/v1/maintenance']
const PATH_PATTERN = /^\/api\/v1\/[a-z0-9][a-z0-9\-/]*$/

function validateResolvedPath(path: string): boolean {
  if (!PATH_PATTERN.test(path) || path.includes('..')) return false
  for (const prefix of FORBIDDEN_PREFIXES) {
    if (path === prefix || path.startsWith(`${prefix}/`)) return false
  }
  return true
}

function resolveFromDefinition(slug: string, endpointId: string): ResolvedEndpoint | null {
  const definition = endpointDefinitions.find((entry) => entry.slug === slug)
  if (!definition || definition.lifecycle !== 'active') return null
  if (!validateResolvedPath(definition.publicPath)) return null
  if (!getParamSchema(definition.paramSchemaId)) return null
  if (definition.kind === 'native' && (!definition.handlerId || !getNativeHandler(definition.handlerId))) return null
  if (definition.kind === 'stream' && (!definition.handlerId || !getStreamHandler(definition.handlerId))) return null
  if (definition.kind === 'provider' && (!definition.normalizerId || !getNormalizer(definition.normalizerId))) return null
  return {
    endpointId,
    slug: definition.slug,
    publicPath: definition.publicPath,
    method: definition.method,
    kind: definition.kind,
    handlerId: definition.handlerId ?? null,
    normalizerId: definition.normalizerId ?? null,
    paramSchemaId: definition.paramSchemaId,
    cacheTtlSeconds: definition.cacheTtlSeconds,
    rateLimit: definition.rateLimit,
    categorySlug: definition.categorySlug,
  }
}

function validateRow(row: EndpointWithCategory): string | ResolvedEndpoint {
  if (!validateResolvedPath(row.public_path)) return 'invalid path'
  if (!getParamSchema(row.param_schema_id)) return 'unknown param schema'
  if (row.kind === 'provider') {
    if (!row.normalizer_id || !getNormalizer(row.normalizer_id)) return 'unknown normalizer'
  } else if (row.kind === 'native') {
    if (!row.handler_id || !getNativeHandler(row.handler_id)) return 'unknown native handler'
  } else if (row.kind === 'stream') {
    if (!row.handler_id || !getStreamHandler(row.handler_id)) return 'unknown stream handler'
  }
  if (!Number.isFinite(row.cache_ttl) || row.cache_ttl < 0) return 'invalid cache ttl'
  return {
    endpointId: row.id,
    slug: row.slug,
    publicPath: row.public_path,
    method: row.method,
    kind: row.kind,
    handlerId: row.handler_id,
    normalizerId: row.normalizer_id,
    paramSchemaId: row.param_schema_id,
    cacheTtlSeconds: row.cache_ttl,
    rateLimit: row.rate_limit,
    categorySlug: row.category_slug,
  }
}

async function loadSnapshot(repos: Repositories): Promise<RegistrySnapshot> {
  const routes = new Map<string, ResolvedEndpoint>()
  if (repos.mode === 'memory') {
    const rows = await repos.endpoints.listAll()
    for (const row of rows) {
      if (!row.is_active) continue
      const resolved = resolveFromDefinition(row.slug, row.id)
      if (!resolved) continue
      routes.set(`${resolved.method} ${resolved.publicPath}`, resolved)
    }
    return { routes, loadedAt: Date.now(), source: 'fallback' }
  }

  const rows = await repos.endpoints.listActiveWithCategory()
  for (const row of rows) {
    const outcome = validateRow(row)
    if (typeof outcome === 'string') {
      await recordIncidentSafe(repos, {
        endpoint_id: row.id,
        incident_type: 'registry_invalid_endpoint',
        message: 'One or more services were temporarily hidden while their configuration is being repaired.',
        severity: 'minor',
      })
      continue
    }
    const routeKey = `${outcome.method} ${outcome.publicPath}`
    const existing = routes.get(routeKey)
    if (existing) {
      await recordIncidentSafe(repos, {
        endpoint_id: row.id,
        incident_type: 'registry_route_conflict',
        message: 'One or more services were temporarily hidden due to a routing conflict.',
        severity: 'minor',
      })
      continue
    }
    routes.set(routeKey, outcome)
  }
  return { routes, loadedAt: Date.now(), source: 'supabase' }
}

export class RegistryCache {
  private snapshot: RegistrySnapshot | null = null
  private inflight: Promise<RegistrySnapshot> | null = null

  constructor(private readonly repos: Repositories) {}

  async get(): Promise<RegistrySnapshot> {
    if (this.snapshot && Date.now() - this.snapshot.loadedAt < REGISTRY_TTL_MS) {
      return this.snapshot
    }
    if (!this.inflight) {
      this.inflight = loadSnapshot(this.repos)
        .then((snapshot) => {
          this.snapshot = snapshot
          return snapshot
        })
        .finally(() => {
          this.inflight = null
        })
    }
    return this.inflight
  }

  invalidate(): void {
    this.snapshot = null
  }
}
