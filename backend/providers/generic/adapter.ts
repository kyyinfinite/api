import { UpstreamError } from '../../core/errors'
import { HttpProviderClient, getDefaultProviderClient } from '../http/client'
import type { ProviderAdapter, ProviderFile, ProviderSpec } from '../types'

const DEFAULT_TIMEOUT_MS = 20_000
const DEFAULT_JSON_MAX_BYTES = 4 * 1024 * 1024
const DEFAULT_FILE_MAX_BYTES = 25 * 1024 * 1024

function providerConfig(spec: ProviderSpec) {
  const config = spec.configuration as {
    allowed_hosts?: string[]
    timeout_ms?: number
    max_response_bytes?: number
    max_file_bytes?: number
  }
  const host = new URL(spec.baseUrl).hostname.toLowerCase()
  const configuredHosts = Array.isArray(config.allowed_hosts)
    ? config.allowed_hosts.map((entry) => entry.toLowerCase())
    : []
  return {
    allowedHosts: [...new Set([host, ...configuredHosts])],
    timeoutMs: config.timeout_ms ?? DEFAULT_TIMEOUT_MS,
    maxJsonBytes: config.max_response_bytes ?? DEFAULT_JSON_MAX_BYTES,
    maxFileBytes: config.max_file_bytes ?? DEFAULT_FILE_MAX_BYTES,
  }
}

function buildUrl(spec: ProviderSpec): string {
  const url = new URL(spec.providerPath, spec.baseUrl)
  for (const [key, value] of Object.entries(spec.query)) {
    if (value !== undefined && value !== '') url.searchParams.set(key, value)
  }
  return url.toString()
}

function fileExtension(url: string): string | null {
  try {
    const match = /\.([a-z0-9]{2,5})$/i.exec(new URL(url).pathname)
    return match?.[1]?.toLowerCase() ?? null
  } catch {
    return null
  }
}

export class GenericHttpAdapter implements ProviderAdapter {
  readonly adapterType = 'generic-http'
  readonly allowedHosts: readonly string[] = []
  private readonly client: HttpProviderClient

  constructor(deps: { fetchImpl?: typeof fetch } = {}) {
    this.client = deps.fetchImpl ? new HttpProviderClient({ fetchImpl: deps.fetchImpl }) : getDefaultProviderClient()
  }

  async fetchJson(spec: ProviderSpec): Promise<unknown> {
    const config = providerConfig(spec)
    const response = await this.client.request({
      url: buildUrl(spec),
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'kyyinfinite-platform/2.0',
        ...(spec.secret ? { Authorization: `Bearer ${spec.secret}` } : {}),
      },
      timeoutMs: config.timeoutMs,
      maxBytes: config.maxJsonBytes,
      allowedHosts: config.allowedHosts,
      enforceHostAllowlist: true,
    })
    if (response.status < 200 || response.status >= 300) {
      throw new UpstreamError(`provider responded with status ${response.status}`)
    }
    try {
      return JSON.parse(new TextDecoder().decode(response.bytes)) as unknown
    } catch {
      throw new UpstreamError('provider returned invalid JSON')
    }
  }

  async fetchFile(spec: ProviderSpec, maxBytes: number): Promise<ProviderFile> {
    const config = providerConfig(spec)
    const response = await this.client.request({
      url: spec.fileUrl ?? buildUrl(spec),
      method: 'GET',
      headers: {
        Accept: '*/*',
        'User-Agent': 'kyyinfinite-platform/2.0',
      },
      timeoutMs: config.timeoutMs,
      maxBytes: Math.min(maxBytes, config.maxFileBytes),
      allowedHosts: config.allowedHosts,
      enforceHostAllowlist: true,
    })
    if (response.status < 200 || response.status >= 300) {
      throw new UpstreamError(`provider file responded with status ${response.status}`)
    }
    if (/text\/html|application\/json|text\/plain/i.test(response.contentType)) {
      throw new UpstreamError('provider returned a non-binary file response')
    }
    return {
      bytes: response.bytes,
      contentType: response.contentType || 'application/octet-stream',
      sourceFileNameHint: fileExtension(response.finalUrl),
    }
  }
}
