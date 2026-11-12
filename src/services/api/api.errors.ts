export class ApiError extends Error {
  readonly code: number
  readonly details?: string
  readonly body?: unknown
  readonly durationMs?: number
  readonly sizeBytes?: number

  constructor(
    code: number,
    message: string,
    details?: string,
    extra?: { body?: unknown; durationMs?: number; sizeBytes?: number },
  ) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.details = details
    this.body = extra?.body
    this.durationMs = extra?.durationMs
    this.sizeBytes = extra?.sizeBytes
  }
}

export class NetworkError extends Error {
  constructor(message = 'Unable to reach the Kyyinfinite API.') {
    super(message)
    this.name = 'NetworkError'
  }
}

export class TimeoutError extends Error {
  constructor(message = 'The request exceeded the time limit.') {
    super(message)
    this.name = 'TimeoutError'
  }
}

export function formatApiError(error: unknown): string {
  if (error instanceof ApiError) {
    return `${error.code}: ${error.message}`
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred.'
}
