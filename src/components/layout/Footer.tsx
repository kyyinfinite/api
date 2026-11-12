import { useEffect, useRef } from 'react'
import { TLink } from '@/components/motion/PageTransition'
import { ArrowUpRight } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { SatelliteArtwork } from './SatelliteArtwork'
import { gsap, ScrollTrigger, MQ } from '@/animations/gsap.setup'
import { onPageReady } from '@/animations/pageState'
import { site } from '@/config/site'

export function Footer() {
  const scopeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const scope = scopeRef.current
    if (!scope) return undefined
    const mm = gsap.matchMedia()

    mm.add({ motion: MQ.motion, reduce: MQ.reduced }, (context) => {
      const conditions = context.conditions as { reduce?: boolean }
      if (conditions.reduce) return undefined

      const items = gsap.utils.toArray<HTMLElement>('[data-footer-reveal]', scope)
      const satellite = scope.querySelector<HTMLElement>('[data-satellite]')
      const art = satellite?.querySelector<SVGSVGElement>('svg') ?? null
      const orbit = satellite?.querySelector<SVGGElement>('[data-sat-orbit]') ?? null
      const stars = satellite?.querySelector<SVGGElement>('[data-sat-stars]') ?? null

      gsap.set(items, { y: 24, autoAlpha: 0 })
      if (satellite) gsap.set(satellite, { y: 18, autoAlpha: 0, scale: 0.98 })

      const ambient: gsap.core.Tween[] = []
      if (art) {
        ambient.push(
          gsap.to(art, {
            y: -7,
            duration: 3.2,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            paused: true,
          }),
        )
      }
      if (orbit) {
        ambient.push(
          gsap.to(orbit, {
            rotation: 360,
            svgOrigin: '360 280',
            duration: 90,
            ease: 'none',
            repeat: -1,
            paused: true,
          }),
        )
      }
      if (stars) {
        ambient.push(
          gsap.to(stars, {
            opacity: 0.45,
            duration: 2.4,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            paused: true,
          }),
        )
      }

      const monitor = ScrollTrigger.create({
        trigger: scope,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          ambient.forEach((tween) => (self.isActive ? tween.play() : tween.pause()))
        },
      })

      const cancelWait = onPageReady(() => {
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: { trigger: scope, start: 'top 88%', once: true },
        })

        tl.to(items, {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          clearProps: 'transform,opacity,visibility',
        })

        if (satellite) {
          tl.to(
            satellite,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.9,
              ease: 'power2.out',
              clearProps: 'transform,opacity,visibility',
            },
            0.15,
          )
        }
      })

      return () => {
        cancelWait()
        monitor.kill()
        ambient.forEach((tween) => tween.kill())
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <footer ref={scopeRef} className="site-footer relative overflow-hidden bg-navy text-white">
      <div className="footer-grid pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="shell relative z-[1]">
        <div className="footer-cta">
          <div className="footer-copy">
            <p data-footer-reveal className="footer-eyebrow">
              THE <span>KYYINFINITE ECOSYSTEM</span>
            </p>
            <h2 data-footer-reveal className="footer-heading">
              Build something
              <span>extraordinary.</span>
            </h2>
            <p data-footer-reveal className="footer-description">
              Free tools. Open possibilities. Built for creators.
            </p>
          </div>

          <div data-footer-reveal className="footer-action">
            <TLink to="/apis" className="btn-primary footer-button">
              Start building <ArrowUpRight size={17} />
            </TLink>
          </div>

          <div data-satellite className="footer-art" aria-hidden="true">
            <SatelliteArtwork className="h-full w-full" />
          </div>
        </div>
      </div>

      <div className="footer-bottom relative z-[1]">
        <div className="shell footer-bottom-inner">
          <TLink to="/" aria-label="Kyyinfinite home" className="footer-brand">
            <Logo dark />
          </TLink>

          <nav className="footer-nav" aria-label="Footer">
            <TLink to="/apis">APIs</TLink>
            <span>·</span>
            <TLink to="/docs">Documentation</TLink>
            <span>·</span>
            <TLink to="/status">Status</TLink>
          </nav>

          <p className="footer-copyright">{site.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
