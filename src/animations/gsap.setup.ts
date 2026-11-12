import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({ ignoreMobileResize: true })

export const MQ = {
  reduced: '(prefers-reduced-motion: reduce)',
  motion: '(prefers-reduced-motion: no-preference)',
  finePointer: '(hover: hover) and (pointer: fine)',
  mobile: '(max-width: 760px)',
  desktop: '(min-width: 761px)',
}

export const EASE = { cover: 'power4.inOut', out: 'power3.out', in: 'power2.in' }
export const DUR = { cover: 0.85, reveal: 0.95, enter: 0.9, stagger: 0.07 }

export const SHAPE = {
  below: 'ellipse(150% 150% at 50% 250%)',
  covered: 'ellipse(150% 150% at 50% 100%)',
  above: 'ellipse(150% 150% at 50% -150%)',
} as const

export type CurtainShape = (typeof SHAPE)[keyof typeof SHAPE]

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia(MQ.reduced).matches

export const needsPanelFallback = (): boolean => {
  if (typeof window === 'undefined') return false
  const forced = new URLSearchParams(window.location.search).get('curtain')
  if (forced === 'panel') return true
  if (forced === 'clip') return false
  const cores = navigator.hardwareConcurrency ?? 8
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
  return cores <= 4 || memory <= 2
}

export { gsap, ScrollTrigger }
