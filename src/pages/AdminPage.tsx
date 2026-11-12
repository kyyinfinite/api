import { useCallback, useEffect, useState } from 'react'
import { createClient, type Session } from '@supabase/supabase-js'
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Database,
  Gauge,
  KeyRound,
  Loader2,
  LogOut,
  RefreshCw,
  Save,
  Settings2,
  ShieldCheck,
  Trash2,
  Zap,
} from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { environment } from '@/config/environment'
import { cn } from '@/utils/cn'

interface AdminSession {
  email: string
  mode: string
}

interface EndpointAdminRow {
  id: string
  slug: string
  name: string
  public_path: string
  method: string
  kind: string
  is_active: boolean
  lifecycle: string
  cache_ttl: number
  rate_limit: { windowSeconds: number; max: number } | null
}

interface CategoryAdminRow {
  id: string
  name: string
  slug: string
  description: string
  sort_order: number
  is_active: boolean
}

interface ProviderAdminRow {
  id: string
  internalName: string
  adapterType: string
  isActive: boolean
  configuration: Record<string, unknown>
}

interface IncidentAdminRow {
  id: string
  incident_type: string
  message: string
  severity: string
  status: string
  created_at: string
}

interface Analytics {
  mode: string
  last24h: { requests: number; successRate: number; avgResponseMs: number; cacheHits: number; rateLimited: number }
  last7d: { requests: number; errors: number; daily: Array<{ date: string; requests: number; errors: number }> }
  perEndpoint: Array<{ slug: string; requests: number; errors: number; avgResponseMs: number }>
  providerFailures7d: number
  openIncidents: number
}

type TabId = 'overview' | 'endpoints' | 'categories' | 'providers' | 'incidents' | 'settings'

type SupabaseBrowserClient = NonNullable<ReturnType<typeof createSupabaseBrowserClient>>

const tabs: Array<{ id: TabId; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'endpoints', label: 'Endpoints' },
  { id: 'categories', label: 'Categories' },
  { id: 'providers', label: 'Providers' },
  { id: 'incidents', label: 'Incidents' },
  { id: 'settings', label: 'Settings' },
]

function createSupabaseBrowserClient() {
  if (!environment.supabaseUrl || !environment.supabaseAnonKey) return null
  return createClient(environment.supabaseUrl, environment.supabaseAnonKey, {
    auth: { persistSession: true, autoRefreshToken: true },
  })
}

export default function AdminPage() {
  const [client] = useState(createSupabaseBrowserClient)
  const [session, setSession] = useState<Session | null>(null)
  const [checking, setChecking] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  useEffect(() => {
    if (!client) {
      setChecking(false)
      return
    }
    client.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setChecking(false)
    })
    const { data: listener } = client.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })
    return () => listener.subscription.unsubscribe()
  }, [client])

  if (!client) {
    return (
      <PageContainer className="py-16">
        <div className="mx-auto max-w-lg rounded-2xl border border-line bg-paper-raised p-8 text-center">
          <ShieldCheck size={28} className="mx-auto text-cobalt" />
          <h1 className="mt-4 font-display text-2xl font-bold text-ink">Admin dashboard</h1>
          <p className="mt-3 font-body text-sm leading-relaxed text-ink-soft">
            The admin dashboard requires Supabase Auth. Configure{' '}
            <code className="rounded bg-paper-soft px-1.5 py-0.5 font-mono text-xs">VITE_SUPABASE_URL</code> and{' '}
            <code className="rounded bg-paper-soft px-1.5 py-0.5 font-mono text-xs">VITE_SUPABASE_ANON_KEY</code>{' '}
            in the environment, then grant your account access through the{' '}
            <code className="rounded bg-paper-soft px-1.5 py-0.5 font-mono text-xs">ADMIN_EMAILS</code> backend
            variable.
          </p>
        </div>
      </PageContainer>
    )
  }

  if (checking) {
    return (
      <PageContainer className="py-16">
        <div className="flex items-center justify-center gap-3 text-ink-soft">
          <Loader2 size={18} className="animate-spin" />
          <span className="font-mono text-sm">Checking session…</span>
        </div>
      </PageContainer>
    )
  }

  if (!session) {
    return (
      <PageContainer className="py-16">
        <form
          className="mx-auto w-full max-w-sm rounded-2xl border border-line bg-paper-raised p-8"
          onSubmit={async (event) => {
            event.preventDefault()
            setLoggingIn(true)
            setLoginError('')
            const { error } = await client.auth.signInWithPassword({ email, password })
            if (error) {
              setLoginError(error.message)
            }
            setLoggingIn(false)
          }}
        >
          <div className="flex items-center gap-2.5">
            <KeyRound size={20} className="text-cobalt" />
            <h1 className="font-display text-xl font-bold text-ink">Administrator sign in</h1>
          </div>
          <label className="mt-6 block font-body text-xs font-bold uppercase tracking-wideCaps text-ink-soft">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="mt-1.5 h-11 w-full rounded-[10px] border border-line bg-paper px-3.5 font-body text-sm normal-case tracking-normal text-ink focus:border-cobalt focus:outline-none"
            />
          </label>
          <label className="mt-4 block font-body text-xs font-bold uppercase tracking-wideCaps text-ink-soft">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="mt-1.5 h-11 w-full rounded-[10px] border border-line bg-paper px-3.5 font-body text-sm normal-case tracking-normal text-ink focus:border-cobalt focus:outline-none"
            />
          </label>
          {loginError && (
            <p className="mt-4 rounded-lg border border-signal/40 bg-signal/10 px-3 py-2 font-body text-xs text-signal">
              {loginError}
            </p>
          )}
          <button
            type="submit"
            disabled={loggingIn}
            className="btn-primary mt-6 h-12 w-full justify-center text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loggingIn ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
            Sign in
          </button>
        </form>
      </PageContainer>
    )
  }

  return <AdminDashboard client={client} session={session} onSignOut={() => client.auth.signOut()} />
}

function AdminDashboard({
  client,
  session,
  onSignOut,
}: {
  client: SupabaseBrowserClient
  session: Session
  onSignOut: () => void
}) {
  const [tab, setTab] = useState<TabId>('overview')
  const [sessionInfo, setSessionInfo] = useState<AdminSession | null>(null)

  useEffect(() => {
    adminFetch<AdminSession>(client, session, '/session').then(setSessionInfo).catch(() => setSessionInfo(null))
  }, [client, session])

  return (
    <PageContainer className="py-10 md:py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">ADMINISTRATION</p>
          <h1 className="mt-3 font-display text-[32px] font-bold leading-[1.08] text-ink md:text-[40px]">
            Platform control room
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {sessionInfo && (
            <span className="rounded-full border border-line bg-paper-raised px-3 py-1.5 font-mono text-xs text-ink-soft">
              {sessionInfo.email} · {sessionInfo.mode}
            </span>
          )}
          <button
            onClick={onSignOut}
            className="inline-flex h-11 items-center gap-2 rounded-[10px] border-[1.5px] border-line bg-paper-raised px-4 font-body text-sm font-bold text-ink transition-colors hover:border-signal hover:text-signal"
          >
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {tabs.map((entry) => (
          <button
            key={entry.id}
            onClick={() => setTab(entry.id)}
            className={cn(
              'rounded-[10px] px-4 py-2.5 font-body text-sm font-semibold transition-colors',
              tab === entry.id ? 'bg-navy text-white' : 'border border-line bg-paper-raised text-ink hover:border-cobalt hover:text-cobalt',
            )}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === 'overview' && <OverviewPanel client={client} session={session} />}
        {tab === 'endpoints' && <EndpointsPanel client={client} session={session} />}
        {tab === 'categories' && <CategoriesPanel client={client} session={session} />}
        {tab === 'providers' && <ProvidersPanel client={client} session={session} />}
        {tab === 'incidents' && <IncidentsPanel client={client} session={session} />}
        {tab === 'settings' && <SettingsPanel client={client} session={session} />}
      </div>
    </PageContainer>
  )
}

async function adminFetch<T>(
  client: SupabaseBrowserClient,
  session: Session,
  path: string,
  init?: { method?: string; body?: unknown },
): Promise<T> {
  const { data } = await client.auth.getSession()
  const token = data.session?.access_token ?? session.access_token
  const response = await fetch(`/api/v1/admin${path}`, {
    method: init?.method ?? 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init?.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
  })
  const payload = (await response.json()) as Record<string, unknown>
  if (!response.ok) {
    const errorPart = payload.error as { details?: string; type?: string } | undefined
    throw new Error(errorPart?.type ?? `Admin request failed (${response.status})`)
  }
  return payload as T
}

function useAdminResource<T>(
  client: SupabaseBrowserClient,
  session: Session,
  path: string,
  pick: (payload: Record<string, unknown>) => T,
) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setData(pick(await adminFetch(client, session, path)))
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }, [client, session, path, pick])

  useEffect(() => {
    void reload()
  }, [reload])

  return { data, error, loading, reload, setData }
}

function PanelState({ loading, error, onRetry }: { loading: boolean; error: string; onRetry: () => void }) {
  if (loading) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-paper-raised p-8 text-ink-soft">
        <Loader2 size={17} className="animate-spin" />
        <span className="font-mono text-sm">Loading…</span>
      </div>
    )
  }
  if (error) {
    return (
      <div className="rounded-2xl border border-signal/40 bg-signal/5 p-8 text-center">
        <p className="font-mono text-sm text-signal">{error}</p>
        <button onClick={onRetry} className="btn-primary mx-auto mt-4 h-10 px-4 text-xs">
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    )
  }
  return null
}

function StatCard({ icon: Icon, label, value, hint }: { icon: typeof Activity; label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-paper-raised p-5">
      <div className="flex items-center gap-2.5">
        <Icon size={16} className="text-cobalt" />
        <p className="font-body text-xs font-bold uppercase tracking-wideCaps text-ink-soft">{label}</p>
      </div>
      <p className="mt-3 font-display text-2xl font-bold text-ink">{value}</p>
      {hint && <p className="mt-1 font-mono text-[11px] text-ink-soft">{hint}</p>}
    </div>
  )
}

function OverviewPanel({ client, session }: { client: SupabaseBrowserClient; session: Session }) {
  const { data, error, loading, reload } = useAdminResource<Analytics | null>(
    client,
    session,
    '/analytics',
    (payload) => (payload as unknown as Analytics) ?? null,
  )

  return (
    <div className="flex flex-col gap-6">
      <PanelState loading={loading} error={error} onRetry={reload} />
      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={Activity} label="Requests · 24h" value={String(data.last24h.requests)} hint={`${data.last7d.requests} in 7 days`} />
            <StatCard icon={Gauge} label="Success rate" value={`${data.last24h.successRate}%`} hint={`avg ${data.last24h.avgResponseMs} ms`} />
            <StatCard icon={Zap} label="Cache hits · 24h" value={String(data.last24h.cacheHits)} hint={`${data.last24h.rateLimited} rate limited`} />
            <StatCard icon={AlertTriangle} label="Incidents" value={String(data.openIncidents)} hint={`${data.providerFailures7d} provider failures in 7d`} />
          </div>

          <div className="rounded-2xl border border-line bg-paper-raised p-5">
            <p className="font-body text-sm font-bold text-ink">Requests · last 7 days</p>
            <div className="mt-4 flex h-32 items-end gap-2">
              {data.last7d.daily.map((day) => {
                const max = Math.max(1, ...data.last7d.daily.map((entry) => entry.requests))
                return (
                  <div key={day.date} className="flex flex-1 flex-col items-center gap-1.5">
                    <div className="flex h-full w-full items-end">
                      <div
                        className="w-full rounded-t-md bg-cobalt/80"
                        style={{ height: `${Math.max(4, (day.requests / max) * 100)}%` }}
                        title={`${day.date}: ${day.requests} requests, ${day.errors} errors`}
                      />
                    </div>
                    <span className="font-mono text-[9px] text-ink-soft">{day.date.slice(5)}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-paper-raised p-5">
            <p className="font-body text-sm font-bold text-ink">Per endpoint · 7 days</p>
            {data.perEndpoint.length === 0 ? (
              <p className="mt-3 font-body text-sm text-ink-soft">No traffic recorded yet.</p>
            ) : (
              <table className="mt-4 w-full text-left">
                <thead>
                  <tr className="border-b border-line-muted font-body text-[11px] uppercase tracking-wideCaps text-ink-soft">
                    <th className="py-2">Endpoint</th>
                    <th className="py-2">Requests</th>
                    <th className="py-2">Errors</th>
                    <th className="py-2">Avg ms</th>
                  </tr>
                </thead>
                <tbody>
                  {data.perEndpoint.map((row) => (
                    <tr key={row.slug} className="border-b border-line-muted last:border-0 font-mono text-xs text-ink-soft">
                      <td className="py-2 text-ink">{row.slug}</td>
                      <td className="py-2">{row.requests}</td>
                      <td className="py-2">{row.errors}</td>
                      <td className="py-2">{row.avgResponseMs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function EndpointsPanel({ client, session }: { client: SupabaseBrowserClient; session: Session }) {
  const { data, error, loading, reload } = useAdminResource<EndpointAdminRow[]>(
    client,
    session,
    '/endpoints',
    (payload) => ((payload as { endpoints?: EndpointAdminRow[] }).endpoints ?? []),
  )
  const [busyId, setBusyId] = useState('')

  const patch = async (id: string, body: Record<string, unknown>) => {
    setBusyId(id)
    try {
      await adminFetch(client, session, `/endpoints/${id}`, { method: 'PATCH', body })
      await reload()
    } finally {
      setBusyId('')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <PanelState loading={loading} error={error} onRetry={reload} />
      {data && data.length === 0 && (
        <p className="rounded-2xl border border-dashed border-line bg-paper-soft p-8 text-center font-body text-sm text-ink-soft">
          No endpoints registered yet.
        </p>
      )}
      {data?.map((row) => (
        <div key={row.id} className="rounded-2xl border border-line bg-paper-raised p-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-md bg-cobalt px-2 py-1 font-mono text-[10px] font-bold text-white">{row.method}</span>
            <code className="font-mono text-sm text-ink">{row.public_path}</code>
            <span className="rounded-md border border-line-muted bg-paper px-2 py-0.5 font-mono text-[10px] uppercase text-ink-soft">
              {row.kind} · {row.lifecycle}
            </span>
            <label className="ml-auto flex cursor-pointer items-center gap-2 font-body text-xs font-semibold text-ink-soft">
              <input
                type="checkbox"
                checked={row.is_active}
                disabled={busyId === row.id}
                onChange={(e) => patch(row.id, { isActive: e.target.checked })}
                className="h-4 w-4 accent-[#2f54eb]"
              />
              Active
            </label>
          </div>
          <div className="mt-4 flex flex-wrap items-end gap-4">
            <label className="font-body text-[11px] font-bold uppercase tracking-wideCaps text-ink-soft">
              Cache TTL (s)
              <input
                type="number"
                min={0}
                max={86400}
                defaultValue={row.cache_ttl}
                onBlur={(e) => {
                  const value = Number(e.target.value)
                  if (value !== row.cache_ttl) patch(row.id, { cacheTtl: value })
                }}
                className="mt-1 block h-10 w-28 rounded-lg border border-line bg-paper px-3 font-mono text-xs text-ink focus:border-cobalt focus:outline-none"
              />
            </label>
            <label className="font-body text-[11px] font-bold uppercase tracking-wideCaps text-ink-soft">
              Rate limit max / window
              <input
                type="number"
                min={1}
                max={10000}
                defaultValue={row.rate_limit?.max ?? ''}
                onBlur={(e) => {
                  const value = Number(e.target.value)
                  if (row.rate_limit && value !== row.rate_limit.max && value > 0) {
                    patch(row.id, { rateLimit: { windowSeconds: row.rate_limit.windowSeconds, max: value } })
                  }
                }}
                className="mt-1 block h-10 w-28 rounded-lg border border-line bg-paper px-3 font-mono text-xs text-ink focus:border-cobalt focus:outline-none"
              />
            </label>
            {busyId === row.id && <Loader2 size={15} className="animate-spin text-cobalt" />}
          </div>
        </div>
      ))}
    </div>
  )
}

function CategoriesPanel({ client, session }: { client: SupabaseBrowserClient; session: Session }) {
  const { data, error, loading, reload } = useAdminResource<CategoryAdminRow[]>(
    client,
    session,
    '/categories',
    (payload) => ((payload as { categories?: CategoryAdminRow[] }).categories ?? []),
  )
  const [busyId, setBusyId] = useState('')

  const patch = async (id: string, body: Record<string, unknown>) => {
    setBusyId(id)
    try {
      await adminFetch(client, session, `/categories/${id}`, { method: 'PATCH', body })
      await reload()
    } finally {
      setBusyId('')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <PanelState loading={loading} error={error} onRetry={reload} />
      {data?.map((row) => (
        <div key={row.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-paper-raised p-5">
          <div className="min-w-0">
            <p className="font-body text-sm font-bold text-ink">{row.name}</p>
            <p className="font-mono text-xs text-ink-soft">{row.slug} · {row.description || 'no description'}</p>
          </div>
          <label className="ml-auto font-body text-[11px] font-bold uppercase tracking-wideCaps text-ink-soft">
            Sort
            <input
              type="number"
              min={0}
              max={1000}
              defaultValue={row.sort_order}
              onBlur={(e) => {
                const value = Number(e.target.value)
                if (value !== row.sort_order) patch(row.id, { sortOrder: value })
              }}
              className="mt-1 block h-10 w-20 rounded-lg border border-line bg-paper px-3 font-mono text-xs text-ink focus:border-cobalt focus:outline-none"
            />
          </label>
          <label className="flex cursor-pointer items-center gap-2 font-body text-xs font-semibold text-ink-soft">
            <input
              type="checkbox"
              checked={row.is_active}
              disabled={busyId === row.id}
              onChange={(e) => patch(row.id, { isActive: e.target.checked })}
              className="h-4 w-4 accent-[#2f54eb]"
            />
            Active
          </label>
          {busyId === row.id && <Loader2 size={15} className="animate-spin text-cobalt" />}
        </div>
      ))}
    </div>
  )
}

function ProvidersPanel({ client, session }: { client: SupabaseBrowserClient; session: Session }) {
  const { data, error, loading, reload } = useAdminResource<ProviderAdminRow[]>(
    client,
    session,
    '/providers',
    (payload) => ((payload as { providers?: ProviderAdminRow[] }).providers ?? []),
  )

  const toggle = async (id: string, isActive: boolean) => {
    await adminFetch(client, session, `/providers/${id}`, { method: 'PATCH', body: { isActive } })
    await reload()
  }

  return (
    <div className="flex flex-col gap-4">
      <PanelState loading={loading} error={error} onRetry={reload} />
      {data?.map((row) => (
        <div key={row.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-paper-raised p-5">
          <Database size={18} className="text-cobalt" />
          <div className="min-w-0">
            <p className="font-body text-sm font-bold text-ink">{row.internalName}</p>
            <p className="font-mono text-xs text-ink-soft">adapter: {row.adapterType}</p>
          </div>
          <code className="ml-auto hidden rounded-md bg-paper-soft px-2 py-1 font-mono text-[10px] text-ink-soft md:block">
            {JSON.stringify(row.configuration)}
          </code>
          <label className="flex cursor-pointer items-center gap-2 font-body text-xs font-semibold text-ink-soft">
            <input
              type="checkbox"
              checked={row.isActive}
              onChange={(e) => toggle(row.id, e.target.checked)}
              className="h-4 w-4 accent-[#2f54eb]"
            />
            Active
          </label>
        </div>
      ))}
    </div>
  )
}

function IncidentsPanel({ client, session }: { client: SupabaseBrowserClient; session: Session }) {
  const { data, error, loading, reload } = useAdminResource<IncidentAdminRow[]>(
    client,
    session,
    '/incidents',
    (payload) => ((payload as { incidents?: IncidentAdminRow[] }).incidents ?? []),
  )

  const resolve = async (id: string) => {
    await adminFetch(client, session, `/incidents/${id}/resolve`, { method: 'PATCH' })
    await reload()
  }

  return (
    <div className="flex flex-col gap-4">
      <PanelState loading={loading} error={error} onRetry={reload} />
      {data && data.length === 0 && (
        <div className="rounded-2xl border border-dashed border-line bg-paper-soft p-8 text-center">
          <CheckCircle2 size={20} className="mx-auto text-success" />
          <p className="mt-2 font-body text-sm font-semibold text-ink">No incidents recorded</p>
        </div>
      )}
      {data?.map((row) => (
        <div key={row.id} className="rounded-2xl border border-line bg-paper-raised p-5">
          <div className="flex flex-wrap items-center gap-3">
            <AlertTriangle size={16} className={row.status === 'open' ? 'text-signal' : 'text-success'} />
            <span className="rounded-md border border-line-muted bg-paper px-2 py-0.5 font-mono text-[10px] uppercase text-ink-soft">
              {row.incident_type} · {row.severity}
            </span>
            <span className="font-mono text-[11px] text-ink-soft">{new Date(row.created_at).toLocaleString()}</span>
            {row.status === 'open' ? (
              <button
                onClick={() => resolve(row.id)}
                className="btn-primary ml-auto h-9 px-3 text-xs"
              >
                <CheckCircle2 size={13} /> Resolve
              </button>
            ) : (
              <span className="ml-auto rounded-md border border-success/40 bg-success/10 px-2 py-1 font-body text-[11px] font-bold text-success">
                resolved
              </span>
            )}
          </div>
          <p className="mt-3 font-body text-sm leading-relaxed text-ink-soft">{row.message}</p>
        </div>
      ))}
    </div>
  )
}

function SettingsPanel({ client, session }: { client: SupabaseBrowserClient; session: Session }) {
  const [text, setText] = useState('{}')
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [flushing, setFlushing] = useState(false)

  useEffect(() => {
    adminFetch(client, session, '/settings')
      .then((payload) => {
        const settings = ((payload as { settings?: Array<{ setting_key: string; setting_value: unknown }> }).settings ?? [])
        const overrides = settings.find((row) => row.setting_key === 'rate_limit_overrides')
        setText(JSON.stringify(overrides?.setting_value ?? { global: null, endpoints: {} }, null, 2))
      })
      .catch(() => setText('{}'))
  }, [client, session])

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-line bg-paper-raised p-5">
        <div className="flex items-center gap-2.5">
          <Settings2 size={16} className="text-cobalt" />
          <p className="font-body text-sm font-bold text-ink">Rate limit overrides</p>
        </div>
        <p className="mt-1 font-body text-xs text-ink-soft">
          JSON with a global override and per-endpoint overrides keyed by slug. Set null to use defaults.
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          spellCheck={false}
          className="mt-3 w-full rounded-lg border border-line bg-paper px-3.5 py-3 font-mono text-xs text-ink focus:border-cobalt focus:outline-none"
        />
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={async () => {
              setSaving(true)
              setStatus('')
              try {
                const parsed: unknown = JSON.parse(text)
                await adminFetch(client, session, '/settings', {
                  method: 'PUT',
                  body: { key: 'rate_limit_overrides', value: parsed },
                })
                setStatus('Saved. Changes propagate within seconds.')
              } catch (caught) {
                setStatus(caught instanceof Error ? caught.message : 'Invalid JSON.')
              } finally {
                setSaving(false)
              }
            }}
            disabled={saving}
            className="btn-primary h-11 px-5 text-sm disabled:opacity-60"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Save settings
          </button>
          <button
            onClick={async () => {
              setFlushing(true)
              try {
                await adminFetch(client, session, '/cache/flush', { method: 'POST' })
                setStatus('Caches flushed.')
              } catch {
                setStatus('Flush failed.')
              } finally {
                setFlushing(false)
              }
            }}
            disabled={flushing}
            className="inline-flex h-11 items-center gap-2 rounded-[10px] border-[1.5px] border-line bg-paper-raised px-5 font-body text-sm font-bold text-ink transition-colors hover:border-cobalt hover:text-cobalt disabled:opacity-60"
          >
            {flushing ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />} Flush caches
          </button>
          {status && <span className="font-mono text-xs text-ink-soft">{status}</span>}
        </div>
      </div>
    </div>
  )
}
