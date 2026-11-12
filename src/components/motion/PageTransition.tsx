import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import type { MouseEventHandler, ReactNode } from 'react'
import { Link, NavLink, useHref, useLocation, useNavigate } from 'react-router-dom'
import type { LinkProps, NavLinkProps } from 'react-router-dom'
import {
  gsap,
  ScrollTrigger,
  DUR,
  EASE,
  SHAPE,
  needsPanelFallback,
  prefersReducedMotion,
} from '@/animations/gsap.setup'
import { setCovered } from '@/animations/pageState'

const INTRO_KEY = 'ky-intro-seen'
const LOAD_TIMEOUT = 1800

const LABELS: Record<string, string> = {
  '/': 'Home',
  '/apis': 'Explorer',
  '/docs': 'Docs',
  '/playground': 'Playground',
  '/status': 'Status',
  '/about': 'About',
}

const labelFor = (path: string): string => {
  if (LABELS[path]) return LABELS[path]
  const segments = path.split('/').filter(Boolean)
  return segments.length >= 2 && path.startsWith('/apis/') ? segments[segments.length - 1] : 'Unknown'
}

type Phase = 'idle' | 'cover' | 'reveal'
type Stop = keyof typeof SHAPE

const YP: Record<Stop, number> = { below: 100, covered: 0, above: -100 }

export interface RoutePreloader {
  test: RegExp
  load: () => Promise<unknown>
}

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms)
  })

function preloadFor(list: RoutePreloader[] | undefined, path: string): Promise<unknown> {
  const match = list?.find((item) => item.test.test(path))
  return match ? match.load().catch(() => undefined) : Promise.resolve()
}

function placeCurtain(tl: gsap.core.Timeline, curtain: HTMLElement, panel: boolean, at: Stop) {
  tl.set(
    curtain,
    panel
      ? { yPercent: YP[at], autoAlpha: 1, pointerEvents: 'auto' }
      : { clipPath: SHAPE[at], autoAlpha: 1, pointerEvents: 'auto' },
  )
}

function moveCurtain(
  tl: gsap.core.Timeline,
  curtain: HTMLElement,
  panel: boolean,
  to: Stop,
  position: number | string,
) {
  const duration = to === 'covered' ? DUR.cover : DUR.reveal
  tl.to(
    curtain,
    panel
      ? { yPercent: YP[to], duration, ease: EASE.cover }
      : { clipPath: SHAPE[to], duration, ease: EASE.cover },
    position,
  )
}

const TransitionContext = createContext<{ go: (to: string) => void }>({ go: () => {} })

export function useTransitionNavigate(): (to: string) => void {
  return useContext(TransitionContext).go
}

export interface PageTransitionProps {
  children: ReactNode
  preload?: RoutePreloader[]
}

export function PageTransition({ children, preload }: PageTransitionProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const navigateRef = useRef(navigate)
  navigateRef.current = navigate
  const [panel] = useState(needsPanelFallback)

  const curtainRef = useRef<HTMLDivElement>(null)
  const wordRef = useRef<HTMLSpanElement>(null)
  const phase = useRef<Phase>('idle')
  const target = useRef<string | null>(null)
  const queued = useRef<string | null>(null)
  const pendingLoads = useRef<Promise<unknown>[]>([])
  const timeline = useRef<gsap.core.Timeline | null>(null)
  const watchdog = useRef<gsap.core.Tween | null>(null)
  const popNavigation = useRef(false)
  const prevPath = useRef<string | null>(null)
  const introPending = useRef<boolean | null>(null)
  const preloadRef = useRef(preload)
  preloadRef.current = preload

  useEffect(() => {
    const onPop = () => {
      popNavigation.current = true
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    const warm = () => {
      preloadRef.current?.forEach((item) => {
        void item.load().catch(() => undefined)
      })
    }
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(warm)
      return () => window.cancelIdleCallback(id)
    }
    const id = window.setTimeout(warm, 1200)
    return () => window.clearTimeout(id)
  }, [])

  const resetCurtain = useCallback(() => {
    phase.current = 'idle'
    setCovered(false)
    if (curtainRef.current) {
      gsap.set(curtainRef.current, { autoAlpha: 0, pointerEvents: 'none' })
    }
    const main = document.querySelector('main')
    if (main) gsap.set(main, { clearProps: 'transform,opacity,visibility' })
  }, [])

  const go = useCallback(
    (to: string) => {
      let url: URL
      try {
        url = new URL(to, window.location.href)
      } catch {
        return
      }
      if (url.origin !== window.location.origin) {
        window.location.assign(url.href)
        return
      }
      const next = url.pathname + url.search + url.hash
      const samePage =
        url.pathname === window.location.pathname && url.search === window.location.search
      if (samePage) {
        if (url.hash) {
          navigateRef.current(next)
        } else {
          window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
        }
        return
      }
      if (prefersReducedMotion()) {
        navigateRef.current(next)
        return
      }
      if (phase.current === 'reveal') {
        queued.current = next
        return
      }

      const load = preloadFor(preloadRef.current, url.pathname)
      target.current = next
      if (wordRef.current) wordRef.current.textContent = labelFor(url.pathname)
      if (phase.current === 'cover') {
        pendingLoads.current.push(load)
        return
      }

      const curtain = curtainRef.current
      if (!curtain) {
        navigateRef.current(next)
        return
      }

      pendingLoads.current = [load]
      phase.current = 'cover'
      setCovered(true)

      const word = wordRef.current
      const main = document.querySelector('main')

      timeline.current?.kill()
      const tl = gsap.timeline({
        onComplete: () => {
          void Promise.race([Promise.all(pendingLoads.current), wait(LOAD_TIMEOUT)]).then(() => {
            navigateRef.current(target.current ?? next)
            watchdog.current?.kill()
            watchdog.current = gsap.delayedCall(2, () => {
              if (phase.current === 'cover') resetCurtain()
            })
          })
        },
      })

      placeCurtain(tl, curtain, panel, 'below')
      if (main) {
        tl.to(main, { autoAlpha: 0.4, y: -64, duration: DUR.cover, ease: EASE.cover }, 0)
      }
      moveCurtain(tl, curtain, panel, 'covered', 0)
      if (word) {
        tl.fromTo(
          word,
          { y: 16, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.35, ease: EASE.out },
          '-=0.3',
        )
      }
      timeline.current = tl
    },
    [resetCurtain, panel],
  )

  useEffect(() => {
    const previous = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    return () => {
      window.history.scrollRestoration = previous
      watchdog.current?.kill()
      timeline.current?.kill()
    }
  }, [])

  useLayoutEffect(() => {
    const curtain = curtainRef.current
    const word = wordRef.current
    const path = location.pathname
    const initial = prevPath.current === null
    if (!curtain || (!initial && prevPath.current === path)) return undefined

    const back = popNavigation.current
    popNavigation.current = false
    prevPath.current = path

    watchdog.current?.kill()
    timeline.current?.kill()
    const root = document.documentElement

    if (!initial) window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

    if (prefersReducedMotion()) {
      root.classList.remove('is-intro')
      resetCurtain()
      return undefined
    }

    const main = document.querySelector('main')
    const items = gsap.utils.toArray<HTMLElement>('main [data-enter]')
    if (main) gsap.set(main, { clearProps: 'transform,opacity,visibility' })
    if (items.length) gsap.set(items, { autoAlpha: 0, y: 32 })

    if (initial && introPending.current === null) {
      introPending.current = root.classList.contains('is-intro')
    }
    const intro = initial && introPending.current === true
    let finished = false

    const finish = () => {
      finished = true
      introPending.current = false
      watchdog.current?.kill()
      root.classList.remove('is-intro')
      phase.current = 'idle'
      gsap.set(curtain, { autoAlpha: 0, pointerEvents: 'none' })
      setCovered(false)
      ScrollTrigger.refresh()
      if (queued.current) {
        const next = queued.current
        queued.current = null
        go(next)
      }
    }

    const enterTail = (tl: gsap.core.Timeline) => {
      tl.call(
        () => {
          setCovered(false)
          ScrollTrigger.refresh()
        },
        undefined,
        '-=0.45',
      )
      if (items.length) {
        tl.to(
          items,
          {
            autoAlpha: 1,
            y: 0,
            duration: DUR.enter,
            stagger: DUR.stagger,
            ease: EASE.out,
            clearProps: 'transform,opacity,visibility',
          },
          '-=0.35',
        )
      }
    }

    let tl: gsap.core.Timeline
    if (initial && !intro) {
      phase.current = 'idle'
      root.classList.remove('is-intro')
      gsap.set(curtain, { autoAlpha: 0, pointerEvents: 'none' })
      setCovered(false)
      tl = gsap.timeline({
        onComplete: () => {
          finished = true
        },
      })
      if (items.length) {
        tl.to(items, {
          autoAlpha: 1,
          y: 0,
          duration: DUR.enter,
          stagger: DUR.stagger,
          ease: EASE.out,
          delay: 0.1,
          clearProps: 'transform,opacity,visibility',
        })
      }
    } else if (intro) {
      phase.current = 'reveal'
      setCovered(true)
      if (word) word.textContent = 'Hello'
      tl = gsap.timeline({
        onComplete: () => {
          try {
            sessionStorage.setItem(INTRO_KEY, '1')
          } catch {}
          finish()
        },
      })
      placeCurtain(tl, curtain, panel, 'covered')
      tl.call(() => root.classList.remove('is-intro'))
      if (word) {
        tl.fromTo(word, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: EASE.out })
        tl.to(word, { y: -10, autoAlpha: 0, duration: 0.25, delay: 0.35 })
      }
      moveCurtain(tl, curtain, panel, 'above', '>')
      enterTail(tl)
    } else {
      phase.current = 'reveal'
      setCovered(true)
      if (word) word.textContent = labelFor(path)
      tl = gsap.timeline({ onComplete: finish })
      placeCurtain(tl, curtain, panel, 'covered')
      if (word) {
        tl.set(word, { y: 0, autoAlpha: 1 })
        tl.to(word, { y: -10, autoAlpha: 0, duration: 0.25, delay: 0.1 })
      }
      moveCurtain(tl, curtain, panel, back ? 'below' : 'above', '<0.05')
      enterTail(tl)
    }
    timeline.current = tl

    if (intro) {
      watchdog.current = gsap.delayedCall(8, () => {
        if (finished) return
        tl.kill()
        if (items.length) gsap.set(items, { clearProps: 'transform,opacity,visibility' })
        finish()
      })
    }

    return () => {
      tl.kill()
      if (intro && !finished) prevPath.current = null
    }
  }, [location.pathname, go, resetCurtain, panel])

  return (
    <TransitionContext.Provider value={{ go }}>
      {children}
      <div
        ref={curtainRef}
        className={panel ? 'motion-curtain is-panel' : 'motion-curtain'}
        aria-hidden="true"
      >
        <span ref={wordRef} className="motion-curtain-word" />
        <i>© KYYINFINITE API</i>
      </div>
    </TransitionContext.Provider>
  )
}

type AnchorClickHandler = MouseEventHandler<HTMLAnchorElement>

function makeHandler(
  go: (to: string) => void,
  href: string,
  target: string | undefined,
  onClick?: AnchorClickHandler,
): AnchorClickHandler {
  return (event) => {
    onClick?.(event)
    if (event.defaultPrevented || event.button !== 0 || target === '_blank') return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    go(href)
  }
}

export const TLink = forwardRef<HTMLAnchorElement, LinkProps>(function TLink(
  { to, onClick, target, ...rest },
  ref,
) {
  const go = useTransitionNavigate()
  const href = useHref(to)
  return (
    <Link ref={ref} to={to} target={target} onClick={makeHandler(go, href, target, onClick)} {...rest} />
  )
})

export const TNavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function TNavLink(
  { to, onClick, target, ...rest },
  ref,
) {
  const go = useTransitionNavigate()
  const href = useHref(to)
  return (
    <NavLink ref={ref} to={to} target={target} onClick={makeHandler(go, href, target, onClick)} {...rest} />
  )
})
