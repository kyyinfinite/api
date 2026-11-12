import { ArrowUpRight } from 'lucide-react'
import { useCatalogCategories } from '@/hooks/useCatalog'
import { CategoryCard } from './CategoryCard'
import { Reveal } from '@/components/motion/Reveal'
import { TLink } from '@/components/motion/PageTransition'

function CategorySkeleton() {
  return (
    <div className="h-full min-h-[168px] animate-pulse rounded-2xl border border-line bg-paper-raised" />
  )
}

export function CategorySection() {
  const { data: categories, isError } = useCatalogCategories()

  return (
    <section className="border-t border-line-muted">
      <div className="shell grid gap-8 py-10 md:py-12 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-[64px]">
        <Reveal className="lg:sticky lg:top-28 lg:self-start" distance={24}>
          <p className="eyebrow">API CATEGORIES</p>
          <h2 className="mt-3 font-display text-[32px] font-bold leading-[1.1] tracking-[-0.02em] text-ink md:text-[36px]">
            Explore Our
            <br />
            API Ecosystem
          </h2>
          <p className="mt-4 max-w-[240px] font-body text-[14.5px] leading-[1.55] text-ink">
            Discover a wide range of APIs, built to power your projects.
          </p>
          <TLink
            to="/apis"
            className="group mt-5 inline-flex items-center gap-2 border-b border-cobalt pb-0.5 font-body text-[14px] font-semibold text-cobalt transition-colors hover:text-ink"
          >
            View All APIs
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </TLink>
        </Reveal>

        <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
          {isError && !categories
            ? <p className="col-span-full font-body text-sm text-ink-soft">Categories are temporarily unavailable.</p>
            : !categories
            ? Array.from({ length: 6 }, (_, index) => <CategorySkeleton key={index} />)
            : categories.map((category, index) => (
                <Reveal key={category.id} delay={(index % 3) * 0.06}>
                  <CategoryCard category={category} />
                </Reveal>
              ))}
        </div>
      </div>
    </section>
  )
}
