import { randomUUID } from 'node:crypto'
import { categoryDefinitions, endpointDefinitions } from '../../seed/definitions'
import type {
  CategoryRepository,
  CategoryRow,
  EndpointRepository,
  EndpointRow,
  EndpointWithCategory,
  IncidentRepository,
  IncidentRow,
  MappingRepository,
  MappingRow,
  NewIncident,
  NewUsageLog,
  ProviderRepository,
  ProviderRow,
  Repositories,
  SettingRow,
  SettingsRepository,
  UsageLogRepository,
  UsageLogRow,
} from './types'

const MAX_MEMORY_LOGS = 20_000

interface MemoryStore {
  categories: Map<string, CategoryRow>
  endpoints: Map<string, EndpointRow>
  providers: Map<string, ProviderRow>
  mappings: Map<string, MappingRow>
  usageLogs: UsageLogRow[]
  incidents: IncidentRow[]
  settings: Map<string, SettingRow>
  usageSeq: number
}

const nexrayProviderId = 'mem_provider_nexray'

function nowIso(): string {
  return new Date().toISOString()
}

function seedStore(): MemoryStore {
  const categories = new Map<string, CategoryRow>()
  const endpoints = new Map<string, EndpointRow>()
  const providers = new Map<string, ProviderRow>()
  const mappings = new Map<string, MappingRow>()
  const settings = new Map<string, SettingRow>()
  const timestamp = nowIso()

  const categoryIds = new Map<string, string>()
  categoryDefinitions.forEach((definition) => {
    const id = `mem_category_${definition.slug}`
    categoryIds.set(definition.slug, id)
    categories.set(id, {
      id,
      name: definition.name,
      slug: definition.slug,
      description: definition.description,
      icon: definition.icon,
      sort_order: definition.sortOrder,
      is_active: definition.isActive ?? true,
      created_at: timestamp,
      updated_at: timestamp,
    })
  })

  const activeEndpoints = endpointDefinitions.filter((definition) => definition.lifecycle === 'active')
  activeEndpoints.forEach((definition, index) => {
    const categoryId = categoryIds.get(definition.categorySlug)
    if (!categoryId) return
    const id = `mem_endpoint_${definition.slug}`
    endpoints.set(id, {
      id,
      category_id: categoryId,
      name: definition.docs.title,
      slug: definition.slug,
      public_path: definition.publicPath,
      method: definition.method,
      description: definition.docs.description,
      request_schema: definition.docs.params,
      response_schema: definition.docs.responseSchema,
      normalizer_id: definition.normalizerId ?? null,
      handler_id: definition.handlerId ?? null,
      kind: definition.kind,
      param_schema_id: definition.paramSchemaId,
      docs: definition.docs,
      is_active: true,
      lifecycle: 'active',
      cache_ttl: definition.cacheTtlSeconds,
      rate_limit: definition.rateLimit,
      sort_order: index,
      created_at: timestamp,
      updated_at: timestamp,
    })
  })

  const draftEndpoints = endpointDefinitions.filter((definition) => definition.lifecycle === 'draft')
  draftEndpoints.forEach((definition, index) => {
    const categoryId = categoryIds.get(definition.categorySlug)
    if (!categoryId) return
    const id = `mem_endpoint_${definition.slug}`
    endpoints.set(id, {
      id,
      category_id: categoryId,
      name: definition.docs.title,
      slug: definition.slug,
      public_path: definition.publicPath,
      method: definition.method,
      description: definition.docs.description,
      request_schema: definition.docs.params,
      response_schema: definition.docs.responseSchema,
      normalizer_id: definition.normalizerId ?? null,
      handler_id: definition.handlerId ?? null,
      kind: definition.kind,
      param_schema_id: definition.paramSchemaId,
      docs: definition.docs,
      is_active: false,
      lifecycle: 'draft',
      cache_ttl: definition.cacheTtlSeconds,
      rate_limit: definition.rateLimit,
      sort_order: index,
      created_at: timestamp,
      updated_at: timestamp,
    })
  })

  providers.set(nexrayProviderId, {
    id: nexrayProviderId,
    internal_name: 'nexray',
    adapter_type: 'nexray-http',
    base_url: 'https://api.nexray.eu.cc',
    configuration: {
      allowed_hosts: ['api.nexray.eu.cc'],
      timeout_ms: 20_000,
      max_response_bytes: 2_097_152,
    },
    is_active: true,
    created_at: timestamp,
    updated_at: timestamp,
  })

  const youtubeSearchRow = [...endpoints.values()].find((row) => row.slug === 'youtube-search')
  const youtubeDownloadRow = [...endpoints.values()].find((row) => row.slug === 'youtube-download')
  if (youtubeSearchRow) {
    mappings.set(`${youtubeSearchRow.id}:${nexrayProviderId}`, {
      id: `${youtubeSearchRow.id}:${nexrayProviderId}`,
      endpoint_id: youtubeSearchRow.id,
      provider_id: nexrayProviderId,
      provider_path: '/downloader/ytplay',
      priority: 1,
      configuration: { operation: 'ytplay' },
      is_active: true,
      created_at: timestamp,
      updated_at: timestamp,
    })
  }
  if (youtubeDownloadRow) {
    mappings.set(`${youtubeDownloadRow.id}:${nexrayProviderId}`, {
      id: `${youtubeDownloadRow.id}:${nexrayProviderId}`,
      endpoint_id: youtubeDownloadRow.id,
      provider_id: nexrayProviderId,
      provider_path: '/downloader/ytplay',
      priority: 1,
      configuration: { operation: 'ytplay' },
      is_active: true,
      created_at: timestamp,
      updated_at: timestamp,
    })
  }

  for (const definition of endpointDefinitions) {
    if (!definition.provider) continue
    const endpointRow = [...endpoints.values()].find((row) => row.slug === definition.slug)
    if (!endpointRow) continue
    const providerDefinition = definition.provider
    const providerId = `mem_provider_${providerDefinition.internalName}`
    if (!providers.has(providerId)) {
      providers.set(providerId, {
        id: providerId,
        internal_name: providerDefinition.internalName,
        adapter_type: 'generic-http',
        base_url: providerDefinition.baseUrl,
        configuration: {
          allowed_hosts: [new URL(providerDefinition.baseUrl).hostname],
          timeout_ms: 20_000,
          max_response_bytes: 4_194_304,
          max_file_bytes: 26_214_400,
        },
        is_active: true,
        created_at: timestamp,
        updated_at: timestamp,
      })
    }
    mappings.set(`${endpointRow.id}:${providerId}`, {
      id: `${endpointRow.id}:${providerId}`,
      endpoint_id: endpointRow.id,
      provider_id: providerId,
      provider_path: providerDefinition.providerPath,
      priority: 1,
      configuration: { paramsMap: providerDefinition.paramsMap },
      is_active: true,
      created_at: timestamp,
      updated_at: timestamp,
    })
  }

  settings.set('admin_emails', { setting_key: 'admin_emails', setting_value: [], updated_at: timestamp })
  settings.set('rate_limit_overrides', {
    setting_key: 'rate_limit_overrides',
    setting_value: { global: null, endpoints: {} },
    updated_at: timestamp,
  })

  return {
    categories,
    endpoints,
    providers,
    mappings,
    usageLogs: [],
    incidents: [],
    settings,
    usageSeq: 0,
  }
}

const globalStoreRef = globalThis as unknown as { __kyyinfiniteMemoryStore?: MemoryStore }

function getStore(): MemoryStore {
  if (!globalStoreRef.__kyyinfiniteMemoryStore) {
    globalStoreRef.__kyyinfiniteMemoryStore = seedStore()
  }
  return globalStoreRef.__kyyinfiniteMemoryStore
}

export function resetMemoryStoreForTests(): void {
  globalStoreRef.__kyyinfiniteMemoryStore = seedStore()
}

class MemoryCategoryRepository implements CategoryRepository {
  async list(): Promise<CategoryRow[]> {
    return [...getStore().categories.values()].sort((a, b) => a.sort_order - b.sort_order)
  }

  async create(input: Omit<CategoryRow, 'id' | 'created_at' | 'updated_at'>): Promise<CategoryRow> {
    const store = getStore()
    const row: CategoryRow = {
      ...input,
      id: randomUUID(),
      created_at: nowIso(),
      updated_at: nowIso(),
    }
    store.categories.set(row.id, row)
    return row
  }

  async update(id: string, patch: Partial<Omit<CategoryRow, 'id' | 'created_at'>>): Promise<CategoryRow | null> {
    const existing = getStore().categories.get(id)
    if (!existing) return null
    const updated: CategoryRow = { ...existing, ...patch, updated_at: nowIso() }
    getStore().categories.set(id, updated)
    return updated
  }

  async remove(id: string): Promise<boolean> {
    const store = getStore()
    const inUse = [...store.endpoints.values()].some((endpoint) => endpoint.category_id === id)
    if (inUse) return false
    return store.categories.delete(id)
  }
}

class MemoryEndpointRepository implements EndpointRepository {
  async listAll(): Promise<EndpointRow[]> {
    return [...getStore().endpoints.values()].sort((a, b) => a.sort_order - b.sort_order)
  }

  async listActiveWithCategory(): Promise<EndpointWithCategory[]> {
    const store = getStore()
    return [...store.endpoints.values()]
      .filter((endpoint) => endpoint.is_active)
      .map((endpoint) => {
        const category = store.categories.get(endpoint.category_id)
        return { ...endpoint, category_slug: category?.slug ?? '' }
      })
      .filter((endpoint) => endpoint.category_slug.length > 0)
      .sort((a, b) => a.sort_order - b.sort_order)
  }

  async findById(id: string): Promise<EndpointRow | null> {
    return getStore().endpoints.get(id) ?? null
  }

  async findBySlug(slug: string): Promise<EndpointRow | null> {
    for (const row of getStore().endpoints.values()) {
      if (row.slug === slug) return row
    }
    return null
  }

  async createFromDefinition(
    input: Omit<EndpointRow, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<EndpointRow> {
    const store = getStore()
    for (const row of store.endpoints.values()) {
      if (row.slug === input.slug || (row.public_path === input.public_path && row.method === input.method)) {
        throw new Error('endpoint_conflict')
      }
    }
    const row: EndpointRow = {
      ...input,
      id: randomUUID(),
      created_at: nowIso(),
      updated_at: nowIso(),
    }
    store.endpoints.set(row.id, row)
    return row
  }

  async update(id: string, patch: Partial<Omit<EndpointRow, 'id' | 'created_at'>>): Promise<EndpointRow | null> {
    const existing = getStore().endpoints.get(id)
    if (!existing) return null
    const updated: EndpointRow = { ...existing, ...patch, updated_at: nowIso() }
    getStore().endpoints.set(id, updated)
    return updated
  }
}

class MemoryProviderRepository implements ProviderRepository {
  async list(): Promise<ProviderRow[]> {
    return [...getStore().providers.values()]
  }

  async findById(id: string): Promise<ProviderRow | null> {
    return getStore().providers.get(id) ?? null
  }

  async update(id: string, patch: Partial<Omit<ProviderRow, 'id' | 'created_at'>>): Promise<ProviderRow | null> {
    const existing = getStore().providers.get(id)
    if (!existing) return null
    const updated: ProviderRow = { ...existing, ...patch, updated_at: nowIso() }
    getStore().providers.set(id, updated)
    return updated
  }
}

class MemoryMappingRepository implements MappingRepository {
  async list(): Promise<MappingRow[]> {
    return [...getStore().mappings.values()]
  }

  async listActiveForEndpoint(endpointId: string): Promise<MappingRow[]> {
    return [...getStore().mappings.values()]
      .filter((mapping) => mapping.endpoint_id === endpointId && mapping.is_active)
      .sort((a, b) => a.priority - b.priority)
  }

  async update(id: string, patch: Partial<Omit<MappingRow, 'id' | 'created_at'>>): Promise<MappingRow | null> {
    const existing = getStore().mappings.get(id)
    if (!existing) return null
    const updated: MappingRow = { ...existing, ...patch, updated_at: nowIso() }
    getStore().mappings.set(id, updated)
    return updated
  }
}

class MemoryUsageLogRepository implements UsageLogRepository {
  async insert(log: NewUsageLog): Promise<void> {
    const store = getStore()
    store.usageSeq += 1
    store.usageLogs.push({
      id: store.usageSeq,
      ...log,
      created_at: nowIso(),
    })
    if (store.usageLogs.length > MAX_MEMORY_LOGS) {
      store.usageLogs.splice(0, store.usageLogs.length - MAX_MEMORY_LOGS)
    }
  }

  async recentSince(cutoffIso: string, limit: number): Promise<UsageLogRow[]> {
    const cutoff = Date.parse(cutoffIso)
    return getStore()
      .usageLogs.filter((log) => Date.parse(log.created_at) >= cutoff)
      .slice(-limit)
  }

  async countSince(cutoffIso: string): Promise<number> {
    const cutoff = Date.parse(cutoffIso)
    return getStore().usageLogs.filter((log) => Date.parse(log.created_at) >= cutoff).length
  }

  async purgeBefore(cutoffIso: string): Promise<number> {
    const store = getStore()
    const cutoff = Date.parse(cutoffIso)
    const before = store.usageLogs.length
    store.usageLogs = store.usageLogs.filter((log) => Date.parse(log.created_at) >= cutoff)
    return before - store.usageLogs.length
  }
}

class MemoryIncidentRepository implements IncidentRepository {
  async create(incident: NewIncident): Promise<IncidentRow> {
    const store = getStore()
    const row: IncidentRow = {
      id: randomUUID(),
      ...incident,
      status: 'open',
      created_at: nowIso(),
      resolved_at: null,
    }
    store.incidents.unshift(row)
    if (store.incidents.length > 500) {
      store.incidents.length = 500
    }
    return row
  }

  async recent(limit: number): Promise<IncidentRow[]> {
    return getStore().incidents.slice(0, limit)
  }

  async resolve(id: string): Promise<IncidentRow | null> {
    const row = getStore().incidents.find((incident) => incident.id === id)
    if (!row) return null
    row.status = 'resolved'
    row.resolved_at = nowIso()
    return row
  }
}

class MemorySettingsRepository implements SettingsRepository {
  async get(key: string): Promise<unknown | null> {
    const row = getStore().settings.get(key)
    return row ? row.setting_value : null
  }

  async set(key: string, value: unknown): Promise<void> {
    getStore().settings.set(key, { setting_key: key, setting_value: value, updated_at: nowIso() })
  }

  async all(): Promise<SettingRow[]> {
    return [...getStore().settings.values()]
  }
}

export function createMemoryRepositories(): Repositories {
  return {
    categories: new MemoryCategoryRepository(),
    endpoints: new MemoryEndpointRepository(),
    providers: new MemoryProviderRepository(),
    mappings: new MemoryMappingRepository(),
    usageLogs: new MemoryUsageLogRepository(),
    incidents: new MemoryIncidentRepository(),
    settings: new MemorySettingsRepository(),
    mode: 'memory',
  }
}
