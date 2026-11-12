import { endpointDefinitions } from '../seed/definitions'
import type { EndpointDocs } from '../core/registry-types'
import type { EndpointWithCategory, Repositories } from '../database/repositories/types'

export interface CatalogCategory {
  id: string
  slug: string
  name: string
  description: string
  icon: string
  sortOrder: number
}

export interface CatalogEndpoint {
  id: string
  category: string
  title: string
  summary: string
  description: string
  method: string
  path: string
  auth: 'none'
  free: true
  params: EndpointDocs['params']
  headers: EndpointDocs['headers']
  requestExample: Record<string, unknown> | null
  responseExample: Record<string, unknown>
  responseSchema: EndpointDocs['responseSchema']
  errorCodes: EndpointDocs['errorCodes']
  cacheTtlSeconds: number
  rateLimit: { windowSeconds: number; max: number } | null
}

export interface CatalogPayload {
  categories: CatalogCategory[]
  endpoints: CatalogEndpoint[]
}

const definitionsBySlug = new Map(endpointDefinitions.map((definition) => [definition.slug, definition]))

function docsForEndpoint(row: EndpointWithCategory): EndpointDocs | null {
  if (row.docs) return row.docs
  return definitionsBySlug.get(row.slug)?.docs ?? null
}

export async function buildPublicCatalog(repos: Repositories): Promise<CatalogPayload> {
  const [categories, endpoints] = await Promise.all([repos.categories.list(), repos.endpoints.listActiveWithCategory()])
  const activeCategorySlugs = new Set(categories.filter((category) => category.is_active).map((category) => category.slug))

  const catalogCategories: CatalogCategory[] = categories
    .filter((category) => category.is_active)
    .map((category) => ({
      id: category.slug,
      slug: category.slug,
      name: category.name,
      description: category.description,
      icon: category.icon,
      sortOrder: category.sort_order,
    }))

  const catalogEndpoints: CatalogEndpoint[] = []
  for (const row of endpoints) {
    if (!activeCategorySlugs.has(row.category_slug)) continue
    const definition = definitionsBySlug.get(row.slug)
    if (definition && !definition.listed) continue
    if (row.kind === 'provider' && !row.normalizer_id) continue
    if (row.kind !== 'provider' && !row.handler_id) continue
    const docs = docsForEndpoint(row)
    if (!docs) continue
    catalogEndpoints.push({
      id: row.slug,
      category: row.category_slug,
      title: docs.title,
      summary: docs.summary,
      description: docs.description,
      method: row.method,
      path: row.public_path,
      auth: 'none',
      free: true,
      params: docs.params,
      headers: docs.headers,
      requestExample: docs.requestExample,
      responseExample: docs.responseExample,
      responseSchema: docs.responseSchema,
      errorCodes: docs.errorCodes,
      cacheTtlSeconds: row.cache_ttl,
      rateLimit: row.rate_limit,
    })
  }

  return { categories: catalogCategories, endpoints: catalogEndpoints }
}
