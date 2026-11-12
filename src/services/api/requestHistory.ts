import type { ApiRequestConfig } from './api.types'

export const HISTORY_STORAGE_KEY = 'kyyinfinite.playground.history.v1'
export const HISTORY_MAX_ENTRIES = 20

const SENSITIVE_HEADER = /authorization|cookie|token|secret|key/i

export type StoredRequest = Pick<ApiRequestConfig, 'method' | 'path' | 'query' | 'headers' | 'body'>

export interface HistoryEntry {
  id: string
  at: number
  request: StoredRequest
  status: number | null
  durationMs: number | null
  sizeBytes: number | null
  binary: boolean
  error: string | null
}

export interface HistoryResult {
  status: number | null
  durationMs: number | null
  sizeBytes: number | null
  binary: boolean
  error: string | null
}

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export function sanitizeRequest(config: ApiRequestConfig): StoredRequest {
  const headers = Object.fromEntries(
    Object.entries(config.headers ?? {}).filter(([key]) => !SENSITIVE_HEADER.test(key)),
  )
  return {
    method: config.method,
    path: config.path,
    query: config.query && Object.keys(config.query).length ? { ...config.query } : undefined,
    headers: Object.keys(headers).length ? headers : undefined,
    body: config.body ?? null,
  }
}

export function requestSignature(request: StoredRequest): string {
  return JSON.stringify([request.method, request.path, request.query ?? {}, request.body ?? null])
}

export function createEntry(config: ApiRequestConfig, result: HistoryResult, now = Date.now()): HistoryEntry {
  return {
    id: `${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    at: now,
    request: sanitizeRequest(config),
    ...result,
  }
}

export function mergeEntry(entries: HistoryEntry[], entry: HistoryEntry): HistoryEntry[] {
  const signature = requestSignature(entry.request)
  return [entry, ...entries.filter((item) => requestSignature(item.request) !== signature)].slice(
    0,
    HISTORY_MAX_ENTRIES,
  )
}

function isEntry(value: unknown): value is HistoryEntry {
  if (!value || typeof value !== 'object') return false
  const entry = value as Partial<HistoryEntry>
  return (
    typeof entry.id === 'string' &&
    typeof entry.at === 'number' &&
    !!entry.request &&
    typeof entry.request.path === 'string' &&
    typeof entry.request.method === 'string'
  )
}

export function loadHistory(storage: StorageLike | null): HistoryEntry[] {
  if (!storage) return []
  try {
    const raw = storage.getItem(HISTORY_STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isEntry).slice(0, HISTORY_MAX_ENTRIES)
  } catch {
    return []
  }
}

export function saveHistory(storage: StorageLike | null, entries: HistoryEntry[]): void {
  if (!storage) return
  try {
    if (entries.length === 0) storage.removeItem(HISTORY_STORAGE_KEY)
    else storage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(entries))
  } catch {
    return
  }
}
