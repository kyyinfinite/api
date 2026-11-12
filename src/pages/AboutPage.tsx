import { TLink } from '@/components/motion/PageTransition'
import { ArrowUpRight, Globe2, Code2, HeartHandshake, Rocket } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { KOrbitArtwork } from '@/components/hero/KOrbitArtwork'
import { site } from '@/config/site'

const values = [
  {
    icon: Globe2,
    title: 'Independent by design',
    text: 'Kyyinfinite is an independent, developer-first project. No paywalls around documented endpoints, no upsells hidden in the response body.',
  },
  {
    icon: Code2,
    title: 'Developer experience first',
    text: 'Consistent envelopes, predictable error codes, and a playground for every endpoint. If it is not documented and testable, it does not ship.',
  },
  {
    icon: HeartHandshake,
    title: 'Free, for real',
    text: 'Every API in the library is free to call within fair rate limits. The platform exists so builders can experiment without a billing page.',
  },
  {
    icon: Rocket,
    title: 'Built to grow',
    text: 'The frontend already speaks to an adapter-based API client. When the live backend lands, integrations keep working without a rewrite.',
  },
]

export default function AboutPage() {
  return (
    <PageContainer className="py-10 md:py-14">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p data-enter className="eyebrow">ABOUT KYYINFINITE</p>
          <h1 data-enter className="mt-4 font-display text-[38px] font-bold leading-[1.06] text-ink md:text-[52px]">
            A free API ecosystem,
            <br />
            built for builders.
          </h1>
          <p data-enter className="mt-6 max-w-xl font-body text-[16px] leading-[1.7] text-ink-soft">
            Kyyinfinite started with a simple idea: learning, building, and experimenting should feel easy. The APIs you need should work without sign-up walls, confusing quotas, or surprise bills. That is the promise behind {site.tagline}
          </p>
          <p data-enter className="mt-4 max-w-xl font-body text-[16px] leading-[1.7] text-ink-soft">
            Today, Kyyinfinite brings together six categories of useful tools, from AI text utilities to lookup services. They all follow the same response format, making integration easier. The platform is designed to grow as new services and capabilities are added.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <TLink to="/apis" className="btn-primary h-12 px-6 text-sm">
              Browse the library <ArrowUpRight size={15} />
            </TLink>
            <TLink to="/docs" className="btn-outline-paper h-12 px-6 text-sm">
              Read the docs
            </TLink>
          </div>
        </div>

        <div className="hidden justify-center lg:flex" aria-hidden="true">
          <KOrbitArtwork className="h-[400px] w-[560px]" />
        </div>
      </div>

      <div className="mt-16 grid gap-4 sm:grid-cols-2">
        {values.map((value) => (
          <div key={value.title} className="rounded-2xl border border-line bg-paper-raised p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-paper text-cobalt">
              <value.icon size={21} strokeWidth={2} />
            </span>
            <h2 className="mt-4 font-display text-lg font-bold text-ink">{value.title}</h2>
            <p className="mt-2 font-body text-sm leading-relaxed text-ink-soft">{value.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-paper-raised p-6 text-center">
          <p className="font-display text-3xl font-bold text-cobalt">13</p>
          <p className="mt-1 font-body text-sm text-ink-soft">API categories</p>
        </div>
        <div className="rounded-2xl border border-line bg-paper-raised p-6 text-center">
          <p className="font-display text-3xl font-bold text-cobalt">83</p>
          <p className="mt-1 font-body text-sm text-ink-soft">documented endpoints</p>
        </div>
        <div className="rounded-2xl border border-line bg-paper-raised p-6 text-center">
          <p className="font-display text-3xl font-bold text-cobalt">100%</p>
          <p className="mt-1 font-body text-sm text-ink-soft">free to call, always</p>
        </div>
      </div>
    </PageContainer>
  )
}
