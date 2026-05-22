import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { PageHero } from '@/components/PageHero'
import type { Destination } from '@/payload-types'

function heroUrl(img: Destination['heroImage']): string {
  return img && typeof img === 'object' ? (img.url ?? '') : ''
}

const regionLabel: Record<string, string> = {
  europe: 'Europa',
  asia: 'Azië',
  'north-america': 'Noord-Amerika',
  'south-america': 'Zuid-Amerika',
  africa: 'Afrika',
  oceania: 'Oceanië',
  'middle-east': 'Midden-Oosten',
}

export default async function DestinatiesPage() {
  const payload = await getPayload({ config })

  const { docs: countries } = await payload.find({
    collection: 'destinations',
    where: { level: { equals: 'land' } },
    sort: 'name',
    depth: 1,
    limit: 100,
  })

  return (
    <main>
      <PageHero
        title="Bestemmingen"
        subtitle="Alle plekken waar ik ben geweest, van Zuidoost-Azië tot Zuid-Amerika."
        image="/media/maleisie-7-scaled.webp"
        imageAlt="Weg door de jungle in Maleisië"
        variant="dark"
      />

      <section className="mx-auto max-w-[1400px] px-6 py-24 md:py-32 lg:px-10">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.15em] text-accent">
              Locatiepagina&apos;s
            </span>
            <h2 className="text-4xl leading-tight text-forest md:text-5xl">
              Waar ik ben geweest
            </h2>
          </div>
          <p className="max-w-xl text-[17px] leading-relaxed text-text-muted">
            Elk land heeft een eigen overzicht met sfeer, highlights, bezochte regio&apos;s en een kaart.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {countries.map((destination) => {
            const image = heroUrl(destination.heroImage)
            const label = regionLabel[destination.region] ?? destination.region

            return (
              <Link
                key={destination.slug}
                href={`/bestemmingen/${destination.slug}`}
                className="group relative block aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-forest text-cream"
              >
                {image && (
                  <Image
                    src={image}
                    alt={destination.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/30 to-transparent" />
                <div className="absolute left-5 top-5 rounded-full bg-white/15 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-cream backdrop-blur-sm">
                  {label}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                  <h2 className="text-3xl font-display font-light text-cream!">
                    {destination.name}
                  </h2>
                  {destination.intro && (
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-cream/75 line-clamp-2">
                      {destination.intro}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </main>
  )
}
