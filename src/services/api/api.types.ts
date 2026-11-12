export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type CategoryId = string

export interface ApiCategory {
  id: CategoryId
  slug: string
  index: string
  name: string
  description: string
  icon: string
}

export type ParamLocation = 'query' | 'path' | 'body'

export interface EndpointParam {
  name: string
  type: 'string' | 'number' | 'boolean' | 'enum'
  required: boolean
  description: string
  location: ParamLocation
  enumValues?: string[]
  example?: string | number | boolean
}

export interface EndpointHeader {
  name: string
  required: boolean
  description: string
}

export interface FieldSchema {
  name: string
  type: string
  description: string
}

export interface ErrorCode {
  code: number
  name: string
  description: string
}

export interface ApiEndpoint {
  id: string
  category: CategoryId
  title: string
  summary: string
  description: string
  method: HttpMethod
  path: string
  auth: 'none'
  free: true
  params: EndpointParam[]
  headers: EndpointHeader[]
  requestExample: Record<string, unknown> | null
  responseExample: Record<string, unknown>
  responseSchema: FieldSchema[]
  errorCodes: ErrorCode[]
}

export interface BinaryApiPayload {
  blob: Blob
  contentType: string
  disposition: string | null
  filename: string
}

export interface ApiResponse<T> {
  status: number
  statusText: string
  durationMs: number
  sizeBytes: number
  data: T
  binary?: BinaryApiPayload
}

export interface ApiRequestConfig {
  method: HttpMethod
  path: string
  query?: Record<string, string>
  headers?: Record<string, string>
  body?: Record<string, unknown> | null
  signal?: AbortSignal
}

export interface KyyinfiniteEnvelope<T = unknown> {
  status: 'success' | 'error'
  code: number
  message?: string
  data?: T
}
