import type { ApiResponse, ApiRequestConfig } from '@/services/api/api.types'

export interface ApiAdapter {
  request<T = Record<string, unknown>>(config: ApiRequestConfig): Promise<ApiResponse<T>>
}
