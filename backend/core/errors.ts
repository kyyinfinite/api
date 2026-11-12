export type ErrorType =
  | 'BAD_REQUEST'
  | 'INVALID_PARAMS'
  | 'NOT_FOUND'
  | 'METHOD_NOT_ALLOWED'
  | 'PAYLOAD_TOO_LARGE'
  | 'RATE_LIMITED'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'UPSTREAM_ERROR'
  | 'UPSTREAM_TIMEOUT'
  | 'SERVICE_UNAVAILABLE'
  | 'INTERNAL_ERROR'

export class AppError extends Error {
  readonly statusCode: number
  readonly type: ErrorType
  readonly details?: string
  readonly retryAfterSeconds?: number
  readonly internalDetails?: string

  constructor(
    statusCode: number,
    type: ErrorType,
    message: string,
    options?: {
      details?: string
      retryAfterSeconds?: number
      internalDetails?: string
    },
  ) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.type = type
    this.details = options?.details
    this.retryAfterSeconds = options?.retryAfterSeconds
    this.internalDetails = options?.internalDetails
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'The request could not be understood.', details?: string) {
    super(400, 'BAD_REQUEST', message, { details })
  }
}

export class InvalidParamsError extends AppError {
  constructor(details: string) {
    super(400, 'INVALID_PARAMS', 'One or more request parameters are invalid.', { details })
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'The requested endpoint does not exist.') {
    super(404, 'NOT_FOUND', message)
  }
}

export class MethodNotAllowedError extends AppError {
  constructor(allowed: string) {
    super(405, 'METHOD_NOT_ALLOWED', `This endpoint only accepts ${allowed} requests.`)
  }
}

export class PayloadTooLargeError extends AppError {
  constructor(maxBytes: number) {
    super(
      413,
      'PAYLOAD_TOO_LARGE',
      'The request body exceeds the maximum allowed size.',
      { details: `Maximum body size is ${maxBytes} bytes.` },
    )
  }
}

export class RateLimitedError extends AppError {
  constructor(retryAfterSeconds: number) {
    super(429, 'RATE_LIMITED', 'Too many requests. Please slow down.', {
      details: `Retry after ${retryAfterSeconds} seconds.`,
      retryAfterSeconds,
    })
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication is required.') {
    super(401, 'UNAUTHORIZED', message)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'You do not have access to this resource.') {
    super(403, 'FORBIDDEN', message)
  }
}

export class UpstreamError extends AppError {
  constructor(internalDetails?: string) {
    super(502, 'UPSTREAM_ERROR', 'The requested service returned an invalid response.', {
      internalDetails,
    })
  }
}

export class UpstreamTimeoutError extends AppError {
  constructor(internalDetails?: string) {
    super(504, 'UPSTREAM_TIMEOUT', 'The requested service took too long to respond.', {
      internalDetails,
    })
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message = 'Service temporarily unavailable.', internalDetails?: string) {
    super(503, 'SERVICE_UNAVAILABLE', message, { internalDetails })
  }
}

export function logInternalError(scope: string, error: unknown): void {
  const detail = error instanceof Error ? `${error.name}: ${error.message}` : String(error)
  console.error(`[kyyinfinite:${scope}] ${detail}`)
}

export function toPublicError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }
  if (error instanceof Error && error.name === 'AbortError') {
    return new UpstreamTimeoutError(error.message)
  }
  return new AppError(500, 'INTERNAL_ERROR', 'An unexpected error occurred.', {
    internalDetails: error instanceof Error ? error.message : String(error),
  })
}
