import type { ApiResponse, ApiRequestConfig } from '@/services/api/api.types'
import { endpoints } from './endpoints'

export const errorEnvelope = {
  status: 'error',
  code: 404,
  error: {
    type: 'NOT_FOUND',
    message: 'The requested endpoint does not exist.',
  },
}

function buildQuery(config: ApiRequestConfig): string {
  const search = new URLSearchParams()
  Object.entries(config.query ?? {}).forEach(([k, v]) => {
    if (v !== '' && v !== undefined) search.set(k, v)
  })
  const q = search.toString()
  return q ? `?${q}` : ''
}

export function resolveMockResponse(config: ApiRequestConfig): ApiResponse<Record<string, unknown>> {
  const path = config.path.replace(/^https?:\/\/[^/]+/, '').split('?')[0]
  const endpoint = endpoints.find(
    (e) => e.path === path && (config.method === e.method || e.method === 'GET'),
  )

  if (!endpoint) {
    return {
      status: 404,
      statusText: 'NOT FOUND',
      durationMs: 42,
      sizeBytes: JSON.stringify(errorEnvelope).length,
      data: errorEnvelope,
    }
  }

  return {
    status: 200,
    statusText: 'OK',
    durationMs: 96 + Math.floor(Math.random() * 70),
    sizeBytes: JSON.stringify(endpoint.responseExample).length,
    data: endpoint.responseExample,
  }
}

export function resolveMockUrl(config: ApiRequestConfig): string {
  return `${config.path}${buildQuery(config)}`
}
