import Image from 'next/image'
import { HeroDecorMap } from './HeroDecorMap'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Eyebrow } from '@/components/ui/Eyebrow'

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
  slug,
  name,
  eyebrow,
  intro,
  factItems,
}: {
  heroImageUrl: string
  mapProps: MapProps | null
  breadcrumbs: Crumb[]
  slug: string
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
      <HeroDecorMap mapProps={mapProps ?? null} />

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
          <Breadcrumbs
            items={[
              { name: 'Bestemmingen', href: '/bestemmingen' },
              ...breadcrumbs.map((crumb) => ({ name: crumb.name, href: `/bestemmingen/${crumb.slug}` })),
              { name, href: `/bestemmingen/${slug}` },
            ]}
            className="mb-8"
          />

          {eyebrow && (
            <Eyebrow tone="light" className="mb-4">
              {eyebrow}
            </Eyebrow>
          )}

          <h1 className="t-h1 mb-7 text-cream">
            {name}
          </h1>

          {intro && (
            <p className="t-lead max-w-3xl text-cream/75 md:text-[22px]">
              {intro}
            </p>
          )}

          {factItems.length > 0 && (
            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {factItems.map((item) => (
                <div key={item.label} className="border-l border-cream/15 pl-5">
                  <p className="t-meta mb-2 font-semibold text-cream/45">{item.label}</p>
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
