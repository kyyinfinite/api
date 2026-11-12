import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Play, RotateCcw, ChevronDown, Terminal } from 'lucide-react'
import { request } from '@/services/api/client'
import type { ApiRequestConfig, ApiResponse, HttpMethod } from '@/services/api/api.types'
import { useCatalog } from '@/hooks/useCatalog'
import { environment } from '@/config/environment'
import { JsonView, CopyButton, BinaryResponseViewer } from '@/components/api/ResponseViewer'
import { buildCurl, buildFetch, buildPython, isBinaryEndpoint } from '@/components/api/CodeExamples'
import { RequestHistory } from '@/components/api/RequestHistory'
import { useRequestHistory } from '@/hooks/useRequestHistory'
import type { HistoryEntry } from '@/services/api/requestHistory'
import { PageContainer } from '@/components/layout/PageContainer'
import { formatApiError, ApiError, TimeoutError, NetworkError } from '@/services/api/api.errors'
import { cn } from '@/utils/cn'

const METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

interface KeyValueRow {
  key: string
  value: string
}

type PlayState =
  | { phase: 'idle' }
  | { phase: 'loading' }
  | { phase: 'done'; response: ApiResponse<Record<string, unknown>> }
  | { phase: 'error'; message: string; body?: unknown }

function KeyValueEditor({
  rows,
  onChange,
  placeholderKey,
  placeholderValue,
}: {
  rows: KeyValueRow[]
  onChange: (rows: KeyValueRow[]) => void
  placeholderKey: string
  placeholderValue: string
}) {
  const update = (i: number, patch: Partial<KeyValueRow>) =>
    onChange(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)))

  return (
    <div className="flex flex-col gap-2">
      {rows.map((row, i) => (
        <div key={i} className="grid min-w-0 grid-cols-[1fr_1.4fr_40px] gap-2">
          <input
            value={row.key}
            onChange={(e) => update(i, { key: e.target.value })}
            placeholder={placeholderKey}
            className="h-10 min-w-0 rounded-lg border border-line bg-paper px-3 font-mono text-xs text-ink placeholder:text-ink-soft/70 focus:border-cobalt focus:outline-none"
            aria-label={placeholderKey}
          />
          <input
            value={row.value}
            onChange={(e) => update(i, { value: e.target.value })}
            placeholder={placeholderValue}
            className="h-10 min-w-0 rounded-lg border border-line bg-paper px-3 font-mono text-xs text-ink placeholder:text-ink-soft/70 focus:border-cobalt focus:outline-none"
            aria-label={placeholderValue}
          />
          <button
            onClick={() => onChange(rows.filter((_, idx) => idx !== i))}
            aria-label="Remove row"
            className="h-10 w-10 shrink-0 rounded-lg border border-line bg-paper-raised font-body text-sm text-ink-soft transition-colors hover:border-signal hover:text-signal"
          >
            ×
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange([...rows, { key: '', value: '' }])}
        className="self-start rounded-lg border border-dashed border-line px-3 py-1.5 font-body text-xs font-semibold text-ink-soft transition-colors hover:border-cobalt hover:text-cobalt"
      >
        + Add row
      </button>
    </div>
  )
}

const codeTabs = [
  { id: 'fetch', label: 'JavaScript' },
  { id: 'curl', label: 'cURL' },
  { id: 'python', label: 'Python' },
] as const

export default function PlaygroundPage() {
  const [searchParams] = useSearchParams()
  const presetId = searchParams.get('endpoint')
  const { data } = useCatalog()
  const endpoints = useMemo(() => data?.endpoints ?? [], [data])
  const appliedPreset = useRef<string | null>(null)

  const [method, setMethod] = useState<HttpMethod>('GET')
  const [path, setPath] = useState('/api/v1/tools/info')
  const [queryRows, setQueryRows] = useState<KeyValueRow[]>([])
  const [headerRows, setHeaderRows] = useState<KeyValueRow[]>([{ key: 'Accept', value: 'application/json' }])
  const [bodyText, setBodyText] = useState('')
  const [state, setState] = useState<PlayState>({ phase: 'idle' })
  const [activeTab, setActiveTab] = useState<(typeof codeTabs)[number]['id']>('fetch')
  const history = useRequestHistory()

  useEffect(() => {
    if (!presetId || endpoints.length === 0 || appliedPreset.current === presetId) return
    const ep = endpoints.find((e) => e.id === presetId)
    if (!ep) return
    appliedPreset.current = presetId
    setMethod(ep.method)
    setPath(ep.path)
    setQueryRows(
      ep.params
        .filter((p) => p.location === 'query' && p.example !== undefined)
        .map((p) => ({ key: p.name, value: String(p.example) })),
    )
    const bodyDefaults = Object.fromEntries(
      ep.params
        .filter((param) => param.location === 'body')
        .map((param) => [
          param.name,
          param.example ?? `YOUR_${param.name.replace(/[^a-z0-9]+/gi, '_').toUpperCase()}`,
        ]),
    )
    const exampleBody = { ...(ep.requestExample ?? {}), ...bodyDefaults }
    setBodyText(Object.keys(exampleBody).length ? JSON.stringify(exampleBody, null, 2) : '')
    setHeaderRows(isBinaryEndpoint(ep) ? [] : [{ key: 'Accept', value: 'application/json' }])
    setState({ phase: 'idle' })
  }, [presetId, endpoints])

  const config: ApiRequestConfig = useMemo(() => {
    const query: Record<string, string> = {}
    queryRows.forEach((r) => r.key && (query[r.key] = r.value))
    const headers: Record<string, string> = {}
    headerRows.forEach((r) => r.key && (headers[r.key] = r.value))
    let body: Record<string, unknown> | null = null
    if (bodyText.trim()) {
      try {
        body = JSON.parse(bodyText)
      } catch {
        body = null
      }
    }
    return { method, path, query, headers: Object.keys(headers).length ? headers : undefined, body }
  }, [method, path, queryRows, headerRows, bodyText])

  const bodyValid = useMemo(() => {
    if (!bodyText.trim()) return true
    try {
      JSON.parse(bodyText)
      return true
    } catch {
      return false
    }
  }, [bodyText])

  const send = async (override?: ApiRequestConfig) => {
    const target = override ?? config
    setState({ phase: 'loading' })
    try {
      const response = await request<Record<string, unknown>>(target)
      setState({ phase: 'done', response })
      history.record(target, {
        status: response.status,
        durationMs: response.durationMs,
        sizeBytes: response.sizeBytes,
        binary: Boolean(response.binary),
        error: null,
      })
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setState({ phase: 'idle' })
        return
      }
      const message =
        error instanceof TimeoutError
          ? 'The request timed out.'
          : error instanceof NetworkError
            ? error.message
            : formatApiError(error)
      setState({
        phase: 'error',
        message,
        body: error instanceof ApiError ? error.body : undefined,
      })
      history.record(target, {
        status: error instanceof ApiError ? error.code : null,
        durationMs: error instanceof ApiError ? (error.durationMs ?? null) : null,
        sizeBytes: error instanceof ApiError ? (error.sizeBytes ?? null) : null,
        binary: false,
        error: message,
      })
    }
  }

  const loadEntry = (entry: HistoryEntry) => {
    const { request: stored } = entry
    setMethod(stored.method)
    setPath(stored.path)
    setQueryRows(Object.entries(stored.query ?? {}).map(([key, value]) => ({ key, value })))
    setHeaderRows(Object.entries(stored.headers ?? {}).map(([key, value]) => ({ key, value })))
    setBodyText(stored.body ? JSON.stringify(stored.body, null, 2) : '')
    setState({ phase: 'idle' })
  }

  const rerunEntry = (entry: HistoryEntry) => {
    if (state.phase === 'loading') return
    loadEntry(entry)
    void send({ ...entry.request })
  }

  const matchedEndpoint = endpoints.find((e) => e.path === path.split('?')[0])
  const binaryMode =
    (matchedEndpoint ? isBinaryEndpoint(matchedEndpoint) : false) ||
    (state.phase === 'done' && Boolean(state.response.binary))

  const code = useMemo(() => {
    const base = environment.apiBaseUrl || window.location.origin
    const options = { binary: binaryMode }
    if (activeTab === 'curl') return buildCurl(config, base, options)
    if (activeTab === 'python') return buildPython(config, base, options)
    return buildFetch(config, base, options)
  }, [activeTab, config, binaryMode])

  return (
    <PageContainer className="py-10 md:py-14">
      <div className="mb-8">
        <p data-enter className="eyebrow">API PLAYGROUND</p>
        <h1 data-enter className="mt-3 font-display text-[36px] font-bold leading-[1.08] text-ink md:text-[44px]">
          Build a request. Inspect the envelope.
        </h1>
        <p data-enter className="mt-3 max-w-xl font-body text-[15px] leading-relaxed text-ink-soft">
          Compose requests against every documented endpoint.{' '}
          <span className="font-semibold text-ink">
            This playground sends real requests to the Kyyinfinite API
          </span>{' '}
          — responses come from the live platform.
        </p>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <div className="min-w-0 rounded-2xl border border-line bg-paper-raised p-5">
            <p className="mb-3 font-body text-[11px] font-bold uppercase tracking-wideCaps text-ink-soft">
              Request
            </p>
            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as HttpMethod)}
                  aria-label="HTTP method"
                  className="h-11 appearance-none rounded-[10px] border border-line bg-paper px-3.5 pr-8 font-mono text-sm font-bold text-ink focus:border-cobalt focus:outline-none"
                >
                  {METHODS.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-soft"
                />
              </div>
              <input
                value={path}
                onChange={(e) => setPath(e.target.value)}
                spellCheck={false}
                aria-label="Endpoint path"
                className="h-11 min-w-0 flex-1 rounded-[10px] border border-line bg-paper px-3.5 font-mono text-sm text-ink focus:border-cobalt focus:outline-none"
              />
            </div>

            {matchedEndpoint && (
              <p className="mt-2.5 font-mono text-[11px] text-ink-soft">
                matches: {matchedEndpoint.title} · {matchedEndpoint.method} {matchedEndpoint.path}
              </p>
            )}

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => void send()}
                disabled={state.phase === 'loading' || !bodyValid}
                className={cn(
                  'btn-primary h-12 px-6 text-sm',
                  (state.phase === 'loading' || !bodyValid) &&
                    'cursor-not-allowed opacity-60 active:translate-y-0',
                )}
              >
                {state.phase === 'loading' ? (
                  <>
                    <RotateCcw size={15} className="animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    <Play size={15} /> Send request
                  </>
                )}
              </button>
              <CopyButton value={`${method} ${path}`} label="Copy endpoint" />
              <span className="ml-auto flex items-center gap-1.5 rounded-md border border-line-muted bg-paper px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-ink-soft">
                <Terminal size={11} /> live api
              </span>
            </div>
          </div>

          <div className="min-w-0 rounded-2xl border border-line bg-paper-raised p-5">
            <p className="mb-3 font-body text-[11px] font-bold uppercase tracking-wideCaps text-ink-soft">
              Query parameters
            </p>
            <KeyValueEditor
              rows={queryRows}
              onChange={setQueryRows}
              placeholderKey="name"
              placeholderValue="value"
            />
          </div>

          <div className="min-w-0 rounded-2xl border border-line bg-paper-raised p-5">
            <p className="mb-3 font-body text-[11px] font-bold uppercase tracking-wideCaps text-ink-soft">
              Headers
            </p>
            <KeyValueEditor
              rows={headerRows}
              onChange={setHeaderRows}
              placeholderKey="Header-Name"
              placeholderValue="value"
            />
          </div>

          <div className="min-w-0 rounded-2xl border border-line bg-paper-raised p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-body text-[11px] font-bold uppercase tracking-wideCaps text-ink-soft">
                JSON body
              </p>
              {!bodyValid && (
                <span className="font-mono text-[11px] font-semibold text-signal">
                  invalid JSON
                </span>
              )}
            </div>
            <textarea
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              rows={6}
              spellCheck={false}
              placeholder={method === 'GET' ? 'GET requests usually have no body…' : '{ "key": "value" }'}
              className={cn(
                'w-full rounded-lg border bg-paper px-3.5 py-3 font-mono text-xs leading-relaxed text-ink focus:outline-none',
                bodyValid ? 'border-line focus:border-cobalt' : 'border-signal',
              )}
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-5">
          <div className="overflow-hidden rounded-2xl border border-navy-border bg-navy">
            <div className="flex items-center justify-between border-b border-navy-border px-4 py-3">
              <span className="flex items-center gap-2.5 font-body text-xs font-bold tracking-[0.06em] text-white">
                <span
                  className={cn(
                    'h-2.5 w-2.5 rounded-full',
                    state.phase === 'error'
                      ? 'bg-signal'
                      : state.phase === 'done'
                        ? 'bg-success'
                        : 'bg-[#4a5168]',
                  )}
                />
                RESPONSE
              </span>
              {state.phase === 'done' && (
                <span className="flex items-center gap-3 font-mono text-[11px]">
                  <span className="rounded-full bg-success px-2.5 py-0.5 font-bold text-white">
                    {state.response.status} {state.response.statusText}
                  </span>
                  <span className="text-success">{state.response.durationMs} ms</span>
                  <span className="text-[#8b93ab]">
                    {(state.response.sizeBytes / 1024).toFixed(2)} KB
                  </span>
                </span>
              )}
              {state.phase === 'error' && (
                <span className="rounded-full bg-signal px-2.5 py-0.5 font-mono text-[11px] font-bold text-white">
                  REQUEST FAILED
                </span>
              )}
            </div>

            <div className="min-h-[220px] p-4">
              {state.phase === 'idle' && (
                <p className="py-16 text-center font-mono text-xs text-[#6c7390]">
                  Configure a request and press Send.
                </p>
              )}
              {state.phase === 'loading' && (
                <div className="flex flex-col items-center justify-center gap-3 py-16">
                  <RotateCcw size={20} className="animate-spin text-[#6c7390]" />
                  <p className="font-mono text-xs text-[#6c7390]">awaiting response…</p>
                </div>
              )}
              {state.phase === 'done' && (state.response.binary ? <BinaryResponseViewer file={state.response.binary} /> : <JsonView data={state.response.data} />)}
              {state.phase === 'error' && (
                <div className="py-16 text-center">
                  <p className="font-mono text-xs text-signal">{state.message}</p>
                  {state.body !== undefined && typeof state.body === 'object' && state.body !== null && (
                    <div className="mt-4 text-left">
                      <JsonView data={state.body as Record<string, unknown>} />
                    </div>
                  )}
                  <p className="mt-2 font-mono text-[11px] text-[#6c7390]">
                    tip: check the docs for valid parameters and rate limits
                  </p>
                </div>
              )}
            </div>

            {state.phase === 'done' && (
              <div className="flex items-center justify-between border-t border-navy-border px-4 py-2.5">
                <span className="font-mono text-[10px] uppercase tracking-wideCaps text-[#4a5168]">
                  live response · kyyinfinite api
                </span>
                {!state.response.binary && (
                  <CopyButton
                    value={JSON.stringify(state.response.data, null, 2)}
                    label="Copy response"
                    onDark
                  />
                )}
              </div>
            )}
          </div>

          <div className="overflow-hidden rounded-2xl border border-line bg-paper-raised">
            <div className="flex items-center gap-1 border-b border-line-muted px-3 pt-2">
              {codeTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'rounded-t-lg px-3.5 py-2 font-body text-[13px] font-semibold transition-colors',
                    activeTab === tab.id
                      ? 'border border-line border-b-transparent bg-paper text-ink'
                      : 'text-ink-soft hover:text-ink',
                  )}
                >
                  {tab.label}
                </button>
              ))}
              <div className="ml-auto pb-1 pr-1">
                <CopyButton value={code} />
              </div>
            </div>
            <pre className="overflow-x-auto bg-paper p-4 font-mono text-[12px] leading-relaxed text-ink">
              {code}
            </pre>
          </div>

          <RequestHistory
            entries={history.entries}
            busy={state.phase === 'loading'}
            onLoad={loadEntry}
            onRerun={rerunEntry}
            onRemove={history.remove}
            onClear={history.clear}
          />
        </div>
      </div>
    </PageContainer>
  )
}
