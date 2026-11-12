import type { EndpointDocs, EndpointLifecycle, EndpointKind, EndpointRateLimit } from '../../core/registry-types'

export interface CategoryRow {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface EndpointRow {
  id: string
  category_id: string
  name: string
  slug: string
  public_path: string
  method: 'GET' | 'POST'
  description: string
  request_schema: unknown
  response_schema: unknown
  normalizer_id: string | null
  handler_id: string | null
  kind: EndpointKind
  param_schema_id: string
  docs: EndpointDocs
  is_active: boolean
  lifecycle: EndpointLifecycle
  cache_ttl: number
  rate_limit: EndpointRateLimit | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface EndpointWithCategory extends EndpointRow {
  category_slug: string
}

export interface ProviderRow {
  id: string
  internal_name: string
  adapter_type: string
  base_url: string
  configuration: Record<string, unknown>
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MappingRow {
  id: string
  endpoint_id: string
  provider_id: string
  provider_path: string
  priority: number
  configuration: Record<string, unknown>
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UsageLogRow {
  id: number
  request_id: string
  endpoint_id: string | null
  client_ip_hash: string
  status_code: number
  duration_ms: number
  cache_status: string
  created_at: string
}

export interface IncidentRow {
  id: string
  endpoint_id: string | null
  incident_type: string
  message: string
  severity: 'minor' | 'major' | 'critical'
  status: 'open' | 'resolved'
  created_at: string
  resolved_at: string | null
}

export interface SettingRow {
  setting_key: string
  setting_value: unknown
  updated_at: string
}

export interface NewUsageLog {
  request_id: string
  endpoint_id: string | null
  client_ip_hash: string
  status_code: number
  duration_ms: number
  cache_status: string
}

export interface NewIncident {
  endpoint_id: string | null
  incident_type: string
  message: string
  severity: IncidentRow['severity']
}

export interface CategoryRepository {
  list(): Promise<CategoryRow[]>
  create(input: Omit<CategoryRow, 'id' | 'created_at' | 'updated_at'>): Promise<CategoryRow>
  update(id: string, patch: Partial<Omit<CategoryRow, 'id' | 'created_at'>>): Promise<CategoryRow | null>
  remove(id: string): Promise<boolean>
}

export interface EndpointRepository {
  listAll(): Promise<EndpointRow[]>
  listActiveWithCategory(): Promise<EndpointWithCategory[]>
  findById(id: string): Promise<EndpointRow | null>
  findBySlug(slug: string): Promise<EndpointRow | null>
  createFromDefinition(input: Omit<EndpointRow, 'id' | 'created_at' | 'updated_at'>): Promise<EndpointRow>
  update(id: string, patch: Partial<Omit<EndpointRow, 'id' | 'created_at'>>): Promise<EndpointRow | null>
}

export interface ProviderRepository {
  list(): Promise<ProviderRow[]>
  findById(id: string): Promise<ProviderRow | null>
  update(id: string, patch: Partial<Omit<ProviderRow, 'id' | 'created_at'>>): Promise<ProviderRow | null>
}

export interface MappingRepository {
  list(): Promise<MappingRow[]>
  listActiveForEndpoint(endpointId: string): Promise<MappingRow[]>
  update(id: string, patch: Partial<Omit<MappingRow, 'id' | 'created_at'>>): Promise<MappingRow | null>
}

export interface UsageLogRepository {
  insert(log: NewUsageLog): Promise<void>
  recentSince(cutoffIso: string, limit: number): Promise<UsageLogRow[]>
  countSince(cutoffIso: string): Promise<number>
  purgeBefore(cutoffIso: string): Promise<number>
}

export interface IncidentRepository {
  create(incident: NewIncident): Promise<IncidentRow>
  recent(limit: number): Promise<IncidentRow[]>
  resolve(id: string): Promise<IncidentRow | null>
}

export interface SettingsRepository {
  get(key: string): Promise<unknown | null>
  set(key: string, value: unknown): Promise<void>
  all(): Promise<SettingRow[]>
}

export interface Repositories {
  categories: CategoryRepository
  endpoints: EndpointRepository
  providers: ProviderRepository
  mappings: MappingRepository
  usageLogs: UsageLogRepository
  incidents: IncidentRepository
  settings: SettingsRepository
  mode: 'supabase' | 'memory'
}
