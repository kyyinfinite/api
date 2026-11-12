import type { Repositories } from '../database/repositories/types'
import { MemoryCache } from '../core/cache'
import { logInternalError } from '../core/errors'

export interface RateLimitOverride {
  windowSeconds: number
  max: number
}

export interface RateLimitOverrides {
  global: RateLimitOverride | null
  endpoints: Record<string, RateLimitOverride | null>
}

const SETTINGS_CACHE_KEY = 'settings:rate_limit_overrides'
const SETTINGS_TTL_SECONDS = 30

function parseOverride(value: unknown): RateLimitOverride | null {
  if (!value || typeof value !== 'object') return null
  const candidate = value as { windowSeconds?: unknown; max?: unknown }
  const windowSeconds = Number(candidate.windowSeconds)
  const max = Number(candidate.max)
  if (!Number.isInteger(windowSeconds) || windowSeconds <= 0 || windowSeconds > 3600) return null
  if (!Number.isInteger(max) || max <= 0 || max > 10_000) return null
  return { windowSeconds, max }
}

export async function getRateLimitOverrides(
  repos: Repositories,
  cache: MemoryCache<unknown>,
): Promise<RateLimitOverrides> {
  const cached = cache.get(SETTINGS_CACHE_KEY)
  if (cached) {
    return cached as RateLimitOverrides
  }
  const overrides: RateLimitOverrides = { global: null, endpoints: {} }
  try {
    const stored = await repos.settings.get('rate_limit_overrides')
    if (stored && typeof stored === 'object') {
      const candidate = stored as { global?: unknown; endpoints?: unknown }
      overrides.global = parseOverride(candidate.global)
      if (candidate.endpoints && typeof candidate.endpoints === 'object') {
        for (const [slug, value] of Object.entries(candidate.endpoints as Record<string, unknown>)) {
          if (value === null) {
            overrides.endpoints[slug] = null
          } else {
            const parsed = parseOverride(value)
            if (parsed) overrides.endpoints[slug] = parsed
          }
        }
      }
    }
  } catch (error) {
    logInternalError('settings', error)
  }
  cache.set(SETTINGS_CACHE_KEY, overrides, SETTINGS_TTL_SECONDS)
  return overrides
}
