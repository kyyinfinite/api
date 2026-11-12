import { createElement, useEffect, useRef } from 'react'
import type { ElementType, ReactNode } from 'react'
import { gsap, MQ, DUR } from '@/animations/gsap.setup'
import { onPageReady } from '@/animations/pageState'

export interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  distance?: number
  as?: ElementType
}

export function Reveal({ children, className = '', delay = 0, distance = 34, as = 'div' }: RevealProps) {
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return undefined
    const mm = gsap.matchMedia()
    mm.add({ motion: MQ.motion, reduce: MQ.reduced }, (context) => {
      const conditions = context.conditions as { reduce?: boolean }
      if (conditions.reduce) return undefined
      gsap.set(element, { y: distance, autoAlpha: 0 })
      return onPageReady(() => {
        context.add(() => {
          gsap.to(element, {
            y: 0,
            autoAlpha: 1,
            duration: DUR.enter + 0.15,
            delay,
            ease: 'power4.out',
            clearProps: 'transform,opacity,visibility',
            scrollTrigger: { trigger: element, start: 'top 88%', once: true },
          })
        })
      })
    })
    return () => mm.revert()
  }, [delay, distance])

  return createElement(as, { ref: elementRef, className }, children)
}
