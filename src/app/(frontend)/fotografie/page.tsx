import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { PageHero } from '@/components/PageHero'
import { EmptyState } from '@/components/ui/EmptyState'
import { ExifCaption } from '@/components/ui/ExifCaption'
import { PhotoCard } from '@/components/ui/PhotoCard'
import { PostCard } from '@/components/ui/PostCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { TextLink } from '@/components/ui/TextLink'
import { formatDate } from '@/lib/format'
import { HERO_IMAGES } from '@/lib/heroImages'
import { imageUrl } from '@/lib/media'
import type { Media } from '@/payload-types'

type StripPhoto = { media: Media; destination: { name: string; slug: string } }

/**
 * Een fotostrook uit de bestemmingsgalerijen: per bestemming de eerste foto's,
 * om en om, zodat de strook laat zien hoe breed het werk is in plaats van tien
 * beelden van dezelfde stad.
 */
async function getGalleryStrip(limit = 10): Promise<StripPhoto[]> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'destinations',
    where: { 'gallery.image': { exists: true } },
    sort: 'name',
    depth: 1,
    limit: 50,
  })

  const perDestination = docs.map((d) =>
    (d.gallery ?? [])
      .map((item) => item.image)
      .filter((img): img is Media => typeof img === 'object' && !!img?.url)
      .slice(0, 2)
      .map((media) => ({ media, destination: { name: d.name, slug: d.slug } })),
  )

  const strip: StripPhoto[] = []
  for (let round = 0; round < 2 && strip.length < limit; round++) {
    for (const photos of perDestination) {
      if (photos[round]) strip.push(photos[round])
      if (strip.length >= limit) break
    }
  }
  return strip
}

type GearItem = { camera: string; photos: number; lenses: string[] }

/**
 * Waar ik mee fotografeer, afgeleid uit de EXIF van de mediabibliotheek. Zo
 * klopt het blok altijd met de foto's die echt op de site staan.
 */
async function getGear(): Promise<GearItem[]> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'media',
    where: { 'exif.camera': { exists: true } },
    depth: 0,
    limit: 2000,
    select: { exif: true },
  })

  const byCamera = new Map<string, { label: string; photos: number; lenses: Map<string, number> }>()
  for (const doc of docs) {
    const camera = doc.exif?.camera?.trim()
    if (!camera) continue
    const key = camera.toLowerCase()
    const entry = byCamera.get(key) ?? { label: camera, photos: 0, lenses: new Map() }
    entry.photos++
    const lens = doc.exif?.lens?.trim()
    if (lens) entry.lenses.set(lens, (entry.lenses.get(lens) ?? 0) + 1)
    // Voorkeur voor de schrijfwijze met kleine letters ("Nikon" boven "NIKON")
    if (camera !== camera.toUpperCase()) entry.label = camera
    byCamera.set(key, entry)
  }

  return [...byCamera.values()]
    .sort((a, b) => b.photos - a.photos)
    .slice(0, 4)
    .map((entry) => ({
      camera: entry.label,
      photos: entry.photos,
      lenses: [...entry.lenses.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([lens]) => lens),
    }))
}

export default async function FotografiePage() {
  const payload = await getPayload({ config })

  const [{ docs: fotoVerhalen }, { docs: tips }, strip, gear] = await Promise.all([
    payload.find({
      collection: 'stories',
      where: {
        status: { equals: 'published' },
        thema: { contains: 'reisfotografie' },
      },
      sort: '-publishedDate',
      depth: 1,
      limit: 6,
    }),
    payload.find({
      collection: 'photography-posts',
      where: { status: { equals: 'published' } },
      sort: '-publishedDate',
      depth: 1,
      limit: 6,
    }),
    getGalleryStrip(),
    getGear(),
  ])

  const [featured, ...rest] = fotoVerhalen

  return (
    <main className="min-h-screen bg-cream">
      <PageHero
        title="Fotografie"
        subtitle="Reisfotografie verhalen, beelden van onderweg en de camera's waarmee ze gemaakt zijn."
        image={HERO_IMAGES.fotografie}
      />

      {/* Reisfotografie verhalen */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <SectionHeader
            eyebrow="Diepte"
            title="Reisfotografie verhalen"
            link={{ href: '/verhalen', label: 'Alle reportages' }}
            className="mb-10 md:mb-12"
          />

          {!featured ? (
            <EmptyState title="Binnenkort" text="De eerste reisfotografie verhalen komen eraan." />
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <PhotoCard
                href={`/verhalen/${featured.slug}`}
                image={imageUrl(featured.heroImage)}
                alt={featured.title}
                title={<span className="t-h3 block">{featured.title}</span>}
                eyebrow={featured.eyebrow ?? undefined}
                meta={formatDate(featured.publishedDate)}
                aspect="aspect-[4/3] md:aspect-[21/9]"
                sizes="100vw"
                className="lg:col-span-2"
              >
                {featured.intro && (
                  <p className="mt-3 line-clamp-2 max-w-xl text-[15px] leading-relaxed text-cream/80">{featured.intro}</p>
                )}
              </PhotoCard>
              {rest.map((story) => (
                <PhotoCard
                  key={story.id}
                  href={`/verhalen/${story.slug}`}
                  image={imageUrl(story.heroImage)}
                  alt={story.title}
                  title={story.title}
                  eyebrow={story.eyebrow ?? undefined}
                  meta={formatDate(story.publishedDate)}
                  aspect="aspect-[4/3]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Fotostrook uit de bestemmingsgalerijen */}
      {strip.length > 0 && (
        <section className="pb-16 md:pb-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <SectionHeader
              eyebrow="Onderweg"
              title="Uit de galerijen"
              link={{ href: '/bestemmingen', label: 'Alle bestemmingen' }}
              className="mb-8 md:mb-10"
            />
          </div>
          <div className="no-scrollbar flex gap-4 overflow-x-auto px-[max(1.5rem,calc((100vw-1400px)/2+1.5rem))] lg:px-[max(2.5rem,calc((100vw-1400px)/2+2.5rem))]">
            {strip.map(({ media, destination }) => (
              <Link
                key={media.id}
                href={`/bestemmingen/${destination.slug}`}
                className="group relative aspect-[3/4] w-[min(70vw,280px)] shrink-0 overflow-hidden rounded-3xl bg-cream-dark"
              >
                <Image
                  src={media.url!}
                  alt={media.alt || destination.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  sizes="280px"
                />
                <ExifCaption exif={media.exif} location={media.caption || destination.name} />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Gear */}
      {gear.length > 0 && (
        <section className="bg-cream-dark/50 py-16 md:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <SectionHeader eyebrow="Gear" title="Waar ik mee fotografeer" className="mb-10 md:mb-12">
              Afgeleid uit de foto&apos;s op deze site: welke camera ze maakte en met welke lens.
            </SectionHeader>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {gear.map((item) => (
                <div key={item.camera} className="rounded-3xl border border-forest/10 bg-white/70 p-7">
                  <p className="t-meta mb-3 font-semibold text-accent">
                    {item.photos === 1 ? '1 foto' : `${item.photos} foto's`} op de site
                  </p>
                  <h3 className="t-card mb-4 text-forest">{item.camera}</h3>
                  {item.lenses.length > 0 && (
                    <ul className="space-y-1.5 text-[15px] text-text-muted">
                      {item.lenses.map((lens) => (
                        <li key={lens}>{lens}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tips: alleen als er al iets staat */}
      {tips.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <SectionHeader eyebrow="Kennis" title="Tips en inspiratie" className="mb-10 md:mb-12" />
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {tips.map((tip) => (
                <PostCard
                  key={tip.id}
                  post={{
                    title: tip.title,
                    href: `/fotografie/blog/${tip.slug}`,
                    image: imageUrl(tip.heroImage),
                    excerpt: tip.excerpt,
                    category: 'Fotografie',
                    date: formatDate(tip.publishedDate),
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="pb-20 text-center md:pb-28">
        <TextLink href="/werk-in-opdracht">Fotografie in opdracht</TextLink>
      </div>
    </main>
  )
}
