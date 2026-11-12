import { useMutation } from '@tanstack/react-query'
import { request } from '@/services/api/client'
import type { ApiResponse, ApiRequestConfig } from '@/services/api/api.types'

export function useApi() {
  return useMutation<ApiResponse<Record<string, unknown>>, unknown, ApiRequestConfig>({
    mutationFn: (config) => request(config),
  })
}
