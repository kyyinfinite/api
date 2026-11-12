import { useMemo, useState } from 'react'
import { CategoryIcon } from '@/components/categories/CategoryIcon'
import { useParams } from 'react-router-dom'
import { TLink } from '@/components/motion/PageTransition'
import { ArrowLeft, ArrowUpRight, FlaskConical } from 'lucide-react'
import { useCatalog } from '@/hooks/useCatalog'
import { EndpointBadge } from '@/components/api/EndpointBadge'
import { JsonView, CopyButton } from '@/components/api/ResponseViewer'
import { PageContainer } from '@/components/layout/PageContainer'
import { buildCurl, buildFetch, buildPython, isBinaryEndpoint } from '@/components/api/CodeExamples'
import type { ApiRequestConfig } from '@/services/api/api.types'
import { environment } from '@/config/environment'
import NotFoundPage from './NotFoundPage'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function DataTable({
  head,
  rows,
}: {
  head: string[]
  rows: React.ReactNode[][]
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-paper-raised">
      <table className="w-full min-w-[560px] text-left">
        <thead>
          <tr className="border-b border-line-muted">
            {head.map((h) => (
              <th
                key={h}
                className="px-4 py-3 font-body text-[11px] font-bold uppercase tracking-wideCaps text-ink-soft"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-line-muted last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 align-top font-body text-[13px] text-ink-soft">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function ApiDetailPage() {
  const { category, endpoint: endpointId } = useParams()
  const { data, isLoading, isError, refetch } = useCatalog()
  const endpoint = useMemo(
    () =>
      category && endpointId
        ? data?.endpoints.find((e) => e.category === category && e.id === endpointId)
        : undefined,
    [data, category, endpointId],
  )
  const categoryName = data?.categories.find((c) => c.id === endpoint?.category)?.name
  const [exampleTab, setExampleTab] = useState<'curl' | 'fetch' | 'python'>('curl')
  const exampleConfig = useMemo<ApiRequestConfig | null>(() => {
    if (!endpoint) return null
    const query: Record<string, string> = {}
    const body: Record<string, unknown> = { ...(endpoint.requestExample ?? {}) }
    endpoint.params.forEach((param) => {
      const value = param.example ?? `YOUR_${param.name.replace(/[^a-z0-9]+/gi, '_').toUpperCase()}`
      if (param.location === 'query') query[param.name] = String(value)
      if (param.location === 'body') body[param.name] = value
    })
    const headers = Object.fromEntries(endpoint.headers.map((header) => [
      header.name, header.name.toLowerCase() === 'content-type' ? 'application/json' : `YOUR_${header.name.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`,
    ]))
    return {
      method: endpoint.method,
      path: endpoint.path,
      query,
      headers: Object.keys(headers).length ? headers : undefined,
      body: Object.keys(body).length ? body : null,
    }
  }, [endpoint])
  const baseUrl = environment.apiBaseUrl || (typeof window !== 'undefined' ? window.location.origin : '')
  const snippetOptions = { binary: endpoint ? isBinaryEndpoint(endpoint) : false }
  const exampleCode = exampleConfig
    ? exampleTab === 'curl' ? buildCurl(exampleConfig, baseUrl, snippetOptions)
      : exampleTab === 'python' ? buildPython(exampleConfig, baseUrl, snippetOptions)
        : buildFetch(exampleConfig, baseUrl, snippetOptions)
    : ''

  if (isLoading) {
    return (
      <PageContainer className="py-10 md:py-14">
        <div className="flex items-center gap-3 text-ink-soft">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-cobalt" />
          <span className="font-mono text-sm">Loading endpoint…</span>
        </div>
      </PageContainer>
    )
  }

  if (isError && !data) {
    return (
      <PageContainer className="py-10 md:py-14">
        <p className="font-body text-sm font-semibold text-ink">The catalog could not be loaded.</p>
        <button
          onClick={() => refetch()}
          className="mt-4 rounded-lg border border-line px-4 py-2 font-body text-sm font-semibold text-ink transition-colors hover:border-cobalt hover:text-cobalt"
        >
          Retry
        </button>
      </PageContainer>
    )
  }

  if (!endpoint) return <NotFoundPage />

  return (
    <PageContainer className="py-10 md:py-14">
      <TLink
        to={`/apis?category=${endpoint.category}`}
        className="inline-flex items-center gap-2 font-body text-sm font-semibold text-ink-soft transition-colors hover:text-cobalt"
      >
        <ArrowLeft size={15} /> Back to {categoryName ?? 'explorer'}
      </TLink>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div data-enter className="flex items-center gap-3">
            <CategoryIcon slug={endpoint.category} label={categoryName ?? endpoint.category} className="h-10 w-10" />
            <p className="eyebrow">{categoryName?.toUpperCase() ?? 'ENDPOINT'}</p>
          </div>
          <h1 data-enter className="mt-3 font-display text-[34px] font-bold leading-[1.08] text-ink md:text-[42px]">
            {endpoint.title}
          </h1>
          <p data-enter className="mt-4 font-body text-[16px] leading-[1.6] text-ink-soft">
            {endpoint.description}
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
          <TLink
            to={`/playground?endpoint=${endpoint.id}`}
            className="btn-primary h-12 px-6 text-sm"
          >
            <FlaskConical size={16} /> Try this API
          </TLink>
          <span className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-[1.5px] border-line bg-paper-raised px-6 font-body text-sm font-bold text-ink-soft shadow-tactileLine">
            <span className="h-2 w-2 rounded-full bg-success" />
            No authentication required
          </span>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3 rounded-xl border border-navy-border bg-navy px-4 py-3.5">
        <EndpointBadge method={endpoint.method} />
        <code className="min-w-0 flex-1 truncate font-mono text-sm text-[#c8cfe4]">
          {endpoint.path}
        </code>
        <span className="rounded-md border border-success/40 bg-success/10 px-2 py-1 font-body text-[11px] font-bold text-success">
          FREE
        </span>
        <CopyButton value={endpoint.path} label="Copy path" onDark />
      </div>

      <Section title="Authentication">
        <p className="font-body text-sm leading-relaxed text-ink-soft">
          This public endpoint is completely free. Call it directly from any client — no API key, token, or developer signup is required.
        </p>
      </Section>

      {endpoint.params.length > 0 && (
        <Section title="Request parameters">
          <DataTable
            head={['Name', 'In', 'Type', 'Required', 'Example', 'Description']}
            rows={endpoint.params.map((p) => [
              <code key="n" className="font-mono text-xs text-cobalt">
                {p.name}
              </code>,
              <span key="l" className="font-mono text-xs uppercase">
                {p.location}
              </span>,
              <span key="t" className="font-mono text-xs">
                {p.type}
                {p.enumValues ? ` (${p.enumValues.join(' | ')})` : ''}
              </span>,
              p.required ? (
                <span key="r" className="font-semibold text-signal">
                  required
                </span>
              ) : (
                <span key="r">optional</span>
              ),
              <code key="e" className="font-mono text-xs text-ink">{p.example === undefined ? '—' : String(p.example)}</code>,
              <span key="d">{p.description}</span>,
            ])}
          />
        </Section>
      )}

      <Section title="Copy-ready request example">
        <div className="overflow-hidden rounded-xl border border-navy-border bg-navy">
          <div className="flex flex-wrap items-center gap-1 border-b border-navy-border px-3 pt-2">
            {([
              { id: 'curl', label: 'cURL' },
              { id: 'fetch', label: 'JavaScript' },
              { id: 'python', label: 'Python' },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setExampleTab(tab.id)}
                className={`rounded-t-lg px-3 py-2 font-body text-xs font-semibold transition-colors ${exampleTab === tab.id ? 'border border-navy-border border-b-transparent bg-[#172139] text-white' : 'text-[#8b93ab] hover:text-white'}`}
              >
                {tab.label}
              </button>
            ))}
            <div className="ml-auto pb-1 pr-1">
              <CopyButton value={exampleCode} label="Copy request" onDark />
            </div>
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#c8cfe4]">{exampleCode}</pre>
        </div>
        <p className="mt-2 font-body text-xs leading-relaxed text-ink-soft">
          Replace the <code className="font-mono">YOUR_...</code> sample values with your own input. No API key is needed.
        </p>
      </Section>

      {endpoint.headers.length > 0 && (
        <Section title="Request headers">
          <DataTable
            head={['Header', 'Required', 'Description']}
            rows={endpoint.headers.map((h) => [
              <code key="n" className="font-mono text-xs text-cobalt">
                {h.name}
              </code>,
              h.required ? (
                <span key="r" className="font-semibold text-signal">
                  required
                </span>
              ) : (
                <span key="r">optional</span>
              ),
              <span key="d">{h.description}</span>,
            ])}
          />
        </Section>
      )}

      {endpoint.requestExample && (
        <Section title="Example request body">
          <div className="relative rounded-xl border border-navy-border bg-navy p-4">
            <div className="absolute right-3 top-3">
              <CopyButton
                value={JSON.stringify(endpoint.requestExample, null, 2)}
                onDark
              />
            </div>
            <JsonView data={endpoint.requestExample} />
          </div>
        </Section>
      )}

      <Section title="Example response">
        <div className="relative rounded-xl border border-navy-border bg-navy p-4">
          <div className="absolute right-3 top-3">
            <CopyButton value={JSON.stringify(endpoint.responseExample, null, 2)} onDark />
          </div>
          <JsonView data={endpoint.responseExample} />
        </div>
      </Section>

      <Section title="Response schema">
        <DataTable
          head={['Field', 'Type', 'Description']}
          rows={endpoint.responseSchema.map((f) => [
            <code key="n" className="font-mono text-xs text-cobalt">
              {f.name}
            </code>,
            <span key="t" className="font-mono text-xs">
              {f.type}
            </span>,
            <span key="d">{f.description}</span>,
          ])}
        />
      </Section>

      <Section title="Error codes">
        <DataTable
          head={['Code', 'Name', 'Description']}
          rows={endpoint.errorCodes.map((e) => [
            <span key="c" className="font-mono text-xs font-bold text-signal">
              {e.code}
            </span>,
            <code key="n" className="font-mono text-xs text-cobalt">
              {e.name}
            </code>,
            <span key="d">{e.description}</span>,
          ])}
        />
      </Section>

      <div className="mt-12 rounded-2xl border border-line bg-paper-raised p-6 md:p-8">
        <h2 className="font-display text-xl font-bold text-ink">Ready to try it?</h2>
        <p className="mt-2 max-w-lg font-body text-sm leading-relaxed text-ink-soft">
          Send a live request from the playground and inspect the response, timing, and size — no setup required.
        </p>
        <TLink
          to={`/playground?endpoint=${endpoint.id}`}
          className="btn-primary mt-5 h-12 px-6 text-sm"
        >
          Open in Playground <ArrowUpRight size={15} />
        </TLink>
      </div>
    </PageContainer>
  )
}
