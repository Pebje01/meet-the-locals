import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  destinationIndex,
  getVisitedDestination,
  type VisitedDestination,
} from '@/lib/visitedDestinations'
import type { Destination as PayloadDestination, Post } from '@/payload-types'
import { DestinationOverviewMap } from './DestinationOverviewMap'

type Props = {
  params: Promise<{ slug: string }>
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const destination = getVisitedDestination(slug)

  if (!destination) {
    return {
      title: 'Bestemming niet gevonden',
    }
  }

  return {
    title: `${destination.name} | Bestemmingen`,
    description: destination.description,
    openGraph: {
      title: `${destination.name} | Meet the Locals`,
      description: destination.description,
      images: [{ url: destination.image, width: 1200, height: 630 }],
    },
  }
}

function factItems(destination: VisitedDestination) {
  return [
    { label: 'Locatie', value: destination.country },
    { label: 'Bezocht', value: destination.visited },
    { label: 'Focus', value: destination.bestFor },
  ]
}

function imageUrl(img: Post['heroImage']): string {
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
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

const destinationAliases: Record<string, string[]> = {
  indonesie: ['indonesia'],
  maleisie: ['malaysia'],
  'verenigde-staten': ['verenigde staten', 'united states', 'usa', 'amerika'],
  'new-york': ['new york city', 'nyc'],
  'nieuw-zeeland': ['new zealand'],
}

function destinationTerms(destination: VisitedDestination): string[] {
  const baseTerms = [
    destination.slug,
    destination.name,
    destination.name === destination.country ? destination.country : '',
    ...destination.places,
    ...(destinationAliases[destination.slug] ?? []),
  ]

  return Array.from(new Set(baseTerms.map(normalizeText).filter((term) => term.length > 2)))
}

function postDestinationText(post: Post): string {
  return (post.destinations ?? [])
    .map((destination) => {
      if (typeof destination !== 'object') return ''
      const payloadDestination = destination as PayloadDestination
      return `${payloadDestination.name} ${payloadDestination.slug}`
    })
    .join(' ')
}

function isRelatedPost(post: Post, destination: VisitedDestination): boolean {
  const terms = destinationTerms(destination)
  const relatedDestinations = normalizeText(postDestinationText(post))
  const content = normalizeText(`${post.title} ${post.slug} ${post.excerpt}`)

  return terms.some((term) => relatedDestinations.includes(term) || content.includes(term))
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params
  const destination = getVisitedDestination(slug)

  if (!destination) notFound()

  const payload = await getPayload({ config })
  const { docs: latestPosts } = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    sort: '-publishedDate',
    depth: 1,
    limit: 100,
  })

  const relatedPosts = latestPosts.filter((post) => isRelatedPost(post, destination)).slice(0, 3)
  const hasRelatedPosts = relatedPosts.length > 0

  return (
    <main className="bg-warm-white">
      <section className="relative min-h-[70vh] overflow-hidden bg-forest-dark px-6 pb-20 pt-32 text-cream md:pt-40 lg:px-10 noise-overlay">
        <Image
          src={destination.image}
          alt=""
          fill
          priority
          className="object-cover opacity-20"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-dark via-forest-dark/95 to-forest-dark" />

        <div className="relative z-10 mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <Link
              href="/bestemmingen"
              className="mb-10 inline-flex text-[12px] font-semibold uppercase tracking-[0.14em] text-cream/55 transition-colors hover:text-cream"
            >
              ← Alle bestemmingen
            </Link>
            <span className="mb-4 block text-[12px] font-semibold uppercase tracking-[0.16em] text-cream/70">
              {destination.eyebrow}
            </span>
            <h1 className="mb-7 text-5xl leading-[0.98] text-cream! md:text-7xl lg:text-8xl">
              {destination.name}
            </h1>
            <p className="max-w-4xl text-[22px] leading-relaxed text-cream/70 md:text-[26px]">
              {destination.intro}
            </p>

            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {factItems(destination).map((item) => (
                <div key={item.label} className="border-l border-cream/15 pl-5">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-cream/35">
                    {item.label}
                  </p>
                  <p className="text-lg leading-snug text-cream md:text-xl">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <DestinationOverviewMap
              countryIds={destination.countryIds}
              marker={destination.marker}
              label={destination.mapLabel}
              scale={destination.mapScale}
              center={destination.mapCenter}
            />
          </div>
        </div>
      </section>

      <section className="relative h-[55vh] min-h-[400px] overflow-hidden">
        <Image
          src={destination.image}
          alt={destination.name}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-dark/30 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-[50px] md:h-[80px] block">
            <path d="M0,80 L0,65 C240,55 480,72 720,62 C960,52 1200,68 1440,60 L1440,80 Z" fill="var(--color-warm-white)" />
          </svg>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-6 lg:grid-cols-12 lg:px-10">
          <div className="lg:col-span-5">
            <span className="mb-4 block text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
              Sfeer
            </span>
            <h2 className="text-4xl leading-[1.05] text-forest md:text-6xl">
              {destination.title}
            </h2>
          </div>
          <div className="space-y-6 text-[19px] leading-relaxed text-text-muted md:text-[20px] lg:col-span-7">
            <p>{destination.description}</p>
            <p>{destination.mood}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              {destination.places.map((place) => (
                <span
                  key={place}
                  className="rounded-full bg-water-muted px-5 py-3 text-sm font-semibold text-forest/75"
                >
                  {place}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <h2 className="mb-10 text-4xl leading-tight text-forest md:text-5xl">
            Highlights
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {destination.highlights.map((highlight, index) => {
              const cardClass =
                index === 0
                  ? 'bg-water-muted border-water-light/50'
                  : index === 1
                    ? 'bg-[#e6f0df] border-forest/10'
                    : 'bg-accent-muted border-accent/15'

              return (
                <article key={highlight} className={`rounded-[1.75rem] border p-8 ${cardClass}`}>
                  <span className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/60 text-sm font-semibold text-forest/70">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-2xl leading-tight text-forest">{highlight}</h3>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="mb-4 block text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
                Beeld
              </span>
              <h2 className="text-4xl leading-tight text-forest md:text-5xl">
                Foto&apos;s van deze bestemming
              </h2>
            </div>
            <Link
              href="/kaart"
              className="text-sm font-semibold uppercase tracking-[0.1em] text-forest transition-colors hover:text-accent"
            >
              Bekijk op de kaart →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {destination.gallery.map((image, index) => (
              <div
                key={`${destination.slug}-${image}`}
                className={`relative overflow-hidden rounded-[1.75rem] bg-cream ${
                  index === 0 ? 'aspect-[4/5] md:row-span-2' : 'aspect-[4/3]'
                }`}
              >
                <Image
                  src={image}
                  alt={`${destination.name} foto ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8f5ef] py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="mb-4 block text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
                Meer lezen
              </span>
              <h2 className="text-4xl leading-tight text-forest md:text-5xl">
                Meer reisblogs over {destination.name}
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-sm font-semibold uppercase tracking-[0.1em] text-forest transition-colors hover:text-accent"
            >
              Alle reistips bekijken →
            </Link>
          </div>

          {hasRelatedPosts ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {relatedPosts.map((post) => (
                <article key={post.id}>
                  <Link href={`/blog/${post.slug}`} className="group block h-full">
                    <div className="h-full overflow-hidden rounded-[1.75rem] bg-white shadow-sm transition-transform duration-300 group-hover:-translate-y-1">
                      <div className="relative aspect-[4/3] bg-cream">
                        {imageUrl(post.heroImage) && (
                          <Image
                            src={imageUrl(post.heroImage)}
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
                Binnenkort verschijnen hier de reisblogs die bij {destination.name} horen. Zodra er
                een verhaal aan deze bestemming gekoppeld is, komt het automatisch op deze plek te
                staan.
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
