import { cn } from '@/utils/cn'
import type { HttpMethod } from '@/services/api/api.types'

const methodStyles: Record<HttpMethod, string> = {
  GET: 'bg-cobalt text-white',
  POST: 'bg-success text-white',
  PUT: 'bg-signal text-white',
  PATCH: 'bg-signal text-white',
  DELETE: 'bg-navy text-white',
}

export function EndpointBadge({ method, className }: { method: HttpMethod; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-6 shrink-0 items-center rounded-md px-2.5 font-mono text-[11px] font-bold tracking-wide',
        methodStyles[method],
        className,
      )}
    >
      {method}
    </span>
  )
}
