export interface Incident {
  id: string
  title: string
  severity: 'minor' | 'major' | 'maintenance'
  status: 'resolved' | 'monitoring' | 'ongoing'
  date: string
  duration: string
  description: string
}

export interface ServiceDay {
  date: string
  uptime: number
  degraded: boolean
}

export interface ServiceGroup {
  id: string
  name: string
  description: string
  status: 'operational' | 'degraded' | 'maintenance'
  responseTimeMs: number
  history: ServiceDay[]
}

export const serviceGroups: ServiceGroup[] = [
  { id: 'ai', name: 'AI & Tools', description: 'Text engine and utilities', status: 'operational', responseTimeMs: 142, history: [] },
  { id: 'downloader', name: 'Downloader', description: 'Media fetch pipeline', status: 'operational', responseTimeMs: 203, history: [] },
  { id: 'search', name: 'Search', description: 'Web and image search', status: 'operational', responseTimeMs: 118, history: [] },
  { id: 'image', name: 'Image', description: 'Image processing workers', status: 'operational', responseTimeMs: 167, history: [] },
  { id: 'whatsapp', name: 'WhatsApp', description: 'WhatsApp bridge', status: 'degraded', responseTimeMs: 388, history: [] },
  { id: 'information', name: 'Information', description: 'Reference data services', status: 'operational', responseTimeMs: 96, history: [] },
]

export const incidents: Incident[] = [
  {
    id: 'inc-003',
    title: 'Elevated latency on WhatsApp bridge',
    severity: 'minor',
    status: 'monitoring',
    date: 'Nov 10, 2026',
    duration: 'ongoing 2h 14m',
    description:
      'The WhatsApp bridge is answering with higher latency than usual. Jobs continue to complete successfully. We are monitoring while the upstream connection stabilizes.',
  },
  {
    id: 'inc-002',
    title: 'Scheduled maintenance: search index rebuild',
    severity: 'maintenance',
    status: 'resolved',
    date: 'Nov 03, 2026',
    duration: '38m',
    description:
      'The search index was rebuilt to include fresher results. Search endpoints returned cached responses during the window and are fully operational again.',
  },
  {
    id: 'inc-001',
    title: 'Image processing queue backlog',
    severity: 'minor',
    status: 'resolved',
    date: 'Oct 22, 2026',
    duration: '1h 05m',
    description:
      'A burst of image jobs created a short queue backlog. Requests were delayed but none were dropped. The queue drained and normal response times resumed.',
  },
]

export function withHistory(groups: ServiceGroup[]): ServiceGroup[] {
  const today = new Date()
  return groups.map((group, gi) => ({
    ...group,
    history: Array.from({ length: 60 }, (_, i) => {
      const d = new Date(today)
      d.setDate(d.getDate() - (59 - i))
      const seed = (i * 31 + gi * 17) % 97
      const degraded = seed === 3 || seed === 71
      return {
        date: d.toISOString().slice(0, 10),
        uptime: degraded ? 99.42 : 99.95 + ((seed % 5) / 100),
        degraded,
      }
    }),
  }))
}

export const platformStatus = {
  overall: 'operational' as const,
  uptime90d: 99.98,
  avgResponseMs: 154,
  region: 'Global',
}
