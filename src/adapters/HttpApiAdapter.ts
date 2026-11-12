import type { ApiAdapter } from './ApiAdapter'
import type { ApiResponse, ApiRequestConfig } from '@/services/api/api.types'
import { ApiError, NetworkError } from '@/services/api/api.errors'
import { environment } from '@/config/environment'

const REQUEST_TIMEOUT_MS = 30000

export class HttpApiAdapter implements ApiAdapter {
  private readonly baseUrl: string

  constructor(baseUrl = environment.apiBaseUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, '')
  }

  async request<T = Record<string, unknown>>(
    config: ApiRequestConfig,
  ): Promise<ApiResponse<T>> {
    const started = performance.now()
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
    const externalAbort = () => controller.abort()
    config.signal?.addEventListener('abort', externalAbort)

    const qs = new URLSearchParams(config.query ?? {}).toString()
    const url = `${this.baseUrl}${config.path}${qs ? `?${qs}` : ''}`

    try {
      const res = await fetch(url, {
        method: config.method,
        headers: {
          ...(config.body ? { 'Content-Type': 'application/json' } : {}),
          ...config.headers,
        },
        body: config.body ? JSON.stringify(config.body) : undefined,
        signal: controller.signal,
      })

      const contentType = res.headers.get('content-type') ?? ''
      if (res.ok && !contentType.includes('json')) {
        const blob = await res.blob()
        const disposition = res.headers.get('content-disposition')
        const encodedName = disposition?.match(/filename\*=UTF-8''([^;]+)/i)?.[1]
        const plainName = disposition?.match(/filename=\"?([^\";]+)\"?/i)?.[1]
        const mime = contentType.toLowerCase()
        const extension = mime.includes('png') ? 'png' : mime.includes('jpeg') ? 'jpg' : mime.includes('webp') ? 'webp' : mime.includes('gif') ? 'gif' : mime.includes('mpeg') ? 'mp3' : mime.includes('mp4') ? 'mp4' : mime.includes('pdf') ? 'pdf' : 'bin'
        let filename = plainName || `kyyinfinite-download.${extension}`
        if (encodedName) {
          try { filename = decodeURIComponent(encodedName) } catch { /* keep the plain fallback */ }
        }
        return {
          status: res.status,
          statusText: res.statusText || 'OK',
          durationMs: Math.round(performance.now() - started),
          sizeBytes: blob.size,
          data: { contentType, disposition, size: blob.size, filename, binary: true } as T,
          binary: { blob, contentType: contentType || blob.type || 'application/octet-stream', disposition, filename },
        }
      }

      const text = await res.text()
      const durationMs = Math.round(performance.now() - started)
      const sizeBytes = new TextEncoder().encode(text).length
      let parsed: unknown = {}
      if (text) {
        try {
          parsed = JSON.parse(text)
        } catch {
          parsed = { raw: text.slice(0, 2000) }
        }
      }

      if (!res.ok) {
        const envelope = parsed as { message?: string; error?: { details?: string } }
        throw new ApiError(
          res.status,
          envelope.message ?? (res.statusText || 'Request failed'),
          envelope.error?.details,
          { body: parsed, durationMs, sizeBytes },
        )
      }

      return {
        status: res.status,
        statusText: res.statusText || 'OK',
        durationMs,
        sizeBytes,
        data: parsed as T,
      }
    } catch (error) {
      if (error instanceof ApiError) throw error
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw config.signal?.aborted
          ? new DOMException('Aborted', 'AbortError')
          : new NetworkError('The request timed out.')
      }
      throw new NetworkError()
    } finally {
      clearTimeout(timeout)
      config.signal?.removeEventListener('abort', externalAbort)
    }
  }
}
