import { TLink } from '@/components/motion/PageTransition'
import { ArrowUpRight } from 'lucide-react'
import { CategoryIcon } from '@/components/categories/CategoryIcon'
import { EndpointBadge } from './EndpointBadge'
import type { ApiEndpoint } from '@/services/api/api.types'
import { cn } from '@/utils/cn'

export function ApiCard({ endpoint }: { endpoint: ApiEndpoint }) {
  return (
    <TLink
      to={`/apis/${endpoint.category}/${endpoint.id}`}
      className={cn(
        'group flex flex-col gap-3 rounded-[14px] border border-line bg-paper-raised p-5',
        'transition-[transform,box-shadow,border-color] duration-200',
        'hover:-translate-y-0.5 hover:border-[#c9c4b7] hover:shadow-card',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt',
        'active:translate-y-0 active:shadow-none',
      )}
    >
      <div className="flex items-center gap-3">
        <CategoryIcon slug={endpoint.category} label={endpoint.category} className="h-9 w-9" />
        <span className="min-w-0 flex-1 font-body text-[15px] font-bold leading-snug text-ink group-hover:text-cobalt">
          {endpoint.title}
        </span>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-ink-soft transition-colors group-hover:border-cobalt group-hover:bg-cobalt group-hover:text-white">
          <ArrowUpRight size={14} />
        </span>
      </div>

      <p className="font-body text-[13.5px] leading-[1.5] text-ink-soft">{endpoint.summary}</p>

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
        <EndpointBadge method={endpoint.method} />
        <code className="min-w-0 flex-1 truncate rounded-md border border-line-muted bg-paper px-2 py-1 font-mono text-xs text-ink">
          {endpoint.path}
        </code>
        <span className="rounded-md border border-success/30 bg-success/10 px-2 py-1 font-body text-[11px] font-semibold text-[#15854a]">
          FREE · NO KEY
        </span>
      </div>
    </TLink>
  )
}
