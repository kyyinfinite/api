import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useCatalog } from '@/hooks/useCatalog'
import { filterEndpoints } from '@/services/api/catalog'
import type { ApiEndpoint } from '@/services/api/api.types'

export function useSearch(limit = 8) {
  const { data } = useCatalog()
  const endpoints = data?.endpoints
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const debounceRef = useRef<number | null>(null)
  const [debouncedQuery, setDebouncedQuery] = useState('')

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(() => setDebouncedQuery(query), 140)
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current)
    }
  }, [query])

  const results = useMemo<ApiEndpoint[]>(() => {
    if (!endpoints || !debouncedQuery.trim()) return []
    return filterEndpoints(endpoints, debouncedQuery).slice(0, limit)
  }, [endpoints, debouncedQuery, limit])

  const openDialog = useCallback(() => setOpen(true), [])
  const closeDialog = useCallback(() => setOpen(false), [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen((prev) => !prev)
      }
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const categoryName = useCallback(
    (id: string) => {
      return data?.categories.find((category) => category.id === id)?.name ?? id
    },
    [data],
  )

  return { query, setQuery, results, open, openDialog, closeDialog, categoryName }
}
