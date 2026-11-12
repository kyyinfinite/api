export type EndpointKind = 'provider' | 'native' | 'stream'

export type EndpointLifecycle = 'draft' | 'validated' | 'active' | 'disabled'

export interface EndpointRateLimit {
  windowSeconds: number
  max: number
}

export interface EndpointParamDoc {
  name: string
  type: string
  required: boolean
  description: string
  location: 'query' | 'body'
  enumValues?: string[]
  example?: string | number | boolean
}

export interface EndpointHeaderDoc {
  name: string
  required: boolean
  description: string
}

export interface FieldDoc {
  name: string
  type: string
  description: string
}

export interface ErrorCodeDoc {
  code: number
  name: string
  description: string
}

export interface EndpointDocs {
  title: string
  summary: string
  description: string
  params: EndpointParamDoc[]
  headers: EndpointHeaderDoc[]
  requestExample: Record<string, unknown> | null
  responseExample: Record<string, unknown>
  responseSchema: FieldDoc[]
  errorCodes: ErrorCodeDoc[]
}

export interface CategoryDefinition {
  slug: string
  name: string
  description: string
  icon: string
  sortOrder: number
  isActive?: boolean
}

export interface EndpointDefinition {
  slug: string
  publicPath: string
  method: 'GET' | 'POST'
  categorySlug: string
  kind: EndpointKind
  handlerId?: string
  normalizerId?: string
  paramSchemaId: string
  cacheTtlSeconds: number
  rateLimit: EndpointRateLimit | null
  listed: boolean
  lifecycle: EndpointLifecycle
  docs: EndpointDocs
  provider?: {
    internalName: string
    baseUrl: string
    providerPath: string
    paramsMap: Record<string, string>
  }
}
