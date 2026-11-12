import { useMemo, useState } from 'react'
import { CategoryIcon } from '@/components/categories/CategoryIcon'
import { useSearchParams } from 'react-router-dom'
import { Search, LayoutGrid } from 'lucide-react'
import { useCatalog } from '@/hooks/useCatalog'
import { filterEndpoints } from '@/services/api/catalog'
import { ApiCard } from '@/components/api/ApiCard'
import { Reveal } from '@/components/motion/Reveal'
import { PageContainer } from '@/components/layout/PageContainer'
import { EndpointBadge } from '@/components/api/EndpointBadge'
import { cn } from '@/utils/cn'

const PAGE_SIZE = 9

export default function ApiExplorerPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('category') ?? 'all'
  const [query, setQuery] = useState('')
  const [visible, setVisible] = useState(PAGE_SIZE)
  const { data, isLoading, isError, refetch } = useCatalog()
  const categories = data?.categories ?? []
  const endpoints = data?.endpoints ?? []

  const filtered = useMemo(
    () => filterEndpoints(endpoints, query, activeCategory === 'all' ? undefined : activeCategory),
    [endpoints, query, activeCategory],
  )

  const shown = filtered.slice(0, visible)

  const setCategory = (id: string) => {
    setVisible(PAGE_SIZE)
    if (id === 'all') searchParams.delete('category')
    else searchParams.set('category', id)
    setSearchParams(searchParams, { replace: true })
  }

  return (
    <PageContainer className="py-10 md:py-14">
      <div className="mb-8 flex flex-col gap-4 md:mb-10">
        <div>
          <p data-enter className="eyebrow">API EXPLORER</p>
          <h1 data-enter className="mt-3 font-display text-[36px] font-bold leading-[1.08] text-ink md:text-[44px]">
            Every endpoint, one library.
          </h1>
        </div>
        <div className="flex h-12 max-w-md items-center gap-2.5 rounded-[10px] border border-line bg-paper-raised px-3.5 focus-within:border-cobalt">
          <Search size={17} className="shrink-0 text-ink-soft" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setVisible(PAGE_SIZE)
            }}
            placeholder="Filter endpoints by name, path, or description…"
            className="h-full w-full bg-transparent font-body text-sm text-ink placeholder:text-ink-soft focus:outline-none"
            aria-label="Filter endpoints"
          />
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[230px_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start" aria-label="Categories">
          <p className="mb-3 flex items-center gap-2 font-body text-[11px] font-bold uppercase tracking-wideCaps text-ink-soft">
            <LayoutGrid size={13} /> Categories
          </p>
          <nav className="flex flex-col gap-0.5">
            <button
              onClick={() => setCategory('all')}
              className={cn(
                'flex items-center justify-between rounded-lg px-3 py-2.5 text-left font-body text-sm transition-colors',
                activeCategory === 'all'
                  ? 'bg-navy text-white'
                  : 'text-ink hover:bg-paper-soft',
              )}
            >
              All endpoints
              <span className="font-mono text-[11px] opacity-70">{endpoints.length}</span>
            </button>
            {categories.map((c) => {
              const count = endpoints.filter((e) => e.category === c.id).length
              return (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={cn(
                    'flex items-center justify-between rounded-lg px-3 py-2.5 text-left font-body text-sm transition-colors',
                    activeCategory === c.id
                      ? 'bg-navy text-white'
                      : 'text-ink hover:bg-paper-soft',
                  )}
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <CategoryIcon slug={c.slug} label={c.name} className="h-6 w-6" />
                    <span className="truncate">{c.name}</span>
                  </span>
                  <span className="font-mono text-[11px] opacity-70">{count}</span>
                </button>
              )
            })}
          </nav>

          <div className="mt-6 rounded-xl border border-line bg-paper-raised p-4">
            <p className="font-body text-[13px] font-semibold text-ink">All APIs are free</p>
            <p className="mt-1 font-body text-xs leading-relaxed text-ink-soft">
              No API keys, subscriptions, or billing. Fair-use rate limits protect public services.
            </p>
          </div>
        </aside>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="font-mono text-xs text-ink-soft">
              {filtered.length} endpoint{filtered.length === 1 ? '' : 's'}
              {activeCategory !== 'all' &&
                ` · ${categories.find((c) => c.id === activeCategory)?.name ?? ''}`}
            </p>
            {query && (
              <p className="font-mono text-xs text-ink-soft">query: “{query}”</p>
            )}
          </div>

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="h-[172px] animate-pulse rounded-2xl border border-line bg-paper-raised" />
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-dashed border-line bg-paper-soft py-16 text-center">
              <p className="font-body text-sm font-semibold text-ink">The catalog could not be loaded</p>
              <button
                onClick={() => refetch()}
                className="mt-4 rounded-lg border border-line px-4 py-2 font-body text-sm font-semibold text-ink transition-colors hover:border-cobalt hover:text-cobalt"
              >
                Retry
              </button>
            </div>
          ) : shown.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line bg-paper-soft py-16 text-center">
              <p className="font-body text-sm font-semibold text-ink">No endpoints found</p>
              <p className="mt-1 font-body text-[13px] text-ink-soft">
                Try a different keyword or clear the category filter.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {shown.map((endpoint, index) => (
                  <Reveal key={endpoint.id} delay={(index % 3) * 0.06} distance={28}>
                    <ApiCard endpoint={endpoint} />
                  </Reveal>
                ))}
              </div>

              {visible < filtered.length && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    className="inline-flex h-11 items-center gap-2 rounded-[10px] border-[1.5px] border-line bg-paper-raised px-6 font-body text-sm font-bold text-ink shadow-tactileLine transition-[transform,box-shadow] hover:border-[#c9c4b7] active:translate-y-[3px] active:shadow-[0_1px_0_0_#D8D5CB]"
                  >
                    Load more endpoints
                    <span className="font-mono text-xs text-ink-soft">
                      {visible}/{filtered.length}
                    </span>
                  </button>
                </div>
              )}
            </>
          )}

          <div className="mt-14 rounded-2xl border border-line bg-paper-raised p-6 md:p-8">
            <p className="eyebrow">CONSISTENT BY DESIGN</p>
            <h2 className="mt-3 font-display text-2xl font-bold text-ink">
              One response envelope everywhere
            </h2>
            <p className="mt-2 max-w-xl font-body text-sm leading-relaxed text-ink-soft">
              Every endpoint answers with the same shape, so your error handling and parsing code
              never changes between categories.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-navy-border bg-navy px-4 py-3">
              <EndpointBadge method="GET" />
              <code className="font-mono text-[13px] text-[#c8cfe4]">/api/v1/any/endpoint</code>
              <span className="ml-auto font-mono text-xs text-success">200 OK · ~120 ms</span>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
