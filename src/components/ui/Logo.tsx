import { cn } from '@/utils/cn'

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn('h-10 w-10', className)} aria-hidden="true">
      <path d="M8 4h9v13l10-13h10L25 20l12 16H27L17 23v13H8V4z" fill="currentColor" />
      <path d="M17 4h9l-9 13v-8l6-5h-6V4z" fill="#3457D5" />
    </svg>
  )
}

export function Logo({ dark = false, className }: { dark?: boolean; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <LogoMark className={dark ? 'text-white' : 'text-ink'} />
      <span
        className={cn(
          'font-display text-[19px] font-bold tracking-[0.04em]',
          dark ? 'text-white' : 'text-ink',
        )}
      >
        KYYINFINITE<span className="text-cobalt-light">.</span>
      </span>
    </span>
  )
}
