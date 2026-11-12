let covered =
  typeof document !== 'undefined' && document.documentElement.classList.contains('is-intro')
const waiters = new Set<() => void>()

export function setCovered(value: boolean): void {
  covered = value
  if (!value) {
    const callbacks = [...waiters]
    waiters.clear()
    callbacks.forEach((callback) => callback())
  }
}

export function onPageReady(callback: () => void): () => void {
  if (!covered) {
    callback()
    return () => {}
  }
  waiters.add(callback)
  return () => {
    waiters.delete(callback)
  }
}
