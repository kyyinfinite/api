import { createContext, useContext, useEffect, useMemo, useRef } from 'react'
import { CategoryIcon } from '@/components/categories/CategoryIcon'
import { ArrowUpRight, FileText } from 'lucide-react'
import { useSearch } from '@/hooks/useSearch'
import { useTransitionNavigate } from '@/components/motion/PageTransition'
import { Input } from './Input'
import { EndpointBadge } from '@/components/api/EndpointBadge'

type SearchContextValue = ReturnType<typeof useSearch>

const SearchContext = createContext<SearchContextValue | null>(null)

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const search = useSearch()
  const value = useMemo(() => search, [search])
  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
}

export function useSearchDialog(): SearchContextValue {
  const ctx = useContext(SearchContext)
  if (!ctx) throw new Error('useSearchDialog must be used inside SearchProvider')
  return ctx
}

export function SearchDialogOverlay() {
  const { query, setQuery, results, open, closeDialog, categoryName } = useSearchDialog()
  const go = useTransitionNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 30)
      return () => clearTimeout(t)
    }
  }, [open])

  if (!open) return null

  const openEndpoint = (path: string) => {
    closeDialog()
    setQuery('')
    go(path)
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search APIs"
    >
      <button
        aria-label="Close search"
        className="absolute inset-0 cursor-default bg-navy/40 backdrop-blur-[2px]"
        onClick={closeDialog}
      />
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-paper-raised shadow-dropdown">
        <div className="border-b border-line-muted p-3">
          <Input
            ref={inputRef}
            icon="search"
            placeholder="Search endpoints, paths, descriptions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && results[0]) {
                openEndpoint(`/apis/${results[0].category}/${results[0].id}`)
              }
            }}
            className="h-12"
          />
        </div>

        <div className="max-h-[46vh] overflow-y-auto p-2">
          {!query.trim() && (
            <div className="px-3 py-8 text-center">
              <p className="font-mono text-xs uppercase tracking-wideCaps text-ink-soft">
                Type to search · Enter opens the first result
              </p>
            </div>
          )}

          {query.trim() && results.length === 0 && (
            <div className="px-3 py-8 text-center">
              <p className="font-body text-sm text-ink-soft">No endpoints match “{query}”.</p>
            </div>
          )}

          {results.map((endpoint) => (
            <button
              key={endpoint.id}
              onClick={() => openEndpoint(`/apis/${endpoint.category}/${endpoint.id}`)}
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-paper"
            >
              <CategoryIcon slug={endpoint.category} label={endpoint.category} className="h-8 w-8" />
              <EndpointBadge method={endpoint.method} />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-body text-sm font-semibold text-ink">
                  {endpoint.title}
                </span>
                <span className="block truncate font-mono text-xs text-ink-soft">
                  {endpoint.path}
                </span>
              </span>
              <span className="hidden shrink-0 rounded-md border border-line-muted bg-paper px-2 py-1 font-body text-[11px] font-medium text-ink-soft sm:block">
                {categoryName(endpoint.category)}
              </span>
              <ArrowUpRight
                size={16}
                className="shrink-0 text-ink-soft transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cobalt"
              />
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-line-muted px-4 py-2.5">
          <span className="flex items-center gap-2 font-mono text-[11px] text-ink-soft">
            <FileText size={12} /> Kyyinfinite endpoint index
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="kbd">esc</kbd>
            <span className="font-body text-[11px] text-ink-soft">to close</span>
          </span>
        </div>
      </div>
    </div>
  )
}
