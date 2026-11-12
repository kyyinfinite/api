import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { getConfig, isSupabaseConfigured } from '../config/env'
import { createMemoryRepositories, resetMemoryStoreForTests } from './repositories/memory'
import { createSupabaseRepositories } from './repositories/supabase'
import type { Repositories } from './repositories/types'

let supabaseClient: SupabaseClient | null = null
let memoryRepositories: Repositories | null = null

export function getSupabaseAdmin(): SupabaseClient {
  const config = getConfig()
  if (!isSupabaseConfigured(config)) {
    throw new Error('Supabase is not configured.')
  }
  if (!supabaseClient) {
    supabaseClient = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  }
  return supabaseClient
}

export function getRepositories(): Repositories {
  const config = getConfig()
  if (isSupabaseConfigured(config)) {
    return createSupabaseRepositories(getSupabaseAdmin())
  }
  if (config.catalogStrict) {
    throw new Error('Supabase configuration is required in strict catalog mode.')
  }
  if (!memoryRepositories) {
    memoryRepositories = createMemoryRepositories()
  }
  return memoryRepositories
}

export function repositoriesMode(): 'supabase' | 'memory' {
  return getRepositories().mode
}

export function resetDatabaseForTests(): void {
  supabaseClient = null
  memoryRepositories = null
  resetMemoryStoreForTests()
}
