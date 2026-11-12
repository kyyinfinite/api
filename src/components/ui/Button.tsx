import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

type ButtonVariant = 'primary' | 'outline' | 'navy' | 'ghost'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  href?: string
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-cobalt text-white shadow-tactile hover:bg-[#2c4cc4] active:shadow-[0_2px_0_0_#1749D8]',
  outline:
    'border-[1.5px] border-line bg-paper-raised text-ink shadow-tactileLine hover:border-[#c9c4b7] active:shadow-[0_2px_0_0_#D8D5CB]',
  navy: 'bg-navy text-white shadow-tactileNavy hover:bg-[#1a2334] active:shadow-[0_2px_0_0_#0A0F1C]',
  ghost: 'text-ink hover:bg-line-muted',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', className, href, children, ...props },
  ref,
) {
  const classes = cn(
    'relative inline-flex h-[58px] select-none items-center justify-center gap-2.5 rounded-xl px-7 font-body text-[16px] font-bold',
    'transition-[transform,box-shadow,background-color] duration-150',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt active:translate-y-[4px]',
    variantClasses[variant],
    className,
  )

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    )
  }

  return (
    <button ref={ref} className={classes} {...props}>
      {children}
    </button>
  )
})
