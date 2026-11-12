import { cn } from '@/utils/cn'

export function PageContainer({
  children,
  className,
  id,
}: {
  children: React.ReactNode
  className?: string
  id?: string
}) {
  return (
    <div id={id} className={cn('shell py-14 md:py-20', className)}>
      {children}
    </div>
  )
}
