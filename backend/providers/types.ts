export interface ProviderSpec {
  baseUrl: string
  providerPath: string
  query: Record<string, string>
  configuration: Record<string, unknown>
  secret?: string
  fileUrl?: string
}

export interface ProviderFile {
  bytes: Uint8Array
  contentType: string
  sourceFileNameHint: string | null
}

export interface ProviderAdapter {
  readonly adapterType: string
  readonly allowedHosts: readonly string[]
  fetchJson(spec: ProviderSpec): Promise<unknown>
  fetchFile(spec: ProviderSpec, maxBytes: number): Promise<ProviderFile>
}

export interface ProviderClientDeps {
  fetchImpl?: typeof fetch
}

export interface RawHttpResponse {
  status: number
  contentType: string
  bytes: Uint8Array
  finalUrl: string
}

export interface HttpRequestSpec {
  url: string
  method: 'GET' | 'POST'
  headers: Record<string, string>
  body?: string
  timeoutMs: number
  maxBytes: number
  allowedHosts: readonly string[]
  enforceHostAllowlist: boolean
}

export interface ProviderMappingResolution {
  providerRow: {
    id: string
    internalName: string
    adapterType: string
    baseUrl: string
    configuration: Record<string, unknown>
  }
  mapping: {
    providerPath: string
    configuration: Record<string, unknown>
  }
}
