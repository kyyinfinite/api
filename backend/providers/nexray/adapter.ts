import { z } from 'zod'
import { getConfig } from '../../config/env'
import { UpstreamError } from '../../core/errors'
import { HttpProviderClient, getDefaultProviderClient } from '../http/client'
import type { ProviderAdapter, ProviderFile, ProviderSpec } from '../types'

export const nexrayResultSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    channel: z.string().optional(),
    channel_url: z.string().optional(),
    type: z.string().optional(),
    id: z.string().optional(),
    duration: z.string().optional(),
    seconds: z.union([z.coerce.number(), z.string()]).optional(),
    views: z.string().optional(),
    upload_at: z.string().optional(),
    thumbnail: z.string().optional(),
    url: z.string().optional(),
    download_url: z.string().optional(),
  })
  .passthrough()

export const nexrayResponseSchema = z
  .object({
    status: z.union([z.boolean(), z.string()]).optional(),
    author: z.unknown().optional(),
    result: nexrayResultSchema,
    timestamp: z.string().optional(),
    response_time: z.string().optional(),
  })
  .passthrough()

export type NexrayResult = z.infer<typeof nexrayResultSchema>
export type NexrayResponse = z.infer<typeof nexrayResponseSchema>

export function normalizeSeconds(value: z.infer<typeof nexrayResultSchema>['seconds']): number | null {
  if (value === undefined) return null
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

const DEFAULT_TIMEOUT_MS = 20_000
const DEFAULT_MAX_BYTES = 2 * 1024 * 1024

export class NexrayAdapter implements ProviderAdapter {
  readonly adapterType = 'nexray-http'
  private readonly client: HttpProviderClient

  constructor(deps: { fetchImpl?: typeof fetch } = {}) {
    this.client = deps.fetchImpl ? new HttpProviderClient({ fetchImpl: deps.fetchImpl }) : getDefaultProviderClient()
  }

  get allowedHosts(): readonly string[] {
    const config = getConfig()
    const envHost = new URL(config.providerNexrayBaseUrl).hostname
    return [...new Set(['api.nexray.eu.cc', envHost])]
  }

  async fetchJson(spec: ProviderSpec): Promise<unknown> {
    const client = this.client
    const search = new URLSearchParams(spec.query)
    const url = `${spec.baseUrl}${spec.providerPath}?${search.toString()}`
    const configuration = spec.configuration as { timeoutMs?: number; maxResponseBytes?: number }
    const response = await client.request({
      url,
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'kyyinfinite-platform/1.0',
        ...(spec.secret ? { Authorization: `Bearer ${spec.secret}` } : {}),
      },
      timeoutMs: configuration.timeoutMs ?? DEFAULT_TIMEOUT_MS,
      maxBytes: configuration.maxResponseBytes ?? DEFAULT_MAX_BYTES,
      allowedHosts: this.allowedHosts,
      enforceHostAllowlist: true,
    })
    if (response.status < 200 || response.status >= 300) {
      throw new UpstreamError(`provider responded with status ${response.status}`)
    }
    let parsed: unknown
    try {
      parsed = JSON.parse(new TextDecoder().decode(response.bytes))
    } catch (error) {
      throw new UpstreamError(`invalid json from provider: ${error instanceof Error ? error.message : 'unknown'}`)
    }
    const validated = nexrayResponseSchema.safeParse(parsed)
    if (!validated.success) {
      throw new UpstreamError(`unexpected provider response shape: ${validated.error.issues[0]?.message ?? 'unknown'}`)
    }
    if (validated.data.status === false) {
      throw new UpstreamError('provider reported a failed lookup')
    }
    return validated.data
  }

  async fetchFile(spec: ProviderSpec, maxBytes: number): Promise<ProviderFile> {
    if (!spec.fileUrl) {
      throw new UpstreamError('file url is required for file delivery')
    }
    const client = this.client
    const response = await client.request({
      url: spec.fileUrl,
      method: 'GET',
      headers: {
        Accept: '*/*',
        'User-Agent': 'kyyinfinite-platform/1.0',
      },
      timeoutMs: 25_000,
      maxBytes,
      allowedHosts: [],
      enforceHostAllowlist: false,
    })
    if (response.status < 200 || response.status >= 300) {
      throw new UpstreamError(`file source responded with status ${response.status}`)
    }
    let fileNameHint: string | null = null
    try {
      const path = new URL(response.finalUrl).pathname
      const match = /\.([a-z0-9]{2,5})$/i.exec(path)
      if (match) {
        fileNameHint = match[1].toLowerCase()
      }
    } catch {
      fileNameHint = null
    }
    return { bytes: response.bytes, contentType: response.contentType, sourceFileNameHint: fileNameHint }
  }
}
