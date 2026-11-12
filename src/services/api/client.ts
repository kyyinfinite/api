import type { ApiResponse, ApiRequestConfig } from '@/services/api/api.types'
import { HttpApiAdapter } from '@/adapters/HttpApiAdapter'
import { environment } from '@/config/environment'

const adapter = new HttpApiAdapter()

export function request<T = Record<string, unknown>>(
  config: ApiRequestConfig,
): Promise<ApiResponse<T>> {
  return adapter.request<T>(config)
}

export { environment as apiEnvironment }
