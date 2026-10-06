import { getPayload } from 'payload'
import config from '@payload-config'
import { PageHero } from '@/components/PageHero'
import { OrganicEdge } from '@/components/OrganicEdge'
import { PhotoCard } from '@/components/ui/PhotoCard'
import { HERO_IMAGES } from '@/lib/heroImages'
import { imageUrl } from '@/lib/media'
import { publishedPostsWhere } from '@/lib/queries'
import type { Destination } from '@/payload-types'
import { DestinationsWorldMap } from './DestinationsWorldMap'

function thumbnailUrl(destination: Destination): string {
  const firstGallery = destination.gallery?.[0]
  return imageUrl(firstGallery?.image) || imageUrl(destination.heroImage)
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

function relationId(value: number | Destination | null | undefined): number | null {
  if (value == null) return null
  return typeof value === 'object' ? value.id : value
}

/**
 * Aantal gepubliceerde blogposts per land. Een post kan aan een stad of regio
 * hangen; die telt mee bij het land erboven. Elke post telt één keer per land.
 */
async function countPostsPerCountry(): Promise<Map<number, number>> {
  const payload = await getPayload({ config })
  const [{ docs: allDestinations }, { docs: posts }] = await Promise.all([
    payload.find({ collection: 'destinations', depth: 0, limit: 1000, select: { parent: true } }),
    payload.find({ collection: 'posts', where: publishedPostsWhere(), depth: 0, limit: 1000, select: { destinations: true } }),
  ])

  const parentOf = new Map(allDestinations.map((d) => [d.id, relationId(d.parent)]))
  const rootOf = (id: number): number => {
    let current = id
    // Begrensd, zodat een per ongeluk circulaire parent de pagina niet laat hangen.
    for (let i = 0; i < 6; i++) {
      const parent = parentOf.get(current)
      if (parent == null) break
      current = parent
    }
    return current
  }

  const counts = new Map<number, number>()
  for (const post of posts) {
    const countries = new Set(
      (post.destinations ?? []).map(relationId).filter((id): id is number => id != null).map(rootOf),
    )
    for (const country of countries) counts.set(country, (counts.get(country) ?? 0) + 1)
  }
  return counts
}

function articleLabel(count: number): string | undefined {
  if (count === 0) return undefined
  return count === 1 ? '1 artikel' : `${count} artikelen`
}

export default async function DestinatiesPage() {
  const payload = await getPayload({ config })

  const [{ docs: countries }, postCounts] = await Promise.all([
    payload.find({
      collection: 'destinations',
      where: { level: { equals: 'land' } },
      sort: 'name',
      depth: 1,
      limit: 100,
    }),
    countPostsPerCountry(),
  ])

  const mapData = countries
    .filter((d) => d.countryIds && d.countryIds.length > 0)
    .map((d) => ({
      slug: d.slug,
      name: d.name,
      countryCode: d.countryIds![0].countryCode,
    }))

  return (
    <main>
      <PageHero
        title="Bestemmingen"
        subtitle="Alle plekken waar ik ben geweest, van Zuidoost-Azië tot Zuid-Amerika."
        image={HERO_IMAGES.bestemmingen}
        next="var(--color-forest-dark)"
        variant="dark"
      />

      {/* Compacte kaartband direct onder de hero, met een golf naar het raster */}
      <section className="relative bg-forest-dark pb-16 pt-6 md:pb-24 md:pt-8">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <p className="t-meta mb-2 text-center font-semibold text-cream/40">Klik op een land om te verkennen</p>
          <DestinationsWorldMap destinations={mapData} />
        </div>
        <OrganicEdge fill="var(--color-cream)" className="h-[36px] md:h-[64px]" />
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-[1400px] px-6 pb-20 pt-10 md:pb-28 md:pt-14 lg:px-10">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {countries.map((destination) => (
              <PhotoCard
                key={destination.slug}
                href={`/bestemmingen/${destination.slug}`}
                image={thumbnailUrl(destination)}
                alt={destination.name}
                title={destination.name}
                eyebrow={regionLabel[destination.region] ?? destination.region}
                meta={articleLabel(postCounts.get(destination.id) ?? 0)}
                aspect="aspect-[4/3]"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
