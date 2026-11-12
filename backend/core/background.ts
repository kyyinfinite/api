import { waitUntil } from '@vercel/functions'

export function background(task: Promise<unknown>): void {
  try {
    waitUntil(task)
  } catch {
    void task
  }
}
