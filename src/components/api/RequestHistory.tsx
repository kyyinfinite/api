import { History, Play, X } from 'lucide-react'
import { EndpointBadge } from './EndpointBadge'
import type { HistoryEntry } from '@/services/api/requestHistory'
import { cn } from '@/utils/cn'

interface RequestHistoryProps {
  entries: HistoryEntry[]
  busy: boolean
  onLoad: (entry: HistoryEntry) => void
  onRerun: (entry: HistoryEntry) => void
  onRemove: (id: string) => void
  onClear: () => void
}

function summarize(entry: HistoryEntry): string {
  const query = new URLSearchParams(entry.request.query ?? {}).toString()
  return `${entry.request.path}${query ? `?${query}` : ''}`
}

function statusLabel(entry: HistoryEntry): string {
  return entry.status === null ? 'ERR' : String(entry.status)
}

function isOk(entry: HistoryEntry): boolean {
  return entry.status !== null && entry.status >= 200 && entry.status < 400
}

export function RequestHistory({ entries, busy, onLoad, onRerun, onRemove, onClear }: RequestHistoryProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-paper-raised">
      <div className="flex items-center justify-between border-b border-line-muted px-4 py-3">
        <p className="flex items-center gap-2 font-body text-[11px] font-bold uppercase tracking-wideCaps text-ink-soft">
          <History size={13} /> History
          <span className="font-mono text-[11px] font-medium normal-case tracking-normal">{entries.length}</span>
        </p>
        {entries.length > 0 && (
          <button
            onClick={onClear}
            className="rounded-md px-2 py-1 font-body text-xs font-semibold text-ink-soft transition-colors hover:text-signal"
          >
            Clear
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <p className="px-4 py-8 text-center font-body text-[13px] text-ink-soft">
          Requests you send appear here and can be loaded or re-run.
        </p>
      ) : (
        <ul className="max-h-[340px] divide-y divide-line-muted overflow-y-auto">
          {entries.map((entry) => (
            <li key={entry.id} className="flex items-center gap-1.5 px-2 py-1.5">
              <button
                onClick={() => onLoad(entry)}
                className="flex min-w-0 flex-1 flex-col gap-1.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-paper"
                aria-label={`Load ${entry.request.method} ${summarize(entry)}`}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <EndpointBadge method={entry.request.method} />
                  <span className="min-w-0 flex-1 truncate font-mono text-xs text-ink">{summarize(entry)}</span>
                </span>
                <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-[11px] text-ink-soft">
                  <span
                    className={cn(
                      'rounded px-1.5 py-0.5 font-bold',
                      isOk(entry) ? 'bg-success/10 text-[#15854a]' : 'bg-signal/10 text-signal',
                    )}
                  >
                    {statusLabel(entry)}
                  </span>
                  {entry.durationMs !== null && <span>{entry.durationMs} ms</span>}
                  {entry.sizeBytes !== null && <span>{(entry.sizeBytes / 1024).toFixed(2)} KB</span>}
                  {entry.binary && <span>file</span>}
                  <span>{new Date(entry.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </span>
              </button>
              <button
                onClick={() => onRerun(entry)}
                disabled={busy}
                aria-label="Run again"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line text-ink-soft transition-colors hover:border-cobalt hover:text-cobalt disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Play size={13} />
              </button>
              <button
                onClick={() => onRemove(entry.id)}
                aria-label="Remove from history"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line text-ink-soft transition-colors hover:border-signal hover:text-signal"
              >
                <X size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
