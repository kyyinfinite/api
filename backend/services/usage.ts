import type { Repositories, NewUsageLog } from '../database/repositories/types'
import { logInternalError } from '../core/errors'

export async function logUsageSafe(repos: Repositories, entry: NewUsageLog): Promise<void> {
  try {
    await repos.usageLogs.insert(entry)
  } catch (error) {
    logInternalError('usage', error)
  }
}
