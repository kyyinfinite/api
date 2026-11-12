import { useEffect, useRef } from 'react'
import { ArrowUpRight, BookOpen } from 'lucide-react'
import { HeroArtwork } from './HeroArtwork'
import { LiveApiConsole } from './LiveApiConsole'
import { buildHeroTimeline, buildAmbientMotion } from '@/animations/hero.animation'
import { initScrollScenes } from '@/animations/scroll.animation'
import { gsap, MQ } from '@/animations/gsap.setup'
import { onPageReady } from '@/animations/pageState'
import { TLink } from '@/components/motion/PageTransition'
import { site } from '@/config/site'

export function HeroSection() {
  const scopeRef = useRef<HTMLElement>(null)
  const artRef = useRef<HTMLDivElement>(null)
  const consoleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = scopeRef.current
    if (!root) return undefined
    const mm = gsap.matchMedia()
    mm.add(
      { motion: MQ.motion, reduce: MQ.reduced },
      (context) => {
        const conditions = context.conditions as { motion?: boolean; reduce?: boolean }
        if (conditions.reduce) return undefined

        const cubes = gsap.utils.toArray<HTMLElement>('[data-k-cube]', root)
        const timeline = buildHeroTimeline({
          scope: root,
          artwork: artRef.current,
          cubes,
          console: consoleRef.current,
          animateNav: document.documentElement.classList.contains('is-intro'),
        })
        const cancelWait = onPageReady(() => timeline?.play())
        const ambient = buildAmbientMotion({ cubes, orbit: null })
        const scenes = initScrollScenes(root)

        return () => {
          cancelWait()
          timeline?.kill()
          ambient.forEach((tl) => tl.kill())
          scenes?.revert()
        }
      },
      root,
    )
    return () => mm.revert()
  }, [])

  return (
    <section ref={scopeRef} className="relative overflow-hidden">
      <div
        className="grid-paper pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(90deg,transparent_0%,#000_38%,#000_100%)]"
        aria-hidden="true"
      />

      <div className="shell relative">
        <div className="grid items-center gap-10 pb-12 pt-10 sm:pt-12 lg:grid-cols-[clamp(440px,46vw,720px)_minmax(0,1fr)] lg:gap-8 lg:pb-12 lg:pt-8">
          <div className="relative z-10 max-w-[560px] lg:max-w-none">
            <p data-enter className="eyebrow mb-4 flex items-center gap-2.5 text-[12px] md:mb-5 md:text-[13px]">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full bg-cobalt"
                aria-hidden="true"
              />
              A FREE API ECOSYSTEM FOR DEVELOPERS
            </p>

            <h1
              data-enter
              className="font-display text-[44px] font-bold leading-[1] tracking-[-0.03em] text-ink sm:text-[56px] md:text-[64px] lg:whitespace-nowrap lg:text-[clamp(40px,4.35vw,68px)]"
            >
              <span className="block">Free APIs.</span>
              <span className="block text-cobalt">Limitless Possibilities.</span>
            </h1>

            <p
              data-enter
              className="mt-5 max-w-[500px] font-body text-[16px] leading-[1.55] text-ink md:text-[17px]"
            >
              {site.description}
            </p>

            <div data-enter className="mt-7 flex flex-wrap items-center gap-4 md:gap-5">
              <TLink to="/apis" className="btn-primary">
                Explore APIs <ArrowUpRight size={17} />
              </TLink>
              <TLink to="/docs" className="btn-outline-paper">
                <BookOpen size={19} strokeWidth={2.2} />
                Read Documentation
              </TLink>
            </div>
          </div>

          <div className="relative flex min-w-0 flex-col items-center gap-5 min-[1180px]:flex-row min-[1180px]:gap-0">
            <div className="w-full max-w-[300px] min-[1180px]:max-w-none min-[1180px]:min-w-0 min-[1180px]:flex-1">
              <HeroArtwork artRef={artRef} />
            </div>
            <div
              ref={consoleRef}
              className="relative z-10 w-full max-w-[340px] min-[1180px]:-ml-3 min-[1180px]:w-[clamp(264px,22vw,316px)] min-[1180px]:max-w-none min-[1180px]:shrink-0"
            >
              <LiveApiConsole />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
