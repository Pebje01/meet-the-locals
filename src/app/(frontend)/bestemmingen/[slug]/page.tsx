import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Destination, Post } from '@/payload-types'
import { DestinationOverviewMap } from './DestinationOverviewMap'
import { DestinationPhotoSlider } from './DestinationPhotoSlider'
import { DestinationInfoStrip } from './DestinationInfoStrip'
import { WorldMapBackground } from './WorldMapBackground'
import { BreadcrumbJsonLd } from '@/components/JsonLd'

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

function heroUrl(img: Destination['heroImage']): string {
  return img && typeof img === 'object' ? (img.url ?? '') : ''
}

function postImageUrl(img: Post['heroImage']): string {
  return img && typeof img === 'object' ? (img.url ?? '') : ''
}

function formatDate(date?: string | null): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
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

  const hero = heroUrl(dest.heroImage)
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

// --- Sub-componenten ---

function Breadcrumb({ crumbs }: { crumbs: { name: string; slug: string }[] }) {
  if (crumbs.length === 0) return null
  return (
    <nav className="mb-6 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-cream/55">
      <Link href="/bestemmingen" className="transition-colors hover:text-cream">
        Alle bestemmingen
      </Link>
      {crumbs.map((crumb) => (
        <span key={crumb.slug} className="flex items-center gap-2">
          <span>/</span>
          <Link href={`/bestemmingen/${crumb.slug}`} className="transition-colors hover:text-cream">
            {crumb.name}
          </Link>
        </span>
      ))}
      <span>/</span>
    </nav>
  )
}

function FactItems({ dest }: { dest: Destination }) {
  const items = [
    dest.region ? { label: 'Werelddeel', value: REGION_LABELS[dest.region] ?? dest.region } : null,
    dest.population ? { label: 'Inwoners', value: dest.population } : null,
    dest.flightHours ? { label: 'Reistijd', value: dest.flightHours } : null,
  ].filter(Boolean) as { label: string; value: string }[]

  if (items.length === 0) return null

  return (
    <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="border-l border-cream/15 pl-5">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-cream/35">
            {item.label}
          </p>
          <p className="text-lg leading-snug text-cream md:text-xl">{item.value}</p>
        </div>
      ))}
    </div>
  )
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
  const image = heroUrl(dest.heroImage)
  const galleryUrls = (dest.gallery ?? [])
    .map((item) => (typeof item.image === 'object' ? (item.image.url ?? '') : ''))
    .filter(Boolean) as string[]

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
    where: { status: { equals: 'published' } },
    sort: '-publishedDate',
    depth: 1,
    limit: 100,
  })
  const relatedPosts = allPosts.filter((post) => isRelatedPost(post, dest)).slice(0, 3)

  const breadcrumbItems = [
    { name: 'Bestemmingen', url: `${SITE_URL}/bestemmingen` },
    ...breadcrumbs.map((c) => ({ name: c.name, url: `${SITE_URL}/bestemmingen/${c.slug}` })),
    { name: dest.name, url: `${SITE_URL}/bestemmingen/${dest.slug}` },
  ]

  return (
    <main className="bg-warm-white">
      <BreadcrumbJsonLd items={breadcrumbItems} />
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] overflow-hidden bg-forest-dark px-6 pb-20 pt-32 text-cream md:pt-40 lg:px-10 noise-overlay">
        {image && (
          <Image
            src={image}
            alt=""
            fill
            priority
            className="object-cover opacity-20"
            sizes="100vw"
          />
        )}
        <WorldMapBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-dark via-forest-dark/95 to-forest-dark" />

        <div className="relative z-10 mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className={mapProps ? 'lg:col-span-6' : 'lg:col-span-10'}>
            <Breadcrumb crumbs={breadcrumbs} />
            {!breadcrumbs.length && (
              <Link
                href="/bestemmingen"
                className="mb-10 inline-flex text-[12px] font-semibold uppercase tracking-[0.14em] text-cream/55 transition-colors hover:text-cream"
              >
                ← Alle bestemmingen
              </Link>
            )}
            {dest.eyebrow && (
              <span className="mb-4 block text-[12px] font-semibold uppercase tracking-[0.16em] text-cream/70">
                {dest.eyebrow}
              </span>
            )}
            <h1 className="mb-7 text-5xl leading-[0.98] text-cream! md:text-7xl lg:text-8xl">
              {dest.name}
            </h1>
            {dest.intro && (
              <p className="max-w-2xl text-[22px] leading-relaxed text-cream/70 md:text-[26px]">
                {dest.intro}
              </p>
            )}
            <FactItems dest={dest} />
          </div>

          {mapProps && (
            <div className="lg:col-span-6">
              <DestinationOverviewMap {...mapProps} />
            </div>
          )}
        </div>
      </section>

      {/* ── Fotogalerij ──────────────────────────────────────────────────── */}
      {galleryUrls.length > 0 && (
        <div className="-mt-px">
          <DestinationPhotoSlider images={galleryUrls} name={dest.name} />
        </div>
      )}

      {/* ── Reisinfo-strip ───────────────────────────────────────────────── */}
      <DestinationInfoStrip info={dest.travelInfo ?? null} flightHours={dest.flightHours ?? null} />

      {/* ── Highlights ───────────────────────────────────────────────────── */}
      {dest.highlightList && dest.highlightList.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <span className="mb-4 block text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
              Highlights
            </span>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {dest.highlightList.map((item, index) => {
                const cardClass =
                  index === 0
                    ? 'bg-water-muted border-water-light/50'
                    : index === 1
                      ? 'bg-[#e6f0df] border-forest/10'
                      : 'bg-accent-muted border-accent/15'

                // Mini map: static OSM tile centered on the destination's coordinates
                const lat = dest.coordinates?.latitude
                const lng = dest.coordinates?.longitude
                const mapZoom =
                  dest.level === 'stad' ? 11
                  : dest.level === 'gebied' ? 9
                  : dest.level === 'land' ? 5
                  : 7
                const mapUrl =
                  lat != null && lng != null
                    ? `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=${mapZoom}&size=600x230`
                    : null

                // Highlight photo (optional, set per item in the CMS)
                const photoMedia =
                  item.photo && typeof item.photo === 'object' ? item.photo : null
                const photoUrl = photoMedia && 'url' in photoMedia ? (photoMedia.url ?? null) : null

                return (
                  <article
                    key={item.id}
                    className={`overflow-hidden rounded-[1.75rem] border ${cardClass}`}
                  >
                    {/* Mini map at top */}
                    {mapUrl && (
                      <div
                        className="relative h-[115px] w-full"
                        style={{
                          backgroundImage: `url(${mapUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      >
                        <span className="absolute bottom-1 right-2 font-sans text-[8px] text-black/30">
                          © OpenStreetMap
                        </span>
                      </div>
                    )}

                    {/* Number badge + highlight text */}
                    <div className="px-8 pb-5 pt-8">
                      <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/60 text-sm font-semibold text-forest/70">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 className="text-2xl leading-tight text-forest">{item.text}</h3>
                    </div>

                    {/* Photo at bottom */}
                    {photoUrl && (
                      <div className="px-6 pb-6">
                        <div className="relative h-[130px] overflow-hidden rounded-[1.25rem]">
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
                <span className="mb-4 block text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
                  Over {dest.name}
                </span>
                <h2 className="text-4xl leading-[1.05] text-forest md:text-5xl">{dest.title}</h2>
              </div>
            )}
            <div className="space-y-6 text-[19px] leading-relaxed text-text-muted md:text-[20px] lg:col-span-7">
              {dest.intro && <p>{dest.intro}</p>}
              {dest.mood && <p>{dest.mood}</p>}
              {dest.places && dest.places.length > 0 && (
                <div className="pt-2">
                  <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-forest/40">
                    Gebieden
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {dest.places.map((place) => (
                      <span
                        key={place.id}
                        className="rounded-full border border-forest/10 bg-white px-5 py-2.5 text-sm font-medium text-forest/75 shadow-sm"
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
          <span className="mb-4 block text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
            {dest.level === 'land' ? "Regio's" : dest.level === 'regio' ? 'Gebieden' : 'Plekken'}
          </span>
          <h2 className="mb-12 text-4xl leading-tight text-forest md:text-5xl">
            Ontdek {dest.name} per{' '}
            {dest.level === 'land' ? 'regio' : dest.level === 'regio' ? 'gebied' : 'plek'}
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {children.map((child) => {
              const childImage = heroUrl(child.heroImage)
              return (
                <Link
                  key={child.slug}
                  href={`/bestemmingen/${child.slug}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-forest">
                    {childImage && (
                      <Image
                        src={childImage}
                        alt={child.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/30 to-transparent" />
                    {child.eyebrow && (
                      <div className="absolute left-5 top-5 rounded-full bg-white/15 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-cream backdrop-blur-sm">
                        {child.eyebrow}
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                      <h3 className="text-3xl font-display font-light text-cream!">
                        {child.name}
                      </h3>
                      {child.intro && (
                        <p className="mt-2 text-sm leading-relaxed text-cream/75 line-clamp-2">
                          {child.intro}
                        </p>
                      )}
                      <span className="mt-4 inline-block text-sm font-semibold uppercase tracking-[0.1em] text-cream/80 transition-colors group-hover:text-cream">
                        Bekijk →
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Gerelateerde blogs ────────────────────────────────────────────── */}
      <section className="bg-[#F5EFE8] py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="mb-4 block text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
                Meer lezen
              </span>
              <h2 className="text-4xl leading-tight text-forest md:text-5xl">
                Reisblogs over {dest.name}
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-sm font-semibold uppercase tracking-[0.1em] text-forest transition-colors hover:text-accent"
            >
              Alle reistips bekijken →
            </Link>
          </div>

          {relatedPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {relatedPosts.map((post) => (
                <article key={post.id}>
                  <Link href={`/blog/${post.slug}`} className="group block h-full">
                    <div className="h-full overflow-hidden rounded-[1.75rem] bg-white shadow-sm transition-transform duration-300 group-hover:-translate-y-1">
                      <div className="relative aspect-[4/3] bg-cream">
                        {postImageUrl(post.heroImage) && (
                          <Image
                            src={postImageUrl(post.heroImage)}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        )}
                      </div>
                      <div className="p-6">
                        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
                          {formatDate(post.publishedDate)}
                        </p>
                        <h3 className="mb-3 text-2xl leading-tight text-forest transition-colors group-hover:text-accent">
                          {post.title}
                        </h3>
                        <p className="mb-5 line-clamp-3 text-[16px] leading-relaxed text-text-muted">
                          {post.excerpt}
                        </p>
                        <span className="text-sm font-semibold uppercase tracking-[0.1em] text-forest">
                          Lees verder →
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[1.75rem] bg-white p-8 shadow-sm md:p-10">
              <p className="max-w-3xl text-[19px] leading-relaxed text-text-muted">
                Binnenkort verschijnen hier de reisblogs die bij {dest.name} horen.
              </p>
              <Link
                href="/blog"
                className="mt-7 inline-flex rounded-full bg-forest px-7 py-4 text-sm font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-accent"
              >
                Bekijk alle reistips
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
