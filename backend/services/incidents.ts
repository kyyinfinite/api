import type { NewIncident, Repositories } from '../database/repositories/types'
import { logInternalError } from '../core/errors'
import { background } from '../core/background'

const DEDUPE_WINDOW_MS = 10 * 60 * 1000
const MAX_TRACKED_INCIDENTS = 100

export async function recordIncidentSafe(
  repos: Repositories,
  incident: NewIncident,
): Promise<void> {
  try {
    const recent = await repos.incidents.recent(MAX_TRACKED_INCIDENTS)
    const now = Date.now()
    const duplicate = recent.find((row) => {
      const matchesEndpoint = (row.endpoint_id ?? null) === (incident.endpoint_id ?? null)
      const matchesType = row.incident_type === incident.incident_type
      const withinWindow = now - Date.parse(row.created_at) < DEDUPE_WINDOW_MS
      return matchesEndpoint && matchesType && withinWindow && row.status === 'open'
    })
    if (duplicate) return
    await repos.incidents.create(incident)
  } catch (error) {
    logInternalError('incidents', error)
  }
}

export function recordProviderFailure(
  repos: Repositories,
  endpointId: string | null,
  internalHint: string,
): void {
  logInternalError('provider-failure', internalHint)
  background(
    recordIncidentSafe(repos, {
      endpoint_id: endpointId,
      incident_type: 'provider_failure',
      message: 'A service backing one or more endpoints is currently failing. The team has been notified.',
      severity: 'major',
    }),
  )
}
