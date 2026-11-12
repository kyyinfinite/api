import { describe, expect, it } from 'vitest'
import { MemoryRateLimiter } from '../../backend/core/rate-limit'
import { MemoryCache, buildCacheKey } from '../../backend/core/cache'
import { isPrivateAddress, assertAllowedUrl } from '../../backend/providers/http/client'
import { toPublicError } from '../../backend/core/errors'
import { getParamSchema } from '../../backend/core/param-schemas'

describe('memory rate limiter', () => {
  it('allows requests under the limit and blocks above it', async () => {
    const limiter = new MemoryRateLimiter()
    for (let i = 0; i < 3; i++) {
      const decision = await limiter.check('ip:a', 3, 60)
      expect(decision.allowed).toBe(true)
    }
    const blocked = await limiter.check('ip:a', 3, 60)
    expect(blocked.allowed).toBe(false)
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0)
    expect(blocked.remaining).toBe(0)
  })

  it('tracks limits independently per key', async () => {
    const limiter = new MemoryRateLimiter()
    await limiter.check('ip:a', 1, 60)
    const secondKey = await limiter.check('ip:b', 1, 60)
    expect(secondKey.allowed).toBe(true)
    const exhausted = await limiter.check('ip:a', 1, 60)
    expect(exhausted.allowed).toBe(false)
  })

  it('applies a cooldown after sustained abuse', async () => {
    const limiter = new MemoryRateLimiter()
    await limiter.check('ip:c', 1, 60)
    await limiter.check('ip:c', 1, 60)
    const cooldown = await limiter.check('ip:c', 1, 60)
    expect(cooldown.allowed).toBe(false)
    expect(cooldown.retryAfterSeconds).toBeGreaterThan(300)
  })
})

describe('memory cache', () => {
  it('stores and retrieves values within ttl', () => {
    const cache = new MemoryCache<string>()
    cache.set('k', 'v', 60)
    expect(cache.get('k')).toBe('v')
  })

  it('expires entries after ttl', () => {
    const cache = new MemoryCache<string>()
    cache.set('k', 'v', 10, Date.now() - 20_000)
    expect(cache.get('k')).toBeNull()
  })

  it('coalesces concurrent producers with single flight', async () => {
    const cache = new MemoryCache<string>()
    let calls = 0
    const [a, b] = await Promise.all([
      cache.singleFlight('k', async () => {
        calls += 1
        return 'value'
      }),
      cache.singleFlight('k', async () => {
        calls += 1
        return 'value'
      }),
    ])
    expect(calls).toBe(1)
    expect(a).toBe('value')
    expect(b).toBe('value')
  })

  it('builds identical keys for identical params in any order', () => {
    const a = buildCacheKey('/api/v1/x', { q: 'laufey', limit: '5' })
    const b = buildCacheKey('/api/v1/x', { limit: '5', q: 'laufey' })
    expect(a).toBe(b)
  })

  it('builds different keys for different params or paths', () => {
    const a = buildCacheKey('/api/v1/x', { q: 'laufey' })
    const b = buildCacheKey('/api/v1/x', { q: 'other' })
    const c = buildCacheKey('/api/v1/y', { q: 'laufey' })
    expect(a).not.toBe(b)
    expect(a).not.toBe(c)
  })
})

describe('ssrf guard', () => {
  it('classifies private and reserved addresses', () => {
    expect(isPrivateAddress('10.0.0.1')).toBe(true)
    expect(isPrivateAddress('127.0.0.1')).toBe(true)
    expect(isPrivateAddress('0.0.0.0')).toBe(true)
    expect(isPrivateAddress('169.254.169.254')).toBe(true)
    expect(isPrivateAddress('172.16.0.1')).toBe(true)
    expect(isPrivateAddress('172.31.255.255')).toBe(true)
    expect(isPrivateAddress('192.168.1.1')).toBe(true)
    expect(isPrivateAddress('100.64.0.1')).toBe(true)
    expect(isPrivateAddress('224.0.0.1')).toBe(true)
    expect(isPrivateAddress('::1')).toBe(true)
    expect(isPrivateAddress('fe80::1')).toBe(true)
    expect(isPrivateAddress('fd00::1')).toBe(true)
    expect(isPrivateAddress('::ffff:127.0.0.1')).toBe(true)
    expect(isPrivateAddress('8.8.8.8')).toBe(false)
    expect(isPrivateAddress('172.32.0.1')).toBe(false)
    expect(isPrivateAddress('not-an-ip')).toBe(true)
  })

  it('rejects non-https protocols', async () => {
    await expect(
      assertAllowedUrl('http://api.nexray.eu.cc/path', ['api.nexray.eu.cc'], true),
    ).rejects.toThrow()
  })

  it('rejects embedded credentials', async () => {
    await expect(
      assertAllowedUrl('https://user:pass@api.nexray.eu.cc/path', ['api.nexray.eu.cc'], true),
    ).rejects.toThrow()
  })

  it('rejects non-standard ports', async () => {
    await expect(
      assertAllowedUrl('https://api.nexray.eu.cc:8443/path', ['api.nexray.eu.cc'], true),
    ).rejects.toThrow()
  })

  it('rejects hosts outside the allowlist', async () => {
    await expect(
      assertAllowedUrl('https://evil.example.com/path', ['api.nexray.eu.cc'], true),
    ).rejects.toThrow()
  })

  it('rejects loopback targets even without an allowlist', async () => {
    await expect(assertAllowedUrl('https://127.0.0.1/path', [], false)).rejects.toThrow()
    await expect(assertAllowedUrl('https://169.254.169.254/latest/meta-data', [], false)).rejects.toThrow()
  })
})

describe('param schemas', () => {
  it('rejects unknown parameters on strict schemas', () => {
    const schema = getParamSchema('youtube-search-query')
    expect(schema?.query?.safeParse({ q: 'x', extra: '1' }).success).toBe(false)
  })

  it('requires the q parameter for youtube search', () => {
    const schema = getParamSchema('youtube-search-query')
    expect(schema?.query?.safeParse({}).success).toBe(false)
    expect(schema?.query?.safeParse({ q: 'laufey' }).success).toBe(true)
  })

  it('coerces and bounds the uuid count', () => {
    const schema = getParamSchema('uuid-query')
    expect(schema?.query?.safeParse({}).success).toBe(true)
    expect(schema?.query?.safeParse({ count: '5' }).success).toBe(true)
    expect(schema?.query?.safeParse({ count: '0' }).success).toBe(false)
    expect(schema?.query?.safeParse({ count: '51' }).success).toBe(false)
  })

  it('validates hash algorithm and body shape', () => {
    const schema = getParamSchema('hash-body')
    expect(schema?.body?.safeParse({ algorithm: 'sha256', text: 'x' }).success).toBe(true)
    expect(schema?.body?.safeParse({ algorithm: 'md5', text: 'x' }).success).toBe(false)
    expect(schema?.body?.safeParse({ algorithm: 'sha256' }).success).toBe(false)
  })
})

describe('error sanitization', () => {
  it('maps unknown errors to a generic internal error', () => {
    const publicError = toPublicError(new Error('postgres connection string leaked'))
    expect(publicError.statusCode).toBe(500)
    expect(publicError.type).toBe('INTERNAL_ERROR')
    expect(publicError.message).toBe('An unexpected error occurred.')
    expect(publicError.message).not.toContain('postgres')
  })

  it('keeps AppError public messages intact', () => {
    const publicError = toPublicError(new Error('random failure'))
    expect(publicError.message).not.toContain('random failure')
  })
})
