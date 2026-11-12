import { isIP } from 'node:net'
import { lookup } from 'node:dns/promises'
import { UpstreamError, UpstreamTimeoutError } from '../../core/errors'
import type { HttpRequestSpec, ProviderClientDeps, RawHttpResponse } from '../types'

const PRIVATE_IPV4_PATTERNS: Array<(parts: number[]) => boolean> = [
  (parts) => parts[0] === 0,
  (parts) => parts[0] === 10,
  (parts) => parts[0] === 127,
  (parts) => parts[0] === 169 && parts[1] === 254,
  (parts) => parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31,
  (parts) => parts[0] === 192 && parts[1] === 168,
  (parts) => parts[0] === 100 && parts[1] >= 64 && parts[1] <= 127,
  (parts) => parts[0] === 198 && (parts[1] === 18 || parts[1] === 19),
  (parts) => parts[0] >= 224,
]

export function isPrivateAddress(address: string): boolean {
  const version = isIP(address)
  if (version === 4) {
    const parts = address.split('.').map(Number)
    return PRIVATE_IPV4_PATTERNS.some((match) => match(parts))
  }
  if (version === 6) {
    const normalized = address.toLowerCase()
    if (normalized === '::' || normalized === '::1') return true
    if (normalized.startsWith('fe80:')) return true
    if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true
    if (normalized.startsWith('::ffff:')) {
      const mapped = normalized.slice(7)
      return isIP(mapped) === 4 ? isPrivateAddress(mapped) : false
    }
    return false
  }
  return true
}

export interface AllowedUrl {
  url: URL
}

export async function assertAllowedUrl(
  rawUrl: string,
  allowedHosts: readonly string[],
  enforceHostAllowlist: boolean,
): Promise<AllowedUrl> {
  let parsed: URL
  try {
    parsed = new URL(rawUrl)
  } catch {
    throw new UpstreamError(`unparseable url: ${rawUrl.slice(0, 120)}`)
  }
  if (parsed.protocol !== 'https:') {
    throw new UpstreamError(`blocked protocol: ${parsed.protocol}`)
  }
  if (parsed.username || parsed.password) {
    throw new UpstreamError('blocked credentials in url')
  }
  if (parsed.port && parsed.port !== '443') {
    throw new UpstreamError(`blocked port: ${parsed.port}`)
  }
  const host = parsed.hostname.toLowerCase().replace(/\.$/, '')
  if (enforceHostAllowlist && allowedHosts.length > 0 && !allowedHosts.includes(host)) {
    throw new UpstreamError(`blocked host: ${host}`)
  }
  let addresses: Array<{ address: string }>
  try {
    addresses = await lookup(host, { all: true, verbatim: true })
  } catch (error) {
    throw new UpstreamError(`dns resolution failed: ${error instanceof Error ? error.message : 'unknown'}`)
  }
  if (addresses.length === 0) {
    throw new UpstreamError('dns resolution returned no addresses')
  }
  for (const entry of addresses) {
    if (isPrivateAddress(entry.address)) {
      throw new UpstreamError('blocked private network address')
    }
  }
  return { url: parsed }
}

const MAX_REDIRECTS = 3

export class HttpProviderClient {
  private readonly fetchImpl: typeof fetch

  constructor(deps: ProviderClientDeps = {}) {
    this.fetchImpl = deps.fetchImpl ?? ((input, init) => fetch(input, init))
  }

  async request(spec: HttpRequestSpec): Promise<RawHttpResponse> {
    let currentUrl = spec.url
    for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount++) {
      await assertAllowedUrl(currentUrl, spec.allowedHosts, spec.enforceHostAllowlist)
      const response = await this.executeWithTimeout(currentUrl, spec)
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location')
        if (!location) {
          throw new UpstreamError('redirect without location header')
        }
        if (redirectCount === MAX_REDIRECTS) {
          throw new UpstreamError('too many redirects')
        }
        currentUrl = new URL(location, currentUrl).toString()
        continue
      }
      const contentType = response.headers.get('content-type') ?? 'application/octet-stream'
      const declaredLength = Number(response.headers.get('content-length') ?? '0')
      if (declaredLength > spec.maxBytes) {
        throw new UpstreamError(`response exceeds size limit: ${declaredLength}`)
      }
      const bytes = await this.readBody(response, spec.maxBytes)
      return { status: response.status, contentType, bytes, finalUrl: currentUrl }
    }
    throw new UpstreamError('redirect loop')
  }

  private async executeWithTimeout(url: string, spec: HttpRequestSpec): Promise<Response> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), spec.timeoutMs)
    try {
      return await this.fetchImpl(url, {
        method: spec.method,
        headers: spec.headers,
        ...(spec.body ? { body: spec.body } : {}),
        redirect: 'manual',
        signal: controller.signal,
      })
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new UpstreamTimeoutError(`upstream timeout after ${spec.timeoutMs}ms`)
      }
      throw new UpstreamError(error instanceof Error ? error.message : 'network failure')
    } finally {
      clearTimeout(timer)
    }
  }

  private async readBody(response: Response, maxBytes: number): Promise<Uint8Array> {
    const body = response.body
    if (!body) {
      return new Uint8Array(0)
    }
    const reader = body.getReader()
    const chunks: Uint8Array[] = []
    let total = 0
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      if (value) {
        total += value.byteLength
        if (total > maxBytes) {
          await reader.cancel()
          throw new UpstreamError(`response exceeds size limit while streaming: ${total}`)
        }
        chunks.push(value)
      }
    }
    const merged = new Uint8Array(total)
    let offset = 0
    for (const chunk of chunks) {
      merged.set(chunk, offset)
      offset += chunk.byteLength
    }
    return merged
  }
}

let defaultClient: HttpProviderClient | null = null

export function getDefaultProviderClient(): HttpProviderClient {
  if (!defaultClient) {
    defaultClient = new HttpProviderClient()
  }
  return defaultClient
}

export function resetProviderClientForTests(): void {
  defaultClient = null
}
