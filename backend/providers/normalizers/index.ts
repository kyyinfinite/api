import { UpstreamError } from '../../core/errors'
import {
  nexrayResultSchema,
  normalizeSeconds,
  type NexrayResult,
} from '../nexray/adapter'

export type Normalizer = (payload: unknown, query: Record<string, string>) => Record<string, unknown>

function extractResult(payload: unknown): NexrayResult {
  const parsed = nexrayResultSchema.safeParse(
    (payload as { result?: unknown } | null)?.result ?? payload,
  )
  if (!parsed.success) {
    throw new UpstreamError('provider result could not be interpreted')
  }
  return parsed.data
}

function requireMediaId(result: NexrayResult): string {
  if (!result.id || result.id.trim().length === 0) {
    throw new UpstreamError('no media matched the lookup')
  }
  return result.id
}

function sourceUrlOf(result: NexrayResult, mediaId: string): string {
  return result.url ?? `https://youtube.com/watch?v=${mediaId}`
}

function sanitizeFileName(title: string | null, mediaId: string, extension: string): string {
  const base = (title ?? `media-${mediaId}`)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
  return `${base || 'media'}.${extension}`
}

const legacyDefault: Normalizer = (payload) => {
  const source = payload as { result?: unknown; data?: unknown } | null
  const result = source && typeof source === 'object'
    ? source.result !== undefined ? source.result : source.data !== undefined ? source.data : payload
    : payload
  return { status: true, creator: 'Kyyinfinite', result }
}

const youtubeSearch: Normalizer = (payload, query) => {
  const result = extractResult(payload)
  const mediaId = requireMediaId(result)
  return {
    query: query.q ?? '',
    media: { id: mediaId, type: result.type ?? 'video' },
    title: result.title ?? null,
    description: result.description ?? null,
    channel: result.channel ?? null,
    channelUrl: result.channel_url ?? null,
    duration: result.duration ?? null,
    durationSeconds: normalizeSeconds(result.seconds),
    views: result.views ?? null,
    uploadedAt: result.upload_at ?? null,
    thumbnail: result.thumbnail ?? null,
    sourceUrl: sourceUrlOf(result, mediaId),
  }
}

const youtubeDownload: Normalizer = (payload, query) => {
  const result = extractResult(payload)
  const mediaId = requireMediaId(result)
  const mediaType = result.type ?? 'video'
  const extension = mediaType === 'audio' ? 'mp3' : 'mp4'
  return {
    query: query.q ?? '',
    media: {
      id: mediaId,
      type: mediaType,
      filename: sanitizeFileName(result.title ?? null, mediaId, extension),
    },
    title: result.title ?? null,
    channel: result.channel ?? null,
    duration: result.duration ?? null,
    durationSeconds: normalizeSeconds(result.seconds),
    thumbnail: result.thumbnail ?? null,
    sourceUrl: sourceUrlOf(result, mediaId),
    delivery: {
      method: 'proxy-stream',
      path: '/api/v1/youtube/download/relay',
      maxBytes: 0,
    },
  }
}

export const normalizers: Record<string, Normalizer> = {
  'legacy-default-v1': legacyDefault,
  'youtube-search-v1': youtubeSearch,
  'youtube-download-v1': youtubeDownload,
}

export function getNormalizer(id: string): Normalizer | null {
  return normalizers[id] ?? null
}
