import { getConfig } from '../config/env'
import { ServiceUnavailableError } from '../core/errors'
import { NexrayAdapter } from './nexray/adapter'
import type { ProviderAdapter } from './types'
import { GenericHttpAdapter } from './generic/adapter'

export type AdapterFactory = () => ProviderAdapter

const factories: Record<string, AdapterFactory> = {
  'nexray-http': () => new NexrayAdapter(),
  'generic-http': () => new GenericHttpAdapter(),
}

const instances = new Map<string, ProviderAdapter>()

export function getProviderAdapter(adapterType: string): ProviderAdapter {
  const instance = instances.get(adapterType)
  if (instance) return instance
  const factory = factories[adapterType]
  if (!factory) {
    throw new ServiceUnavailableError('The requested service is not available.')
  }
  const created = factory()
  instances.set(adapterType, created)
  return created
}

export function listAdapterTypes(): string[] {
  return Object.keys(factories)
}

export function resetProviderAdaptersForTests(): void {
  instances.clear()
}

export function registerAdapterForTests(adapterType: string, factory: AdapterFactory): void {
  factories[adapterType] = factory
}

export function resolveProviderSpec(options: {
  internalName: string
  baseUrl: string
  configuration: Record<string, unknown>
  providerPath: string
  mappingConfiguration: Record<string, unknown>
  query: Record<string, string>
}): Parameters<ProviderAdapter['fetchJson']>[0] {
  const config = getConfig()
  let baseUrl = options.baseUrl
  let secret: string | undefined
  if (options.internalName === 'nexray') {
    baseUrl = config.providerNexrayBaseUrl
    if (config.providerNexraySecret) {
      secret = config.providerNexraySecret
    }
  }
  return {
    baseUrl,
    providerPath: options.providerPath,
    query: options.query,
    configuration: options.configuration,
    secret,
    fileUrl: undefined,
  }
}
