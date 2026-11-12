import type { SupabaseClient } from '@supabase/supabase-js'
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
import { ServiceUnavailableError, logInternalError } from '../../core/errors'

function wrapError(scope: string, error: unknown): never {
  logInternalError(scope, error)
  throw new ServiceUnavailableError('Data layer temporarily unavailable.', scope)
}

export class SupabaseCategoryRepository implements CategoryRepository {
  constructor(private readonly client: SupabaseClient) {}

  async list(): Promise<CategoryRow[]> {
    const { data, error } = await this.client
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
    if (error) wrapError('categories.list', error)
    return (data ?? []) as CategoryRow[]
  }

  async create(input: Omit<CategoryRow, 'id' | 'created_at' | 'updated_at'>): Promise<CategoryRow> {
    const { data, error } = await this.client.from('categories').insert(input).select('*').single()
    if (error) wrapError('categories.create', error)
    return data as CategoryRow
  }

  async update(id: string, patch: Partial<Omit<CategoryRow, 'id' | 'created_at'>>): Promise<CategoryRow | null> {
    const { data, error } = await this.client
      .from('categories')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .maybeSingle()
    if (error) wrapError('categories.update', error)
    return (data as CategoryRow) ?? null
  }

  async remove(id: string): Promise<boolean> {
    const { data, error } = await this.client.from('categories').delete().eq('id', id).select('id')
    if (error) wrapError('categories.remove', error)
    return (data ?? []).length > 0
  }
}

export class SupabaseEndpointRepository implements EndpointRepository {
  constructor(private readonly client: SupabaseClient) {}

  async listAll(): Promise<EndpointRow[]> {
    const { data, error } = await this.client
      .from('api_endpoints')
      .select('*')
      .order('sort_order', { ascending: true })
    if (error) wrapError('endpoints.listAll', error)
    return (data ?? []) as EndpointRow[]
  }

  async listActiveWithCategory(): Promise<EndpointWithCategory[]> {
    const { data, error } = await this.client
      .from('api_endpoints')
      .select('*, categories(slug)')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
    if (error) wrapError('endpoints.listActiveWithCategory', error)
    const rows = (data ?? []) as Array<EndpointRow & { categories?: { slug?: string } | null }>
    return rows
      .map(({ categories, ...rest }) => ({ ...rest, category_slug: categories?.slug ?? '' }))
      .filter((row) => row.category_slug.length > 0)
  }

  async findById(id: string): Promise<EndpointRow | null> {
    const { data, error } = await this.client.from('api_endpoints').select('*').eq('id', id).maybeSingle()
    if (error) wrapError('endpoints.findById', error)
    return (data as EndpointRow) ?? null
  }

  async findBySlug(slug: string): Promise<EndpointRow | null> {
    const { data, error } = await this.client.from('api_endpoints').select('*').eq('slug', slug).maybeSingle()
    if (error) wrapError('endpoints.findBySlug', error)
    return (data as EndpointRow) ?? null
  }

  async createFromDefinition(
    input: Omit<EndpointRow, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<EndpointRow> {
    const { data, error } = await this.client.from('api_endpoints').insert(input).select('*').single()
    if (error) {
      if (error.code === '23505') {
        throw new Error('endpoint_conflict')
      }
      wrapError('endpoints.create', error)
    }
    return data as EndpointRow
  }

  async update(id: string, patch: Partial<Omit<EndpointRow, 'id' | 'created_at'>>): Promise<EndpointRow | null> {
    const { data, error } = await this.client
      .from('api_endpoints')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .maybeSingle()
    if (error) wrapError('endpoints.update', error)
    return (data as EndpointRow) ?? null
  }
}

export class SupabaseProviderRepository implements ProviderRepository {
  constructor(private readonly client: SupabaseClient) {}

  async list(): Promise<ProviderRow[]> {
    const { data, error } = await this.client.from('providers').select('*')
    if (error) wrapError('providers.list', error)
    return (data ?? []) as ProviderRow[]
  }

  async findById(id: string): Promise<ProviderRow | null> {
    const { data, error } = await this.client.from('providers').select('*').eq('id', id).maybeSingle()
    if (error) wrapError('providers.findById', error)
    return (data as ProviderRow) ?? null
  }

  async update(id: string, patch: Partial<Omit<ProviderRow, 'id' | 'created_at'>>): Promise<ProviderRow | null> {
    const { data, error } = await this.client
      .from('providers')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .maybeSingle()
    if (error) wrapError('providers.update', error)
    return (data as ProviderRow) ?? null
  }
}

export class SupabaseMappingRepository implements MappingRepository {
  constructor(private readonly client: SupabaseClient) {}

  async list(): Promise<MappingRow[]> {
    const { data, error } = await this.client.from('endpoint_provider_mappings').select('*')
    if (error) wrapError('mappings.list', error)
    return (data ?? []) as MappingRow[]
  }

  async listActiveForEndpoint(endpointId: string): Promise<MappingRow[]> {
    const { data, error } = await this.client
      .from('endpoint_provider_mappings')
      .select('*')
      .eq('endpoint_id', endpointId)
      .eq('is_active', true)
      .order('priority', { ascending: true })
    if (error) wrapError('mappings.listActiveForEndpoint', error)
    return (data ?? []) as MappingRow[]
  }

  async update(id: string, patch: Partial<Omit<MappingRow, 'id' | 'created_at'>>): Promise<MappingRow | null> {
    const { data, error } = await this.client
      .from('endpoint_provider_mappings')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .maybeSingle()
    if (error) wrapError('mappings.update', error)
    return (data as MappingRow) ?? null
  }
}

export class SupabaseUsageLogRepository implements UsageLogRepository {
  constructor(private readonly client: SupabaseClient) {}

  async insert(log: NewUsageLog): Promise<void> {
    const { error } = await this.client.from('api_usage_logs').insert(log)
    if (error) {
      logInternalError('usage-logs.insert', error)
    }
  }

  async recentSince(cutoffIso: string, limit: number): Promise<UsageLogRow[]> {
    const { data, error } = await this.client
      .from('api_usage_logs')
      .select('*')
      .gte('created_at', cutoffIso)
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) wrapError('usage-logs.recentSince', error)
    return (data ?? []) as UsageLogRow[]
  }

  async countSince(cutoffIso: string): Promise<number> {
    const { count, error } = await this.client
      .from('api_usage_logs')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', cutoffIso)
    if (error) wrapError('usage-logs.countSince', error)
    return count ?? 0
  }

  async purgeBefore(cutoffIso: string): Promise<number> {
    const { data, error } = await this.client
      .from('api_usage_logs')
      .delete()
      .lt('created_at', cutoffIso)
      .select('id')
    if (error) wrapError('usage-logs.purgeBefore', error)
    return (data ?? []).length
  }
}

export class SupabaseIncidentRepository implements IncidentRepository {
  constructor(private readonly client: SupabaseClient) {}

  async create(incident: NewIncident): Promise<IncidentRow> {
    const { data, error } = await this.client.from('system_incidents').insert(incident).select('*').single()
    if (error) {
      logInternalError('incidents.create', error)
      throw error
    }
    return data as IncidentRow
  }

  async recent(limit: number): Promise<IncidentRow[]> {
    const { data, error } = await this.client
      .from('system_incidents')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) wrapError('incidents.recent', error)
    return (data ?? []) as IncidentRow[]
  }

  async resolve(id: string): Promise<IncidentRow | null> {
    const { data, error } = await this.client
      .from('system_incidents')
      .update({ status: 'resolved', resolved_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .maybeSingle()
    if (error) wrapError('incidents.resolve', error)
    return (data as IncidentRow) ?? null
  }
}

export class SupabaseSettingsRepository implements SettingsRepository {
  constructor(private readonly client: SupabaseClient) {}

  async get(key: string): Promise<unknown | null> {
    const { data, error } = await this.client
      .from('admin_settings')
      .select('setting_value')
      .eq('setting_key', key)
      .maybeSingle()
    if (error) wrapError('settings.get', error)
    return data ? (data as { setting_value: unknown }).setting_value : null
  }

  async set(key: string, value: unknown): Promise<void> {
    const { error } = await this.client
      .from('admin_settings')
      .upsert({ setting_key: key, setting_value: value, updated_at: new Date().toISOString() })
    if (error) wrapError('settings.set', error)
  }

  async all(): Promise<SettingRow[]> {
    const { data, error } = await this.client.from('admin_settings').select('*')
    if (error) wrapError('settings.all', error)
    return (data ?? []) as SettingRow[]
  }
}

export function createSupabaseRepositories(client: SupabaseClient): Repositories {
  return {
    categories: new SupabaseCategoryRepository(client),
    endpoints: new SupabaseEndpointRepository(client),
    providers: new SupabaseProviderRepository(client),
    mappings: new SupabaseMappingRepository(client),
    usageLogs: new SupabaseUsageLogRepository(client),
    incidents: new SupabaseIncidentRepository(client),
    settings: new SupabaseSettingsRepository(client),
    mode: 'supabase',
  }
}
