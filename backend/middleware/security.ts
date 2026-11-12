import type { MiddlewareHandler } from 'hono'

export function securityHeaderValues(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  }
}

export function securityHeaders(): MiddlewareHandler {
  return async (c, next) => {
    await next()
    for (const [key, value] of Object.entries(securityHeaderValues())) {
      c.header(key, value)
    }
  }
}

export function corsPreflight(): Response {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      'Cache-Control': 'no-store',
    },
  })
}

export function corsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    Vary: 'Origin',
  }
}
