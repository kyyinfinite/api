import { HeroSection } from '@/components/hero/HeroSection'
import { CategorySection } from '@/components/categories/CategorySection'
import { BenefitsStrip } from '@/components/benefits/BenefitsStrip'

export function HomePage() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <BenefitsStrip />
    </>
  )
}
