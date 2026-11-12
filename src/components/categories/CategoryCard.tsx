import { TLink } from '@/components/motion/PageTransition'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { ApiCategory } from '@/services/api/api.types'
import { CategoryIcon } from './CategoryIcon'

export function CategoryCard({ category }: { category: ApiCategory }) {
  return (
    <TLink
      to={`/apis?category=${category.id}`}
      className={cn(
        'group relative flex h-full min-h-[84px] items-center gap-3.5 rounded-[14px] border border-line bg-paper-raised/70 px-[18px] py-4',
        'transition-[transform,box-shadow,border-color] duration-200',
        'hover:-translate-y-1 hover:border-[#c9c4b7] hover:shadow-card',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt',
        'active:translate-y-0 active:shadow-none',
      )}
      aria-label={`${category.name}: ${category.description}`}
    >
      <span className="block shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:rotate-[-3deg]">
        <CategoryIcon slug={category.slug} label={category.name} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-baseline gap-1.5">
          <span className="font-mono text-[12px] font-semibold text-ink-soft">{category.index}.</span>
          <span className="truncate font-body text-[15px] font-bold text-ink">{category.name}</span>
        </span>
        <span className="mt-0.5 block font-body text-[12.5px] leading-[1.4] text-ink-soft">
          {category.description}
        </span>
      </span>

      <span
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line bg-paper-soft',
          'text-ink transition-[transform,color,border-color,background-color] duration-200',
          'group-hover:translate-x-1 group-hover:border-cobalt group-hover:bg-cobalt group-hover:text-white',
        )}
        aria-hidden="true"
      >
        <ChevronRight size={15} strokeWidth={2.4} />
      </span>
    </TLink>
  )
}
