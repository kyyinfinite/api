import { MemoryRateLimiter } from '../backend/core/rate-limit'
import { createApp } from '../backend/app'
import { resetDatabaseForTests, getRepositories } from '../backend/database/client'
import { resetConfigForTests, getConfig, type AppConfig } from '../backend/config/env'
import { MemoryAdminAuthenticator } from '../backend/admin/auth'
import { registerAdapterForTests, resetProviderAdaptersForTests } from '../backend/providers/registry'
import { NexrayAdapter } from '../backend/providers/nexray/adapter'
import { GenericHttpAdapter } from '../backend/providers/generic/adapter'
import type { Repositories } from '../backend/database/repositories/types'

export const NEXRAY_SAMPLE = {
  status: true,
  author: '@nexray - ElrayyXml',
  result: {
    title: 'Laufey: Tiny Desk Concert',
    description: 'Ashley Pointer | December 13, 2023',
    channel: 'NPR Music',
    channel_url: 'https://youtube.com/@nprmusic',
    type: 'video',
    id: 'avjI3_GIZBw',
    duration: '19:07',
    seconds: 1147,
    views: '10.6M',
    upload_at: '2y ago',
    thumbnail: 'https://i.ytimg.com/vi/avjI3_GIZBw/hq720.jpg',
    url: 'https://youtube.com/watch?v=avjI3_GIZBw',
    download_url: 'https://beta.123tokyo.xyz/get.php/e/67/avjI3_GIZBw.mp3?h=abc',
  },
  timestamp: '2026-11-11T13:26:55.456Z',
  response_time: '2703ms',
}

export interface FakeFetchCall {
  url: string
  init: RequestInit | undefined
}

export function fakeProviderFetch(
  handler: (url: string, init: RequestInit | undefined) => Response | Promise<Response>,
): { fetchImpl: typeof fetch; calls: FakeFetchCall[] } {
  const calls: FakeFetchCall[] = []
  const fetchImpl: typeof fetch = async (input, init) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
    calls.push({ url, init })
    return handler(url, init)
  }
  return { fetchImpl, calls }
}

export type JsonBody = Record<string, any>

export async function readJson(response: Response): Promise<JsonBody> {
  return (await response.json()) as JsonBody
}

export function jsonResponse(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  })
}

export function nexrayJsonResponse(payload: unknown): Response {
  return jsonResponse(payload)
}

export function fileResponse(bytes: Uint8Array, contentType = 'audio/mpeg'): Response {
  return new Response(bytes, {
    status: 200,
    headers: { 'Content-Type': contentType, 'Content-Length': String(bytes.byteLength) },
  })
}

export interface TestApp {
  app: ReturnType<typeof createApp>
  repos: Repositories
  config: AppConfig
  adminToken: string
}

export function createTestApp(options?: {
  configOverrides?: Partial<AppConfig>
  fetchImpl?: typeof fetch
}): TestApp {
  resetDatabaseForTests()
  resetProviderAdaptersForTests()
  resetConfigForTests()
  const base = getConfig()
  const config: AppConfig = { ...base, ...options?.configOverrides }
  if (options?.fetchImpl) {
    registerAdapterForTests('nexray-http', () => new NexrayAdapter({ fetchImpl: options.fetchImpl }))
    registerAdapterForTests('generic-http', () => new GenericHttpAdapter({ fetchImpl: options.fetchImpl }))
  }
  const repos = getRepositories()
  const adminToken = 'test-admin-token'
  const app = createApp({
    repos,
    limiter: new MemoryRateLimiter(),
    config,
    authenticator: new MemoryAdminAuthenticator(new Map([[adminToken, { email: 'admin@kyyinfinite.test' }]])),
  })
  return { app, repos, config, adminToken }
}
