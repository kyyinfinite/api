import { KOrbitArtwork } from './KOrbitArtwork'

export function HeroArtwork({ artRef }: { artRef: React.Ref<HTMLDivElement> }) {
  return (
    <div className="relative mx-auto aspect-[288/350] w-full">
      <div
        ref={artRef as React.RefObject<HTMLDivElement>}
        data-parallax="6"
        className="absolute inset-0"
      >
        <KOrbitArtwork className="h-full w-full overflow-visible" />
      </div>
    </div>
  )
}
