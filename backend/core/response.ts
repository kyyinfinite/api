import type { AppConfig } from '../config/env'
import type { AppError } from './errors'

export interface SuccessMeta {
  request_id: string
  timestamp: string
  response_time_ms: number
  api_version: string
}

export interface SuccessEnvelope<T> {
  status: 'success'
  code: number
  message: string
  data: T
  meta: SuccessMeta
}

export interface ErrorEnvelope {
  status: 'error'
  code: number
  message: string
  data: null
  error: {
    type: string
    details?: string
  }
  meta: {
    request_id: string
    timestamp: string
    response_time_ms: number
    api_version: string
  }
}

export function successEnvelope<T>(options: {
  config: AppConfig
  data: T
  requestId: string
  startedAt: number
  message?: string
  code?: number
}): SuccessEnvelope<T> {
  const { config, data, requestId, startedAt } = options
  return {
    status: 'success',
    code: options.code ?? 200,
    message: options.message ?? 'Request completed successfully',
    data,
    meta: {
      request_id: requestId,
      timestamp: new Date(startedAt).toISOString(),
      response_time_ms: Math.max(1, Date.now() - startedAt),
      api_version: config.apiVersion,
    },
  }
}

export function errorEnvelope(options: {
  config: AppConfig
  error: AppError
  requestId: string
  startedAt: number
}): ErrorEnvelope {
  const { config, error, requestId, startedAt } = options
  return {
    status: 'error',
    code: error.statusCode,
    message: error.message,
    data: null,
    error: {
      type: error.type,
      ...(error.details ? { details: error.details } : {}),
    },
    meta: {
      request_id: requestId,
      timestamp: new Date(startedAt).toISOString(),
      response_time_ms: Math.max(1, Date.now() - startedAt),
      api_version: config.apiVersion,
    },
  }
}

export function jsonHeaders(ttlSeconds: number): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json; charset=UTF-8',
  }
  if (ttlSeconds > 0) {
    headers['Cache-Control'] =
      `public, max-age=0, s-maxage=${ttlSeconds}, stale-while-revalidate=${ttlSeconds}`
  } else {
    headers['Cache-Control'] = 'no-store'
  }
  return headers
}
