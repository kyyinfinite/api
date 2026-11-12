import { createHash, randomUUID } from 'node:crypto'

const REQUEST_ID_PREFIX = 'req_'
const IP_SALT = 'kyyinfinite::client-ip::v1'

export function newRequestId(): string {
  return `${REQUEST_ID_PREFIX}${randomUUID().replace(/-/g, '')}`
}

export function extractClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  const realIp = headers.get('x-real-ip')?.trim()
  if (realIp) return realIp
  return 'unknown'
}

export function hashClientIp(ip: string): string {
  return createHash('sha256').update(`${IP_SALT}${ip}`).digest('hex')
}

export function sanitizePath(input: string): string | null {
  if (!input.startsWith('/')) return null
  if (input.includes('..')) return null
  if (input.includes('\0')) return null
  let path = input.split('?')[0]
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1)
  }
  if (!path.startsWith('/api/v1/')) return null
  return path
}
