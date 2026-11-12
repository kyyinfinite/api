import { gsap, MQ } from './gsap.setup'

export function initScrollScenes(root: HTMLElement): gsap.MatchMedia | undefined {
  if (window.matchMedia(MQ.reduced).matches) return undefined

  const mm = gsap.matchMedia()
  mm.add(
    { motion: MQ.motion, mobile: MQ.mobile },
    (context) => {
      const conditions = context.conditions as { motion?: boolean; mobile?: boolean }
      if (conditions.motion === false) return
      const mobile = conditions.mobile === true

      gsap.utils.toArray<HTMLElement>('[data-parallax]', root).forEach((element) => {
        const strength = Number(element.dataset.parallax) || (mobile ? 4 : 7)
        gsap.fromTo(
          element,
          { yPercent: -strength },
          {
            yPercent: strength,
            ease: 'none',
            scrollTrigger: {
              trigger: element,
              start: 'top bottom',
              end: 'bottom top',
              scrub: mobile ? 0.3 : 0.55,
              invalidateOnRefresh: true,
            },
          },
        )
      })
    },
    root,
  )
  return mm
}
