import { createHash } from 'node:crypto'

interface CacheEntry<V> {
  value: V
  expiresAt: number
  storedAt: number
}

const MAX_ENTRIES = 500

export class MemoryCache<V> {
  private readonly entries = new Map<string, CacheEntry<V>>()
  private readonly inFlight = new Map<string, Promise<V>>()

  get(key: string, now = Date.now()): V | null {
    const entry = this.entries.get(key)
    if (!entry) return null
    if (entry.expiresAt <= now) {
      this.entries.delete(key)
      return null
    }
    return entry.value
  }

  set(key: string, value: V, ttlSeconds: number, now = Date.now()): void {
    if (ttlSeconds <= 0) return
    if (this.entries.size >= MAX_ENTRIES) {
      this.evictOldest()
    }
    this.entries.set(key, {
      value,
      expiresAt: now + ttlSeconds * 1000,
      storedAt: now,
    })
  }

  async singleFlight(key: string, producer: () => Promise<V>): Promise<V> {
    const pending = this.inFlight.get(key)
    if (pending) return pending
    const promise = producer().finally(() => {
      this.inFlight.delete(key)
    })
    this.inFlight.set(key, promise)
    return promise
  }

  flush(): void {
    this.entries.clear()
    this.inFlight.clear()
  }

  size(): number {
    return this.entries.size
  }

  private evictOldest(): void {
    let oldestKey: string | null = null
    let oldestStoredAt = Number.POSITIVE_INFINITY
    for (const [key, entry] of this.entries) {
      if (entry.storedAt < oldestStoredAt) {
        oldestStoredAt = entry.storedAt
        oldestKey = key
      }
    }
    if (oldestKey) {
      this.entries.delete(oldestKey)
    }
  }
}

export function buildCacheKey(endpointPath: string, query: Record<string, string>): string {
  const sortedKeys = Object.keys(query).sort()
  const normalized = sortedKeys
    .filter((key) => query[key] !== '' && query[key] !== undefined)
    .map((key) => `${key}=${query[key]}`)
    .join('&')
  return createHash('sha256').update(`${endpointPath}?${normalized}`).digest('hex')
}
