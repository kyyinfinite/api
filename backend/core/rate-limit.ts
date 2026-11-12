import { getConfig } from '../config/env'
import { logInternalError } from './errors'

export interface RateLimitDecision {
  allowed: boolean
  limit: number
  remaining: number
  retryAfterSeconds: number
}

export interface RateLimiter {
  check(key: string, limit: number, windowSeconds: number): Promise<RateLimitDecision>
}

const COOLDOWN_MULTIPLIER_THRESHOLD = 2
const COOLDOWN_MS = 15 * 60 * 1000

interface MemoryKeyState {
  hits: number[]
  consecutiveRejects: number
  blockedUntil: number
}

export class MemoryRateLimiter implements RateLimiter {
  private readonly states = new Map<string, MemoryKeyState>()
  private lastSweep = Date.now()

  async check(key: string, limit: number, windowSeconds: number): Promise<RateLimitDecision> {
    const now = Date.now()
    this.sweep(now)
    const state = this.states.get(key) ?? { hits: [], consecutiveRejects: 0, blockedUntil: 0 }

    if (state.blockedUntil > now) {
      this.states.set(key, state)
      return {
        allowed: false,
        limit,
        remaining: 0,
        retryAfterSeconds: Math.ceil((state.blockedUntil - now) / 1000),
      }
    }

    const windowStart = now - windowSeconds * 1000
    state.hits = state.hits.filter((timestamp) => timestamp > windowStart)

    if (state.hits.length >= limit) {
      state.consecutiveRejects += 1
      const windowRetryAfter = Math.ceil((state.hits[0] + windowSeconds * 1000 - now) / 1000)
      if (state.consecutiveRejects >= COOLDOWN_MULTIPLIER_THRESHOLD) {
        state.blockedUntil = now + COOLDOWN_MS
        state.consecutiveRejects = 0
        state.hits = []
        this.states.set(key, state)
        return {
          allowed: false,
          limit,
          remaining: 0,
          retryAfterSeconds: Math.ceil(COOLDOWN_MS / 1000),
        }
      }
      this.states.set(key, state)
      return {
        allowed: false,
        limit,
        remaining: 0,
        retryAfterSeconds: Math.max(1, windowRetryAfter),
      }
    }

    state.hits.push(now)
    state.consecutiveRejects = 0
    this.states.set(key, state)
    return {
      allowed: true,
      limit,
      remaining: Math.max(0, limit - state.hits.length),
      retryAfterSeconds: 0,
    }
  }

  private sweep(now: number): void {
    if (now - this.lastSweep < 120_000) return
    this.lastSweep = now
    for (const [key, state] of this.states) {
      const idle = state.hits.length === 0 || state.hits[state.hits.length - 1] < now - 30 * 60 * 1000
      const unblocked = state.blockedUntil <= now
      if (idle && unblocked) {
        this.states.delete(key)
      }
    }
  }
}

interface UpstashCommandResult {
  result: number | string | null
}

export class UpstashRateLimiter implements RateLimiter {
  constructor(
    private readonly restUrl: string,
    private readonly restToken: string,
  ) {}

  async check(key: string, limit: number, windowSeconds: number): Promise<RateLimitDecision> {
    const bucketKey = `kyy:rl:${key}:${Math.floor(Date.now() / (windowSeconds * 1000))}`
    const pipeline = [
      ['INCR', bucketKey],
      ['EXPIRE', bucketKey, String(windowSeconds), 'NX'],
    ]
    const response = await fetch(`${this.restUrl}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.restToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pipeline),
      signal: AbortSignal.timeout(3000),
    })
    if (!response.ok) {
      throw new Error(`Upstash returned ${response.status}`)
    }
    const results = (await response.json()) as UpstashCommandResult[]
    const count = Number(results[0]?.result ?? 0)
    if (count === 0) {
      throw new Error('Upstash returned an empty counter')
    }
    if (count <= limit) {
      return { allowed: true, limit, remaining: Math.max(0, limit - count), retryAfterSeconds: 0 }
    }
    return {
      allowed: false,
      limit,
      remaining: 0,
      retryAfterSeconds: windowSeconds - (Math.floor(Date.now() / 1000) % windowSeconds) + 1,
    }
  }
}

let limiterInstance: RateLimiter | null = null

export function createRateLimiter(config: ReturnType<typeof getConfig>): RateLimiter {
  if (config.upstashRestUrl && config.upstashRestToken) {
    return new UpstashRateLimiter(config.upstashRestUrl, config.upstashRestToken)
  }
  return new MemoryRateLimiter()
}

export function getRateLimiter(config: ReturnType<typeof getConfig>): RateLimiter {
  if (!limiterInstance) {
    limiterInstance = createRateLimiter(config)
  }
  return limiterInstance
}

export function resetRateLimiterForTests(): void {
  limiterInstance = null
}

export async function checkRateLimitSafe(
  limiter: RateLimiter,
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitDecision> {
  try {
    return await limiter.check(key, limit, windowSeconds)
  } catch (error) {
    logInternalError('rate-limit', error)
    return { allowed: true, limit, remaining: limit, retryAfterSeconds: 0 }
  }
}
