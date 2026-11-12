import { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import { Search } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: 'search'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, icon, ...props },
  ref,
) {
  return (
    <div
      className={cn(
        'flex h-11 items-center gap-2.5 rounded-[10px] border border-line bg-paper-raised px-3.5',
        'focus-within:border-cobalt focus-within:ring-2 focus-within:ring-cobalt/20',
        className,
      )}
    >
      {icon === 'search' && <Search size={16} className="shrink-0 text-ink-soft" strokeWidth={2} />}
      <input
        ref={ref}
        className="h-full w-full bg-transparent font-body text-sm text-ink placeholder:text-ink-soft focus:outline-none"
        {...props}
      />
    </div>
  )
})
