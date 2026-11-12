import { z } from 'zod'

const envSchema = z.object({
  SUPABASE_URL: z.string().trim().optional().default(''),
  SUPABASE_SERVICE_ROLE_KEY: z.string().trim().optional().default(''),
  SUPABASE_ANON_KEY: z.string().trim().optional().default(''),
  VITE_SUPABASE_ANON_KEY: z.string().trim().optional().default(''),
  ADMIN_EMAILS: z.string().trim().optional().default(''),
  ADMIN_CONFIGURATION_SECRET: z.string().trim().optional().default(''),
  PROVIDER_NEXRAY_BASE_URL: z.string().trim().optional().default('https://api.nexray.eu.cc'),
  PROVIDER_NEXRAY_SECRET: z.string().trim().optional().default(''),
  JAGOMOTION_API_KEY: z.string().trim().optional().default(''),
  UPSTASH_REDIS_REST_URL: z.string().trim().optional().default(''),
  UPSTASH_REDIS_REST_TOKEN: z.string().trim().optional().default(''),
  DOWNLOAD_MAX_BYTES: z.coerce.number().int().positive().optional(),
  RATE_LIMIT_GLOBAL_MAX: z.coerce.number().int().positive().optional(),
  RATE_LIMIT_WINDOW_SECONDS: z.coerce.number().int().positive().optional(),
  CRON_SECRET: z.string().trim().optional().default(''),
  CATALOG_STRICT: z
    .enum(['true', 'false'])
    .optional()
    .default('false'),
  NODE_ENV: z.enum(['development', 'test', 'production']).optional().default('development'),
})

export interface AppConfig {
  supabaseUrl: string
  supabaseServiceRoleKey: string
  supabaseAnonKey: string
  adminEmails: string[]
  adminConfigurationSecret: string
  providerNexrayBaseUrl: string
  providerNexraySecret: string
  jagomotionApiKey: string
  upstashRestUrl: string
  upstashRestToken: string
  downloadMaxBytes: number
  rateLimitGlobalMax: number
  rateLimitWindowSeconds: number
  cronSecret: string
  catalogStrict: boolean
  isTest: boolean
  apiVersion: 'v1'
}

function loadConfig(): AppConfig {
  const parsed = envSchema.safeParse(process.env)
  if (!parsed.success) {
    throw new Error(`Invalid environment configuration: ${parsed.error.message}`)
  }
  const env = parsed.data
  return {
    supabaseUrl: env.SUPABASE_URL,
    supabaseServiceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
    supabaseAnonKey: env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY,
    adminEmails: env.ADMIN_EMAILS.split(',')
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean),
    adminConfigurationSecret: env.ADMIN_CONFIGURATION_SECRET,
    providerNexrayBaseUrl: env.PROVIDER_NEXRAY_BASE_URL.replace(/\/+$/, ''),
    providerNexraySecret: env.PROVIDER_NEXRAY_SECRET,
    jagomotionApiKey: env.JAGOMOTION_API_KEY,
    upstashRestUrl: env.UPSTASH_REDIS_REST_URL.replace(/\/+$/, ''),
    upstashRestToken: env.UPSTASH_REDIS_REST_TOKEN,
    downloadMaxBytes: env.DOWNLOAD_MAX_BYTES ?? 26_214_400,
    rateLimitGlobalMax: env.RATE_LIMIT_GLOBAL_MAX ?? 120,
    rateLimitWindowSeconds: env.RATE_LIMIT_WINDOW_SECONDS ?? 60,
    cronSecret: env.CRON_SECRET,
    catalogStrict: env.CATALOG_STRICT === 'true',
    isTest: env.NODE_ENV === 'test',
    apiVersion: 'v1',
  }
}

let cachedConfig: AppConfig | null = null

export function getConfig(): AppConfig {
  if (!cachedConfig) {
    cachedConfig = loadConfig()
  }
  return cachedConfig
}

export function resetConfigForTests(): void {
  cachedConfig = null
}

export function isSupabaseConfigured(config: AppConfig): boolean {
  return config.supabaseUrl.length > 0 && config.supabaseServiceRoleKey.length > 0
}
