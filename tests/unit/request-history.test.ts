import { describe, expect, it } from 'vitest'
import {
  HISTORY_MAX_ENTRIES,
  HISTORY_STORAGE_KEY,
  createEntry,
  loadHistory,
  mergeEntry,
  sanitizeRequest,
  saveHistory,
  type HistoryEntry,
  type HistoryResult,
} from '../../src/services/api/requestHistory'
import type { ApiRequestConfig } from '../../src/services/api/api.types'

const okResult: HistoryResult = { status: 200, durationMs: 12, sizeBytes: 100, binary: false, error: null }

function memoryStorage() {
  const data = new Map<string, string>()
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
  }
}

describe('request history', () => {
  it('strips sensitive headers and the abort signal before storing', () => {
    const config: ApiRequestConfig = {
      method: 'GET',
      path: '/x',
      headers: { Accept: 'application/json', Authorization: 'Bearer secret', 'X-Api-Key': 'abc' },
      signal: new AbortController().signal,
    }
    const stored = sanitizeRequest(config)
    expect(stored.headers).toEqual({ Accept: 'application/json' })
    expect('signal' in stored).toBe(false)
  })

  it('moves a repeated request to the top instead of duplicating it', () => {
    const config: ApiRequestConfig = { method: 'GET', path: '/x', query: { q: 'a' } }
    const first = createEntry(config, okResult, 1)
    const other = createEntry({ method: 'GET', path: '/y' }, okResult, 2)
    const again = createEntry(config, { ...okResult, status: 500 }, 3)
    const merged = mergeEntry(mergeEntry(mergeEntry([], first), other), again)
    expect(merged).toHaveLength(2)
    expect(merged[0].status).toBe(500)
    expect(merged[1].request.path).toBe('/y')
  })

  it('caps the number of stored entries', () => {
    let entries: HistoryEntry[] = []
    for (let index = 0; index < HISTORY_MAX_ENTRIES + 5; index += 1) {
      entries = mergeEntry(entries, createEntry({ method: 'GET', path: `/p${index}` }, okResult, index))
    }
    expect(entries).toHaveLength(HISTORY_MAX_ENTRIES)
    expect(entries[0].request.path).toBe(`/p${HISTORY_MAX_ENTRIES + 4}`)
  })

  it('round-trips through storage and ignores corrupted data', () => {
    const storage = memoryStorage()
    const entry = createEntry({ method: 'GET', path: '/x' }, okResult, 1)
    saveHistory(storage, [entry])
    expect(loadHistory(storage)).toEqual([entry])

    storage.setItem(HISTORY_STORAGE_KEY, '{not json')
    expect(loadHistory(storage)).toEqual([])

    storage.setItem(HISTORY_STORAGE_KEY, JSON.stringify([{ nope: true }, entry]))
    expect(loadHistory(storage)).toEqual([entry])
  })

  it('removes the storage key when history is empty', () => {
    const storage = memoryStorage()
    saveHistory(storage, [createEntry({ method: 'GET', path: '/x' }, okResult, 1)])
    saveHistory(storage, [])
    expect(storage.getItem(HISTORY_STORAGE_KEY)).toBeNull()
  })
})
