import { TLink } from '@/components/motion/PageTransition'
import { PageContainer } from '@/components/layout/PageContainer'

export default function NotFoundPage() {
  return (
    <PageContainer className="flex min-h-[52vh] flex-col items-start justify-center">
      <p data-enter className="font-mono text-sm font-semibold text-cobalt">404</p>
      <h1 data-enter className="mt-3 font-display text-[44px] font-bold leading-[1.05] text-ink">
        This orbit is empty.
      </h1>
      <p data-enter className="mt-4 max-w-[440px] font-body text-[16px] leading-[1.6] text-ink-soft">
        The page you are looking for does not exist in the Kyyinfinite ecosystem.
      </p>
      <TLink to="/" className="btn-primary mt-8">
        Back to home
      </TLink>
    </PageContainer>
  )
}
