import { useEffect, useRef } from 'react'
import { Infinity as InfinityIcon, Zap, ShieldCheck, Box } from 'lucide-react'
import { gsap, prefersReducedMotion } from '@/animations/gsap.setup'
import { cn } from '@/utils/cn'

const benefits = [
  { icon: InfinityIcon, title: '100% Free', sub: 'No hidden fees' },
  { icon: Zap, title: 'Fast & Reliable', sub: 'Low latency' },
  { icon: ShieldCheck, title: 'Built for Developers', sub: 'Clean & consistent response' },
  { icon: Box, title: 'Regular Updates', sub: 'New APIs frequently' },
]

export function BenefitsStrip() {
  const scopeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('[data-benefit]', scopeRef.current)
      if (!items.length) return
      gsap.fromTo(
        items,
        { y: 22, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            id: 'benefit',
            trigger: scopeRef.current,
            start: 'top 92%',
            once: true,
          },
        },
      )
    }, scopeRef)

    return () => ctx.revert()
  }, [])

  return (
    <section>
      <div className="shell pb-10 pt-1 md:pb-12">
        <div
          ref={scopeRef}
          className="grid grid-cols-2 rounded-2xl border border-line-muted bg-paper-raised/50 py-2 lg:grid-cols-4"
        >
          {benefits.map((benefit, i) => (
            <div
              key={benefit.title}
              data-benefit
              className={cn(
                'flex items-center gap-3.5 border-line-muted px-5 py-4 lg:justify-center',
                i % 2 === 1 && 'border-l',
                i > 1 && 'border-t lg:border-t-0',
                i > 0 ? 'lg:border-l' : 'lg:border-l-0',
              )}
            >
              <benefit.icon size={24} strokeWidth={2} className="shrink-0 text-cobalt" />
              <span className="min-w-0">
                <span className="block font-body text-[14px] font-bold text-ink">{benefit.title}</span>
                <span className="mt-0.5 block font-body text-[12.5px] text-ink-soft">{benefit.sub}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
