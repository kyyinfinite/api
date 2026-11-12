import type { Repositories, UsageLogRow } from '../database/repositories/types'

export interface AdminAnalytics {
  mode: 'supabase' | 'memory'
  generatedAt: string
  last24h: {
    requests: number
    successRate: number
    avgResponseMs: number
    cacheHits: number
    rateLimited: number
  }
  last7d: {
    requests: number
    errors: number
    daily: Array<{ date: string; requests: number; errors: number }>
  }
  perEndpoint: Array<{
    slug: string
    requests: number
    errors: number
    avgResponseMs: number
  }>
  providerFailures7d: number
  openIncidents: number
}

const LOG_FETCH_LIMIT = 20_000

export async function buildAdminAnalytics(repos: Repositories): Promise<AdminAnalytics> {
  const generatedAt = new Date().toISOString()
  const cutoff7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const cutoff24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  const [endpoints, logs, incidents] = await Promise.all([
    repos.endpoints.listAll(),
    repos.usageLogs.recentSince(cutoff7d, LOG_FETCH_LIMIT),
    repos.incidents.recent(100),
  ])

  const endpointById = new Map(endpoints.map((endpoint) => [endpoint.id, endpoint]))
  const dailyBuckets = new Map<string, { requests: number; errors: number }>()
  for (let offset = 6; offset >= 0; offset--) {
    const date = new Date(Date.now() - offset * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    dailyBuckets.set(date, { requests: 0, errors: 0 })
  }

  const perEndpoint = new Map<string, { requests: number; errors: number; durationSum: number }>()
  let requests24h = 0
  let success24h = 0
  let durationSum24h = 0
  let cacheHits24h = 0
  let rateLimited24h = 0

  for (const log of logs as UsageLogRow[]) {
    const date = log.created_at.slice(0, 10)
    const bucket = dailyBuckets.get(date)
    if (bucket) {
      bucket.requests += 1
      if (log.status_code >= 400) bucket.errors += 1
    }
    if (log.created_at >= cutoff24h) {
      requests24h += 1
      if (log.status_code < 400) success24h += 1
      durationSum24h += log.duration_ms
      if (log.cache_status === 'HIT') cacheHits24h += 1
      if (log.status_code === 429) rateLimited24h += 1
    }
    if (log.endpoint_id) {
      const slug = endpointById.get(log.endpoint_id)?.slug
      if (slug) {
        const stats = perEndpoint.get(slug) ?? { requests: 0, errors: 0, durationSum: 0 }
        stats.requests += 1
        if (log.status_code >= 400) stats.errors += 1
        stats.durationSum += log.duration_ms
        perEndpoint.set(slug, stats)
      }
    }
  }

  const providerFailures7d = incidents.filter(
    (incident) =>
      incident.incident_type === 'provider_failure' &&
      Date.parse(incident.created_at) >= Date.parse(cutoff7d),
  ).length

  return {
    mode: repos.mode,
    generatedAt,
    last24h: {
      requests: requests24h,
      successRate: requests24h > 0 ? Math.round((success24h / requests24h) * 10000) / 100 : 100,
      avgResponseMs: requests24h > 0 ? Math.round(durationSum24h / requests24h) : 0,
      cacheHits: cacheHits24h,
      rateLimited: rateLimited24h,
    },
    last7d: {
      requests: logs.length,
      errors: logs.filter((log) => log.status_code >= 400).length,
      daily: [...dailyBuckets.entries()].map(([date, bucket]) => ({ date, ...bucket })),
    },
    perEndpoint: [...perEndpoint.entries()]
      .map(([slug, stats]) => ({
        slug,
        requests: stats.requests,
        errors: stats.errors,
        avgResponseMs: stats.requests > 0 ? Math.round(stats.durationSum / stats.requests) : 0,
      }))
      .sort((a, b) => b.requests - a.requests),
    providerFailures7d,
    openIncidents: incidents.filter((incident) => incident.status === 'open').length,
  }
}
