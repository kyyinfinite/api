import { request } from './client'
import type { ApiCategory, ApiEndpoint } from './api.types'
import { ApiError } from './api.errors'

interface EnvelopeBody<T> {
  status?: string
  data?: T
}

interface CatalogCategoryDto {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  sortOrder: number
}

interface CatalogEndpointDto {
  id: string
  category: string
  title: string
  summary: string
  description: string
  method: ApiEndpoint['method']
  path: string
  auth: string
  free: boolean
  params: ApiEndpoint['params']
  headers: ApiEndpoint['headers']
  requestExample: Record<string, unknown> | null
  responseExample: Record<string, unknown>
  responseSchema: ApiEndpoint['responseSchema']
  errorCodes: ApiEndpoint['errorCodes']
  cacheTtlSeconds: number
  rateLimit: { windowSeconds: number; max: number } | null
}

export interface CatalogSnapshot {
  categories: ApiCategory[]
  endpoints: ApiEndpoint[]
}

export interface StatusIncident {
  id: string
  title: string
  severity: 'minor' | 'major' | 'maintenance'
  status: 'open' | 'resolved' | 'monitoring' | 'ongoing'
  date: string
  duration?: string
  description: string
}

export interface StatusServiceGroup {
  id: string
  name: string
  description: string
  status: 'operational' | 'degraded' | 'maintenance'
  responseTimeMs: number
  history: Array<{ date: string; uptime: number; degraded: boolean }>
}

export interface StatusSnapshot {
  overall: 'operational' | 'degraded'
  uptimePercent: number
  windowDays: number
  avgResponseMs: number
  serviceGroups: StatusServiceGroup[]
  incidents: StatusIncident[]
}

interface StatusDto {
  overall: StatusSnapshot['overall']
  uptimePercent: number
  windowDays: number
  avgResponseMs: number
  serviceGroups: StatusServiceGroup[]
  incidents: Array<{
    id: string
    title: string
    severity: string
    status: string
    date: string
    description: string
  }>
}

function mapCategory(dto: CatalogCategoryDto): ApiCategory {
  return {
    id: dto.slug,
    slug: dto.slug,
    index: String(dto.sortOrder).padStart(2, '0'),
    name: dto.name,
    description: dto.description,
    icon: dto.icon,
  }
}

function mapEndpoint(dto: CatalogEndpointDto): ApiEndpoint {
  return {
    id: dto.id,
    category: dto.category,
    title: dto.title,
    summary: dto.summary,
    description: dto.description,
    method: dto.method,
    path: dto.path,
    auth: 'none',
    free: true,
    params: dto.params,
    headers: dto.headers,
    requestExample: dto.requestExample,
    responseExample: dto.responseExample,
    responseSchema: dto.responseSchema,
    errorCodes: dto.errorCodes,
  }
}

async function envelopeData<T>(path: string): Promise<T> {
  const response = await request<EnvelopeBody<T>>({ method: 'GET', path })
  const body = response.data
  if (!body || body.status !== 'success' || body.data === undefined) {
    throw new ApiError(response.status, `The ${path} response could not be read.`)
  }
  return body.data
}

export async function fetchCatalog(): Promise<CatalogSnapshot> {
  const [categoryPayload, endpointPayload] = await Promise.all([
    envelopeData<{ categories: CatalogCategoryDto[] }>('/api/v1/categories'),
    envelopeData<{ endpoints: CatalogEndpointDto[] }>('/api/v1/endpoints'),
  ])
  return {
    categories: categoryPayload.categories.map(mapCategory),
    endpoints: endpointPayload.endpoints.map(mapEndpoint),
  }
}

export async function fetchStatus(): Promise<StatusSnapshot> {
  const dto = await envelopeData<StatusDto>('/api/v1/status')
  return {
    overall: dto.overall,
    uptimePercent: dto.uptimePercent,
    windowDays: dto.windowDays,
    avgResponseMs: dto.avgResponseMs,
    serviceGroups: dto.serviceGroups ?? [],
    incidents: (dto.incidents ?? []).map((incident) => ({
      id: incident.id,
      title: incident.title,
      severity: incident.severity === 'major' ? 'major' : incident.severity === 'maintenance' ? 'maintenance' : 'minor',
      status: incident.status === 'open' ? 'open' : incident.status === 'monitoring' ? 'monitoring' : 'resolved',
      date: incident.date,
      description: incident.description,
    })),
  }
}

export function filterEndpoints(
  endpoints: ApiEndpoint[],
  query: string,
  categoryId?: string,
): ApiEndpoint[] {
  const q = query.trim().toLowerCase()
  return endpoints.filter((endpoint) => {
    const inCategory = !categoryId || endpoint.category === categoryId
    if (!inCategory) return false
    if (!q) return true
    return (
      endpoint.title.toLowerCase().includes(q) ||
      endpoint.path.toLowerCase().includes(q) ||
      endpoint.summary.toLowerCase().includes(q)
    )
  })
}
