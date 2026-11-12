import { getConfig } from '../config/env'
import { ServiceUnavailableError } from '../core/errors'
import { getProviderAdapter } from '../providers/registry'
import { getNormalizer } from '../providers/normalizers'
import type { ProviderAdapter, ProviderSpec } from '../providers/types'
import type { EndpointRow, Repositories } from '../database/repositories/types'
import type { ProviderFile } from '../providers/types'
import { nexrayResponseSchema } from '../providers/nexray/adapter'

export interface ProviderExecutionResult {
  data: Record<string, unknown>
  raw: unknown
  spec: ProviderSpec
  adapter: ProviderAdapter
}

const providerRawCache = new Map<string, { value: unknown; expiresAt: number }>()
const RAW_CACHE_TTL_MS = 120_000

function mapProviderQuery(query: Record<string, string>, mappingConfiguration: Record<string, unknown>): Record<string, string> {
  const paramsMap = mappingConfiguration.paramsMap as Record<string, string> | undefined
  return Object.fromEntries(Object.entries(query).map(([key, value]) => [paramsMap?.[key] ?? key, value]))
}

export async function executeProviderEndpoint(options: {
  repos: Repositories
  endpoint: EndpointRow
  query: Record<string, string>
}): Promise<ProviderExecutionResult> {
  const { repos, endpoint, query } = options
  const mappings = await repos.mappings.listActiveForEndpoint(endpoint.id)
  const mapping = mappings[0]
  if (!mapping) {
    throw new ServiceUnavailableError('This service is not routed yet.', 'missing mapping')
  }
  const provider = await repos.providers.findById(mapping.provider_id)
  if (!provider || !provider.is_active) {
    throw new ServiceUnavailableError('This service is temporarily unavailable.', 'provider inactive')
  }
  const adapter = getProviderAdapter(provider.adapter_type)
  const config = getConfig()
  let baseUrl = provider.base_url
  let secret: string | undefined
  if (provider.internal_name === 'nexray') {
    baseUrl = config.providerNexrayBaseUrl
    if (config.providerNexraySecret) secret = config.providerNexraySecret
  }
  const spec: ProviderSpec = {
    baseUrl,
    providerPath: mapping.provider_path,
    query: mapProviderQuery(query, mapping.configuration),
    configuration: provider.configuration,
    secret,
  }
  const normalizer = endpoint.normalizer_id ? getNormalizer(endpoint.normalizer_id) : null
  if (!normalizer) {
    throw new ServiceUnavailableError('This service is temporarily unavailable.', 'missing normalizer')
  }
  const raw = await adapter.fetchJson(spec)
  const data = normalizer(raw, query)
  const delivery = (data as { delivery?: { maxBytes?: number } }).delivery
  if (delivery && delivery.maxBytes === 0) {
    delivery.maxBytes = config.downloadMaxBytes
  }
  return { data, raw, spec, adapter }
}

export async function executeProviderBinaryEndpoint(options: {
  repos: Repositories
  endpoint: EndpointRow
  query: Record<string, string>
  maxBytes: number
}): Promise<ProviderFile> {
  const { repos, endpoint, query, maxBytes } = options
  const mappings = await repos.mappings.listActiveForEndpoint(endpoint.id)
  const mapping = mappings[0]
  if (!mapping) throw new ServiceUnavailableError('This service is not routed yet.', 'missing mapping')
  const provider = await repos.providers.findById(mapping.provider_id)
  if (!provider || !provider.is_active) {
    throw new ServiceUnavailableError('This service is temporarily unavailable.', 'provider inactive')
  }
  const adapter = getProviderAdapter(provider.adapter_type)
  const config = getConfig()
  const baseUrl = provider.internal_name === 'nexray' ? config.providerNexrayBaseUrl : provider.base_url
  const secret = provider.internal_name === 'nexray' ? config.providerNexraySecret || undefined : undefined
  return adapter.fetchFile({
    baseUrl,
    providerPath: mapping.provider_path,
    query: mapProviderQuery(query, mapping.configuration),
    configuration: provider.configuration,
    secret,
  }, maxBytes)
}

export async function resolveProviderRaw(options: {
  repos: Repositories
  endpointSlug: string
  query: Record<string, string>
}): Promise<{ raw: unknown; spec: ProviderSpec; adapter: ProviderAdapter; endpoint: EndpointRow } | null> {
  const { repos, endpointSlug, query } = options
  const endpoints = await repos.endpoints.listAll()
  const endpoint = endpoints.find((row) => row.slug === endpointSlug && row.is_active)
  if (!endpoint || endpoint.kind !== 'provider' || !endpoint.normalizer_id) {
    return null
  }
  const cacheKey = `raw:${endpointSlug}:${query.q ?? ''}`
  const now = Date.now()
  const cached = providerRawCache.get(cacheKey)
  if (cached && cached.expiresAt > now) {
    const mappings = await repos.mappings.listActiveForEndpoint(endpoint.id)
    const mapping = mappings[0]
    if (!mapping) return null
    const provider = await repos.providers.findById(mapping.provider_id)
    if (!provider) return null
    const adapter = getProviderAdapter(provider.adapter_type)
    const config = getConfig()
    const baseUrl = provider.internal_name === 'nexray' ? config.providerNexrayBaseUrl : provider.base_url
    const secret =
      provider.internal_name === 'nexray' && config.providerNexraySecret
        ? config.providerNexraySecret
        : undefined
    return {
      raw: cached.value,
      spec: {
        baseUrl,
        providerPath: mapping.provider_path,
        query: mapProviderQuery(query, mapping.configuration),
        configuration: provider.configuration,
        secret,
      },
      adapter,
      endpoint,
    }
  }

  const execution = await executeProviderEndpoint({ repos, endpoint, query })
  providerRawCache.set(cacheKey, { value: execution.raw, expiresAt: now + RAW_CACHE_TTL_MS })
  return { raw: execution.raw, spec: execution.spec, adapter: execution.adapter, endpoint }
}

export function extractNexrayDownloadUrl(raw: unknown): { downloadUrl: string; title: string | null } | null {
  const parsed = nexrayResponseSchema.safeParse(raw)
  if (!parsed.success) return null
  const downloadUrl = parsed.data.result.download_url
  if (!downloadUrl || !downloadUrl.startsWith('https://')) return null
  return { downloadUrl, title: parsed.data.result.title ?? null }
}
