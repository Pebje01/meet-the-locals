import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Destination, Post } from '@/payload-types'
import { DestinationHeroClient } from './DestinationHeroClient'
import { DestinationPhotoSlider } from './DestinationPhotoSlider'
import { DestinationInfoStrip } from './DestinationInfoStrip'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { PhotoCard } from '@/components/ui/PhotoCard'
import { PostCard } from '@/components/ui/PostCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { formatDate } from '@/lib/format'
import { imageUrl } from '@/lib/media'
import { publishedPostsWhere } from '@/lib/queries'

type Props = {
  params: Promise<{ slug: string }>
}

// --- Helpers ---

const REGION_LABELS: Record<string, string> = {
  'europe': 'Europa',
  'asia': 'Azië',
  'north-america': 'Noord-Amerika',
  'south-america': 'Zuid-Amerika',
  'africa': 'Afrika',
  'oceania': 'Oceanië',
  'middle-east': 'Midden-Oosten',
}

function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

type ResolvedDestination = Destination & {
  parent?: Destination | null
}

/** Bouw een breadcrumb-pad op vanuit de parent-chain. */
function buildBreadcrumb(dest: ResolvedDestination): { name: string; slug: string }[] {
  const crumbs: { name: string; slug: string }[] = []
  let current: ResolvedDestination | null = dest

  while (current?.parent && typeof current.parent === 'object') {
    const p = current.parent as ResolvedDestination
    crumbs.unshift({ name: p.name, slug: p.slug })
    current = p
  }

  return crumbs
}

/** Controleer of een post relevant is voor deze bestemming. */
function isRelatedPost(post: Post, dest: Destination): boolean {
  const destTerms = [
    dest.slug,
    dest.name,
    ...(dest.places?.map((p) => p.name) ?? []),
  ]
    .filter(Boolean)
    .map((t) => normalizeText(t as string))

  const postText = normalizeText(
    `${post.title} ${post.slug} ${post.excerpt ?? ''} ` +
      (post.destinations ?? [])
        .map((d) => (typeof d === 'object' ? `${d.name} ${d.slug}` : ''))
        .join(' '),
  )

  return destTerms.some((term) => postText.includes(term))
}

/** Afwisselende tinten voor de highlightkaartjes, dezelfde als TintedCard. */
const HIGHLIGHT_TONES = [
  'bg-water-muted border-water-light/50',
  'bg-mint border-forest/10',
  'bg-accent-muted border-accent/15',
]

// --- Metadata ---

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://meetthelocals.nl'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'destinations',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  const dest = docs[0]
  if (!dest) return { title: 'Bestemming niet gevonden' }

  const hero = imageUrl(dest.heroImage)
  const heroAbsolute = hero ? (hero.startsWith('http') ? hero : `${SITE_URL}${hero}`) : undefined

  return {
    title: `${dest.name} | Bestemmingen`,
    description: dest.intro ?? '',
    alternates: {
      canonical: `${SITE_URL}/bestemmingen/${slug}`,
    },
    openGraph: {
      title: `${dest.name} | Meet the Locals`,
      description: dest.intro ?? '',
      url: `${SITE_URL}/bestemmingen/${slug}`,
      siteName: 'Meet the Locals',
      ...(heroAbsolute && { images: [{ url: heroAbsolute, alt: dest.name }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${dest.name} | Meet the Locals`,
      description: dest.intro ?? '',
      ...(heroAbsolute && { images: [heroAbsolute] }),
    },
  }
}

// --- Hoofd-exportcomponent ---

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config })

  // Laad de bestemming met parent-chain (depth 3 voor land > regio > gebied > stad)
  const { docs } = await payload.find({
    collection: 'destinations',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 3,
  })

  const dest = docs[0] as ResolvedDestination | undefined
  if (!dest) notFound()

  // Laad directe kinderen
  const { docs: children } = await payload.find({
    collection: 'destinations',
    where: { parent: { equals: dest.id } },
    sort: 'name',
    depth: 1,
    limit: 100,
  })

  const hasChildren = children.length > 0
  const image = imageUrl(dest.heroImage)
  // Per-filename object-position overrides for the photo slider
  const objectPositionMap: Record<string, string> = {
    'singapore-12.webp': 'top',   // Fullerton Hotel: hotel visible at top
    'singapore-23.webp': 'top',   // Supertrees by night: colorful tops
  }

  const galleryImages = (dest.gallery ?? [])
    .map((item) => {
      if (typeof item.image !== 'object') return null
      const img = item.image
      const filename = img.filename ?? ''
      return {
        url: img.url ?? '',
        caption: img.caption ?? null,
        objectPosition: objectPositionMap[filename] ?? null,
        exif: img.exif ?? null,
      }
    })
    .filter((img): img is NonNullable<typeof img> => !!img?.url)

  const breadcrumbs = buildBreadcrumb(dest)

  // Kaartdata
  const hasMap =
    dest.mapLabel &&
    dest.countryIds &&
    dest.countryIds.length > 0 &&
    dest.coordinates.latitude != null

  const mapProps = hasMap
    ? {
        countryIds: (dest.countryIds ?? []).map((c) => c.countryCode),
        marker: [dest.coordinates.longitude, dest.coordinates.latitude] as [number, number],
        label: dest.mapLabel!,
        scale: dest.mapScale ?? 1500,
        center: [
          dest.mapCenter?.longitude ?? dest.coordinates.longitude,
          dest.mapCenter?.latitude ?? dest.coordinates.latitude,
        ] as [number, number],
      }
    : null

  // Gerelateerde posts (voor alle niveau's)
  const { docs: allPosts } = await payload.find({
    collection: 'posts',
    where: publishedPostsWhere(),
    sort: '-publishedDate',
    depth: 1,
    limit: 100,
  })
  const relatedPosts = allPosts.filter((post) => isRelatedPost(post, dest)).slice(0, 3)


  return (
    <main className="bg-cream">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <DestinationHeroClient
        heroImageUrl={image}
        mapProps={mapProps}
        breadcrumbs={breadcrumbs}
        slug={dest.slug}
        name={dest.name}
        eyebrow={dest.eyebrow}
        intro={dest.intro}
        factItems={[
          dest.region ? { label: 'Werelddeel', value: REGION_LABELS[dest.region] ?? dest.region } : null,
          dest.population ? { label: 'Inwoners', value: dest.population } : null,
          dest.flightHours ? { label: 'Reistijd', value: dest.flightHours } : null,
        ].filter(Boolean) as { label: string; value: string }[]}
      />

      {/* ── Reisinfo-balk en fotogalerij ─────────────────────────────────
          Samen onder de golf van de hero geschoven: is er reisinfo, dan vult
          de oranje balk die golf, anders loopt de foto er direct onder door. */}
      <div className="relative z-[1] -mt-20 md:-mt-28 lg:-mt-36">
        <DestinationInfoStrip info={dest.travelInfo ?? null} flightHours={dest.flightHours ?? null} />
        {galleryImages.length > 0 && <DestinationPhotoSlider images={galleryImages} name={dest.name} />}
      </div>

      {/* ── Gerelateerde verhalen (direct onder de fotoslider) ─────────── */}
      {relatedPosts.length > 0 && (
        <section className="bg-cream py-16 md:py-20">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <SectionHeader
              eyebrow="Meer lezen"
              title={`Verhalen over ${dest.name}`}
              link={{ href: '/blog', label: 'Alle verhalen' }}
              className="mb-10 md:mb-12"
            />
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {relatedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={{
                    title: post.title,
                    href: `/blog/${post.slug}`,
                    image: imageUrl(post.heroImage),
                    excerpt: post.excerpt,
                    date: formatDate(post.publishedDate),
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}


      {/* ── Highlights ───────────────────────────────────────────────────── */}
      {dest.highlightList && dest.highlightList.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <Eyebrow className="mb-6">Highlights</Eyebrow>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {dest.highlightList.map((item, index) => {
                const cardClass = HIGHLIGHT_TONES[index % HIGHLIGHT_TONES.length]

                // Highlight photo (optional, set per item in the CMS)
                const photoMedia =
                  item.photo && typeof item.photo === 'object' ? item.photo : null
                const photoUrl = photoMedia && 'url' in photoMedia ? (photoMedia.url ?? null) : null

                return (
                  <article
                    key={item.id}
                    className={`overflow-hidden rounded-3xl border ${cardClass}`}
                  >
                    {/* Number badge + highlight text */}
                    <div className="px-8 pb-5 pt-8">
                      <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/60 text-sm font-semibold text-forest/70">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 className="t-h3 text-forest">{item.text}</h3>
                    </div>

                    {/* Photo at bottom */}
                    {photoUrl && (
                      <div className="px-6 pb-6">
                        <div className="relative h-[130px] overflow-hidden rounded-2xl">
                          <Image
                            src={photoUrl}
                            alt={item.text}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Over de bestemming + gebieden als pills ───────────────────────── */}
      {(dest.title || dest.places?.length) && (
        <section className="bg-cream py-16 md:py-24">
          <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 lg:grid-cols-12 lg:px-10">
            {dest.title && (
              <div className="lg:col-span-5">
                <Eyebrow className="mb-4">Over {dest.name}</Eyebrow>
                <h2 className="t-h2 text-forest">{dest.title}</h2>
              </div>
            )}
            <div className="t-lead space-y-6 text-text-muted lg:col-span-7">
              {dest.intro && <p>{dest.intro}</p>}
              {dest.mood && <p>{dest.mood}</p>}
              {dest.places && dest.places.length > 0 && (
                <div className="pt-2">
                  <Eyebrow tone="muted" as="p" className="mb-3">
                    Gebieden
                  </Eyebrow>
                  <div className="flex flex-wrap gap-3">
                    {dest.places.map((place) => (
                      <span
                        key={place.id}
                        className="pill border border-forest/10 bg-white text-forest/75"
                      >
                        {place.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Sub-bestemmingen (regio's, gebieden, steden) ─────────────────── */}
      {hasChildren && (
        <section className="mx-auto max-w-[1400px] px-6 py-24 md:py-32 lg:px-10">
          <SectionHeader
            eyebrow={dest.level === 'land' ? "Regio's" : dest.level === 'regio' ? 'Gebieden' : 'Plekken'}
            title={`Ontdek ${dest.name} per ${dest.level === 'land' ? 'regio' : dest.level === 'regio' ? 'gebied' : 'plek'}`}
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {children.map((child) => (
              <PhotoCard
                key={child.slug}
                href={`/bestemmingen/${child.slug}`}
                image={imageUrl(child.heroImage)}
                alt={child.name}
                title={child.name}
                eyebrow={child.eyebrow ?? undefined}
                aspect="aspect-[4/3]"
              >
                {child.intro && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-cream/75">{child.intro}</p>}
              </PhotoCard>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
