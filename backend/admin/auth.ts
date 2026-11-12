import type { AppConfig } from '../config/env'
import type { Repositories } from '../database/repositories/types'
import { logInternalError } from '../core/errors'

export interface AdminUser {
  email: string
}

export interface AdminAuthenticator {
  verify(token: string): Promise<AdminUser | null>
}

async function resolveAllowlist(config: AppConfig, repos: Repositories): Promise<string[]> {
  if (config.adminEmails.length > 0) {
    return config.adminEmails
  }
  try {
    const stored = await repos.settings.get('admin_emails')
    if (Array.isArray(stored)) {
      return stored
        .filter((entry): entry is string => typeof entry === 'string')
        .map((entry) => entry.trim().toLowerCase())
        .filter(Boolean)
    }
  } catch (error) {
    logInternalError('admin-auth', error)
  }
  return []
}

export class SupabaseAdminAuthenticator implements AdminAuthenticator {
  constructor(
    private readonly config: AppConfig,
    private readonly repos: Repositories,
  ) {}

  async verify(token: string): Promise<AdminUser | null> {
    if (!this.config.supabaseUrl || !this.config.supabaseAnonKey) {
      return null
    }
    let email: string | null = null
    try {
      const response = await fetch(`${this.config.supabaseUrl}/auth/v1/user`, {
        headers: {
          apikey: this.config.supabaseAnonKey,
          Authorization: `Bearer ${token}`,
        },
        signal: AbortSignal.timeout(5000),
      })
      if (!response.ok) {
        return null
      }
      const user = (await response.json()) as { email?: string }
      email = user.email ?? null
    } catch (error) {
      logInternalError('admin-auth', error)
      return null
    }
    if (!email) {
      return null
    }
    const allowlist = await resolveAllowlist(this.config, this.repos)
    const normalized = email.toLowerCase()
    return allowlist.includes(normalized) ? { email: normalized } : null
  }
}

export class MemoryAdminAuthenticator implements AdminAuthenticator {
  constructor(private readonly tokens: Map<string, AdminUser>) {}

  async verify(token: string): Promise<AdminUser | null> {
    return this.tokens.get(token) ?? null
  }
}
