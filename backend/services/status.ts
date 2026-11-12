import type { IncidentRow, Repositories, UsageLogRow } from '../database/repositories/types'

export interface PublicStatusPayload {
  overall: 'operational' | 'degraded'
  uptimePercent: number
  windowDays: number
  avgResponseMs: number
  generatedAt: string
  serviceGroups: Array<{
    id: string
    name: string
    description: string
    status: 'operational' | 'degraded'
    responseTimeMs: number
    history: Array<{ date: string; uptime: number; degraded: boolean }>
  }>
  incidents: Array<{
    id: string
    title: string
    severity: string
    status: string
    date: string
    description: string
  }>
}

const HISTORY_DAYS = 60
const LOG_FETCH_LIMIT = 20_000

function dayKey(iso: string): string {
  return iso.slice(0, 10)
}

function buildDayBuckets(): Map<string, { total: number; errors: number }> {
  const buckets = new Map<string, { total: number; errors: number }>()
  const today = new Date()
  for (let offset = HISTORY_DAYS - 1; offset >= 0; offset--) {
    const date = new Date(today)
    date.setUTCDate(date.getUTCDate() - offset)
    buckets.set(date.toISOString().slice(0, 10), { total: 0, errors: 0 })
  }
  return buckets
}

export async function buildPublicStatus(repos: Repositories): Promise<PublicStatusPayload> {
  const generatedAt = new Date().toISOString()
  const cutoff = new Date(Date.now() - HISTORY_DAYS * 24 * 60 * 60 * 1000).toISOString()

  const [categories, endpoints, logs, incidents] = await Promise.all([
    repos.categories.list(),
    repos.endpoints.listAll(),
    repos.usageLogs.recentSince(cutoff, LOG_FETCH_LIMIT),
    repos.incidents.recent(10),
  ])

  const endpointCategory = new Map(endpoints.map((endpoint) => [endpoint.id, endpoint.category_id]))
  const activeCategories = categories.filter((category) => category.is_active)

  const perDay = buildDayBuckets()
  const perCategoryRecent = new Map<string, { total: number; errors: number; durationSum: number }>()
  const recentCutoff = Date.now() - 24 * 60 * 60 * 1000

  for (const log of logs as UsageLogRow[]) {
    const bucket = perDay.get(dayKey(log.created_at))
    if (bucket) {
      bucket.total += 1
      if (log.status_code >= 500) bucket.errors += 1
    }
    if (Date.parse(log.created_at) >= recentCutoff) {
      const categoryId = log.endpoint_id ? endpointCategory.get(log.endpoint_id) : undefined
      if (categoryId) {
        const stats = perCategoryRecent.get(categoryId) ?? { total: 0, errors: 0, durationSum: 0 }
        stats.total += 1
        if (log.status_code >= 500) stats.errors += 1
        stats.durationSum += log.duration_ms
        perCategoryRecent.set(categoryId, stats)
      }
    }
  }

  let globalTotal = 0
  let globalDurationSum = 0
  let globalDayErrors = 0
  let globalDayTotal = 0
  for (const [date, bucket] of perDay) {
    globalTotal += bucket.total
    if (date === dayKey(generatedAt) || Date.parse(`${date}T00:00:00Z`) >= Date.now() - 24 * 3600 * 1000) {
      globalDayTotal += bucket.total
      globalDayErrors += bucket.errors
    }
  }
  for (const log of logs as UsageLogRow[]) {
    globalDurationSum += log.duration_ms
  }

  const serviceGroups = activeCategories.map((category) => {
    const recent = perCategoryRecent.get(category.id)
    const responseTimeMs = recent && recent.total > 0 ? Math.round(recent.durationSum / recent.total) : 0
    const successRate = recent && recent.total >= 5 ? 1 - recent.errors / recent.total : 1
    const history = [...perDay.entries()].map(([date, bucket]) => {
      const uptime = bucket.total === 0 ? 100 : Math.max(0, (1 - bucket.errors / bucket.total) * 100)
      return { date, uptime: Math.round(uptime * 100) / 100, degraded: bucket.total > 5 && uptime < 99.5 }
    })
    const categoryUptime =
      history.reduce((sum, day) => sum + day.uptime, 0) / Math.max(1, history.length)
    return {
      id: category.slug,
      name: category.name,
      description: category.description,
      status: (successRate < 0.97 ? 'degraded' : 'operational') as 'operational' | 'degraded',
      responseTimeMs,
      history,
      uptimePercent: Math.round(categoryUptime * 100) / 100,
    }
  })

  const weightedUptime =
    globalTotal > 0
      ? serviceGroups.reduce((sum, group) => sum + group.uptimePercent, 0) / serviceGroups.length
      : 100

  const openIncidents = incidents.filter((incident: IncidentRow) => incident.status === 'open')
  const overall: 'operational' | 'degraded' =
    openIncidents.some((incident: IncidentRow) => incident.severity === 'critical') ||
    serviceGroups.some((group) => group.status === 'degraded')
      ? 'degraded'
      : 'operational'

  return {
    overall,
    uptimePercent: Math.round(weightedUptime * 100) / 100,
    windowDays: HISTORY_DAYS,
    avgResponseMs: globalTotal > 0 ? Math.round(globalDurationSum / globalTotal) : 0,
    generatedAt,
    serviceGroups,
    incidents: incidents.map((incident: IncidentRow) => ({
      id: incident.id,
      title: incident.message.split('.').slice(0, 1).join('.') || 'Service incident',
      severity: incident.severity === 'critical' ? 'major' : incident.severity,
      status: incident.status,
      date: new Date(incident.created_at).toISOString().slice(0, 10),
      description: incident.message,
    })),
  }
}
