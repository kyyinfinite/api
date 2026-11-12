import { gsap, MQ } from './gsap.setup'

export interface HeroAnimationTargets {
  scope: HTMLElement | null
  artwork: HTMLElement | null
  cubes: HTMLElement[]
  console: HTMLElement | null
  animateNav: boolean
}

export function buildHeroTimeline(t: HeroAnimationTargets): gsap.core.Timeline | null {
  if (!t.scope) return null

  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: 'power4.out' },
  })

  if (t.artwork) {
    tl.fromTo(
      t.artwork,
      { opacity: 0, scale: 0.94, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'power2.out', clearProps: 'opacity' },
      0,
    )
  }

  if (t.cubes.length) {
    tl.fromTo(
      t.cubes,
      { opacity: 0, y: -14 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, clearProps: 'opacity' },
      0.55,
    )
  }

  if (t.console) {
    tl.fromTo(
      t.console,
      { opacity: 0, x: 36 },
      { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', clearProps: 'opacity,transform' },
      0.5,
    )
  }

  if (t.animateNav) {
    const nav = document.querySelector('header')
    if (nav) {
      tl.fromTo(
        nav,
        { y: -24, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.5,
          ease: 'power3.out',
          clearProps: 'transform,opacity,visibility',
        },
        0,
      )
    }
  }

  return tl
}

export function buildAmbientMotion(t: {
  cubes: HTMLElement[]
  orbit: HTMLElement | null
}): gsap.core.Timeline[] {
  if (window.matchMedia(MQ.reduced).matches) return []

  const timelines: gsap.core.Timeline[] = []

  t.cubes.forEach((cube, i) => {
    const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } })
    tl.fromTo(cube, { y: 0 }, { y: i % 2 === 0 ? -12 : 10, duration: 2.4 + i * 0.5 })
    timelines.push(tl)
  })

  if (t.orbit) {
    const tl = gsap.timeline({ repeat: -1, defaults: { ease: 'none' } })
    tl.fromTo(t.orbit, { rotate: 0 }, { rotate: 360, duration: 120, transformOrigin: '50% 50%' })
    timelines.push(tl)
  }

  return timelines
}
