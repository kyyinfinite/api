import { useEffect, useRef, useState } from 'react'
import { cn } from '@/utils/cn'

interface DropdownProps {
  trigger: (props: { open: boolean; toggle: () => void; ref: React.Ref<HTMLButtonElement> }) => React.ReactNode
  children: (props: { close: () => void }) => React.ReactNode
  align?: 'left' | 'right'
  className?: string
}

export function Dropdown({ trigger, children, align = 'left', className }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    const onPointerDown = (e: MouseEvent) => {
      if (
        !containerRef.current?.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      {trigger({ open, toggle: () => setOpen((v) => !v), ref: triggerRef })}
      <div
        role="menu"
        aria-hidden={!open}
        className={cn(
          'absolute top-[calc(100%+10px)] z-50 min-w-64 origin-top rounded-2xl border border-line bg-paper-raised p-2 shadow-dropdown',
          'transition-[opacity,transform] duration-200 ease-out',
          open ? 'pointer-events-auto scale-100 opacity-100' : 'pointer-events-none scale-[0.98] opacity-0',
          align === 'right' ? 'right-0' : 'left-0',
          className,
        )}
      >
        {open && children({ close: () => setOpen(false) })}
      </div>
    </div>
  )
}
