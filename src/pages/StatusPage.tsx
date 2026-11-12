import { Activity, AlertTriangle, CheckCircle2, Clock, Wrench } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { usePlatformStatus } from '@/hooks/useCatalog'
import { cn } from '@/utils/cn'

const statusMeta = {
  operational: { label: 'Operational', cls: 'bg-success', text: 'text-[#15854a]' },
  degraded: { label: 'Degraded', cls: 'bg-signal', text: 'text-signal' },
  maintenance: { label: 'Maintenance', cls: 'bg-cobalt', text: 'text-cobalt' },
} as const

const incidentIcon = {
  minor: AlertTriangle,
  major: AlertTriangle,
  maintenance: Wrench,
} as const

const incidentBadge = {
  minor: 'border-signal/40 bg-signal/10 text-signal',
  major: 'border-red-500/40 bg-red-500/10 text-red-600',
  maintenance: 'border-cobalt/40 bg-cobalt/10 text-cobalt',
} as const

export default function StatusPage() {
  const { data, isLoading, isError, refetch } = usePlatformStatus()

  if (isError && !data) {
    return (
      <PageContainer className="py-10 md:py-14">
        <p data-enter className="eyebrow">STATUS</p>
        <h1 data-enter className="mt-3 font-display text-[36px] font-bold leading-[1.08] text-ink md:text-[44px]">
          Status is unavailable.
        </h1>
        <p className="mt-3 font-body text-[15px] text-ink-soft">The status service could not be reached.</p>
        <button
          onClick={() => refetch()}
          className="mt-5 rounded-lg border border-line px-4 py-2 font-body text-sm font-semibold text-ink transition-colors hover:border-cobalt hover:text-cobalt"
        >
          Retry
        </button>
      </PageContainer>
    )
  }

  if (isLoading || !data) {
    return (
      <PageContainer className="py-10 md:py-14">
        <p data-enter className="eyebrow">STATUS</p>
        <h1 data-enter className="mt-3 font-display text-[36px] font-bold leading-[1.08] text-ink md:text-[44px]">
          All systems, at a glance.
        </h1>
        <div className="mt-10 flex items-center gap-3 text-ink-soft">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cobalt" />
          <span className="font-mono text-sm">Loading platform status…</span>
        </div>
      </PageContainer>
    )
  }

  const groups = data.serviceGroups
  const incidents = data.incidents
  const degradedCount = groups.filter((g) => g.status !== 'operational').length

  return (
    <PageContainer className="py-10 md:py-14">
      <div className="mb-8">
        <p data-enter className="eyebrow">STATUS</p>
        <h1 data-enter className="mt-3 font-display text-[36px] font-bold leading-[1.08] text-ink md:text-[44px]">
          All systems, at a glance.
        </h1>
        <p data-enter className="mt-3 max-w-xl font-body text-[15px] leading-relaxed text-ink-soft">
          This dashboard renders{' '}
          <span className="font-semibold text-ink">
            live platform metrics
          </span>{' '}
          aggregated from real request telemetry.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-paper-raised p-5">
          <div className="flex items-center gap-2.5">
            <span className={cn('h-2.5 w-2.5 rounded-full', data.overall === 'operational' ? 'bg-success' : 'bg-signal')} />
            <p className="font-body text-sm font-bold text-ink">
              {data.overall === 'operational' ? 'All systems operational' : 'Partial degradation'}
            </p>
          </div>
          <p className="mt-2 font-mono text-xs text-ink-soft">
            region: Global · {data.windowDays}d uptime {data.uptimePercent}%
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-paper-raised p-5">
          <div className="flex items-center gap-2.5">
            <Clock size={16} className="text-cobalt" />
            <p className="font-body text-sm font-bold text-ink">Avg response</p>
          </div>
          <p className="mt-2 font-mono text-xs text-ink-soft">
            {data.avgResponseMs} ms avg across all service groups
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-paper-raised p-5">
          <div className="flex items-center gap-2.5">
            <Activity size={16} className="text-cobalt" />
            <p className="font-body text-sm font-bold text-ink">Service groups</p>
          </div>
          <p className="mt-2 font-mono text-xs text-ink-soft">
            {groups.length} groups · {degradedCount === 0 ? 'all operational' : `${degradedCount} with advisories`}
          </p>
        </div>
      </div>

      <section className="mt-10" aria-label="Service groups">
        <h2 className="font-display text-lg font-bold text-ink">API service groups</h2>
        <div className="mt-4 flex flex-col gap-3">
          {groups.map((group) => {
            const meta = statusMeta[group.status]
            return (
              <div key={group.id} className="rounded-2xl border border-line bg-paper-raised p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={cn('h-2.5 w-2.5 rounded-full', meta.cls)} />
                    <div>
                      <p className="font-body text-[15px] font-bold text-ink">{group.name}</p>
                      <p className="font-body text-xs text-ink-soft">{group.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 font-mono text-xs">
                    <span className="text-ink-soft">{group.responseTimeMs} ms</span>
                    <span className={cn('font-semibold', meta.text)}>{meta.label}</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-[3px]" role="img" aria-label={`60 day uptime for ${group.name}`}>
                  {group.history.map((day) => (
                    <span
                      key={day.date}
                      title={`${day.date} · ${day.uptime.toFixed(2)}%`}
                      className={cn(
                        'h-7 flex-1 rounded-[3px]',
                        day.degraded ? 'bg-signal/80' : 'bg-success/80',
                      )}
                    />
                  ))}
                </div>
                <p className="mt-2 font-mono text-[11px] text-ink-soft">
                  last 60 days · green = operational, orange = degraded
                </p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="mt-12" aria-label="Recent incidents">
        <h2 className="font-display text-lg font-bold text-ink">Recent incidents</h2>
        <div className="mt-4 flex flex-col gap-3">
          {incidents.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-paper-soft px-4 py-10 text-center">
              <p className="font-body text-sm font-semibold text-ink">No incidents recorded</p>
              <p className="mt-1 font-body text-[13px] text-ink-soft">
                Platform telemetry shows no open incidents right now.
              </p>
            </div>
          ) : (
            incidents.map((incident) => {
              const Icon = incidentIcon[incident.severity]
              return (
                <article key={incident.id} className="rounded-2xl border border-line bg-paper-raised p-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <Icon
                      size={17}
                      className={incident.severity === 'maintenance' ? 'text-cobalt' : 'text-signal'}
                    />
                    <p className="font-body text-[15px] font-bold text-ink">{incident.title}</p>
                    <span
                      className={cn(
                        'rounded-md border px-2 py-0.5 font-body text-[11px] font-bold uppercase tracking-wide',
                        incidentBadge[incident.severity],
                      )}
                    >
                      {incident.severity}
                    </span>
                    <span className="ml-auto flex items-center gap-1.5 font-mono text-[11px] text-ink-soft">
                      {incident.status === 'resolved' ? (
                        <CheckCircle2 size={12} className="text-success" />
                      ) : (
                        <Clock size={12} className="text-signal" />
                      )}
                      {incident.status}
                    </span>
                  </div>
                  <p className="mt-3 font-body text-sm leading-relaxed text-ink-soft">
                    {incident.description}
                  </p>
                  <p className="mt-3 font-mono text-[11px] text-ink-soft">
                    {incident.date}
                    {incident.duration ? ` · resolved in ${incident.duration}` : ''}
                  </p>
                </article>
              )
            })
          )}
        </div>
      </section>

      <p className="mt-10 rounded-xl border border-dashed border-line bg-paper-soft px-4 py-3 text-center font-mono text-[11px] text-ink-soft">
        live data · generated from platform telemetry
      </p>
    </PageContainer>
  )
}
