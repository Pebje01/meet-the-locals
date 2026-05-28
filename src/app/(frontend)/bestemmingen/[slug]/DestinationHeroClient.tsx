import Image from 'next/image'
import Link from 'next/link'
import { DestinationHeroMapBackground } from './DestinationHeroMapBackground'
import { WorldMapBackground } from './WorldMapBackground'

type FactItem = { label: string; value: string }

type MapProps = {
  countryIds: string[]
  marker: [number, number]
  label: string
  scale: number
  center: [number, number]
}

type Crumb = { name: string; slug: string }

export function DestinationHeroClient({
  heroImageUrl,
  mapProps,
  breadcrumbs,
  name,
  eyebrow,
  intro,
  factItems,
}: {
  heroImageUrl: string
  mapProps: MapProps | null
  breadcrumbs: Crumb[]
  name: string
  eyebrow?: string | null
  intro?: string | null
  factItems: FactItem[]
}) {
  return (
    <section
      className="relative z-[2] min-h-[72vh] overflow-x-hidden bg-forest-dark px-6 pb-32 pt-32 text-cream md:pt-40 md:pb-40 lg:px-10"
      style={{ clipPath: 'url(#heroWaveClip)' }}
    >
      {/* Clip-path definitie: organische onderrand */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id="heroWaveClip" clipPathUnits="objectBoundingBox">
            <path d="M 0,0 L 1,0 L 1,0.95 C 0.88,0.95 0.82,0.98 0.72,0.97 C 0.62,0.965 0.54,0.94 0.44,0.95 C 0.34,0.96 0.27,0.98 0.17,0.97 C 0.07,0.965 0.03,0.945 0,0.95 L 0,0 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Hero achtergrondafbeelding — alleen tonen als er geen kaart is */}
      {heroImageUrl && !mapProps && (
        <Image
          src={heroImageUrl}
          alt=""
          fill
          priority
          className="object-cover opacity-20"
          sizes="100vw"
        />
      )}

      {/* Ingezoomde bestemmingskaart als achtergrond — loopt door tot in de golf */}
      {mapProps ? (
        <DestinationHeroMapBackground {...mapProps} />
      ) : (
        <WorldMapBackground />
      )}

      {/* Vignette: alleen tonen als er geen kaart is (kaart heeft eigen zichtbaarheid) */}
      {!mapProps && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(15,29,15,0.35) 100%)' }}
        />
      )}
      {/* Uitfaden vóór de clip-rand — alleen bij geen kaart */}
      {!mapProps && (
        <div
          className="absolute inset-x-0 bottom-0 z-[5] pointer-events-none"
          style={{ height: '15%', background: 'linear-gradient(to bottom, transparent, rgba(15,29,15,0.7) 95%)' }}
        />
      )}

      {/* Inhoud */}
      <div className="relative z-10 mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-10">
          {breadcrumbs.length > 0 ? (
            <nav className="mb-6 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-cream/55">
              <Link href="/bestemmingen" className="transition-colors hover:text-cream">Alle bestemmingen</Link>
              {breadcrumbs.map((crumb) => (
                <span key={crumb.slug} className="flex items-center gap-2">
                  <span>/</span>
                  <Link href={`/bestemmingen/${crumb.slug}`} className="transition-colors hover:text-cream">{crumb.name}</Link>
                </span>
              ))}
              <span>/</span>
            </nav>
          ) : (
            <Link
              href="/bestemmingen"
              className="mb-10 inline-flex text-[12px] font-semibold uppercase tracking-[0.14em] text-cream/55 transition-colors hover:text-cream"
            >
              ← Alle bestemmingen
            </Link>
          )}

          {eyebrow && (
            <span className="mb-4 block text-[12px] font-semibold uppercase tracking-[0.16em] text-cream/70">
              {eyebrow}
            </span>
          )}

          <h1 className="mb-7 text-5xl leading-[0.98] text-cream! md:text-7xl lg:text-8xl">
            {name}
          </h1>

          {intro && (
            <p className="max-w-4xl text-[22px] leading-relaxed text-cream/70 md:text-[26px]">
              {intro}
            </p>
          )}

          {factItems.length > 0 && (
            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {factItems.map((item) => (
                <div key={item.label} className="border-l border-cream/15 pl-5">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-cream/35">{item.label}</p>
                  <p className="text-lg leading-snug text-cream md:text-xl">{item.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </section>
  )
}
