import { useCallback, useRef, useState } from 'react'
import type { ApiRequestConfig } from '@/services/api/api.types'
import {
  createEntry,
  loadHistory,
  mergeEntry,
  saveHistory,
  type HistoryEntry,
  type HistoryResult,
} from '@/services/api/requestHistory'

function browserStorage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    return null
  }
}

export function useRequestHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>(() => loadHistory(browserStorage()))
  const latest = useRef(entries)

  const commit = useCallback((next: HistoryEntry[]) => {
    latest.current = next
    setEntries(next)
    saveHistory(browserStorage(), next)
  }, [])

  const record = useCallback(
    (config: ApiRequestConfig, result: HistoryResult) => {
      commit(mergeEntry(latest.current, createEntry(config, result)))
    },
    [commit],
  )

  const remove = useCallback(
    (id: string) => commit(latest.current.filter((entry) => entry.id !== id)),
    [commit],
  )

  const clear = useCallback(() => commit([]), [commit])

  return { entries, record, remove, clear }
}
