import { useQuery } from '@tanstack/react-query'
import { fetchCatalog, fetchStatus, filterEndpoints } from '@/services/api/catalog'
import type { ApiEndpoint } from '@/services/api/api.types'

export function useCatalog() {
  return useQuery({
    queryKey: ['catalog'],
    queryFn: fetchCatalog,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCatalogCategories() {
  const query = useCatalog()
  return { ...query, data: query.data?.categories }
}

export function useCatalogEndpoints() {
  const query = useCatalog()
  return { ...query, data: query.data?.endpoints }
}

export function useEndpointSearch(endpoints: ApiEndpoint[] | undefined, query: string, limit = 8): ApiEndpoint[] {
  if (!endpoints) return []
  return filterEndpoints(endpoints, query).slice(0, limit)
}

export function usePlatformStatus() {
  return useQuery({
    queryKey: ['platform-status'],
    queryFn: fetchStatus,
    staleTime: 60 * 1000,
  })
}
