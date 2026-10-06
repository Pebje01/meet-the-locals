import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Story } from '@/payload-types'
import { PageHero } from '@/components/PageHero'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { TextLink } from '@/components/ui/TextLink'
import { EmptyState } from '@/components/ui/EmptyState'
import { HERO_IMAGES } from '@/lib/heroImages'
import { formatDate } from '@/lib/format'
import { imageUrl, imageAlt } from '@/lib/media'
import { WERELDDEEL_OPTIONS, labelFor } from '@/lib/taxonomy'

export default async function VerhalenPage() {
  const payload = await getPayload({ config })
  const { docs: stories } = await payload.find({
    collection: 'stories',
    where: { status: { equals: 'published' } },
    sort: '-publishedDate',
    depth: 1,
    limit: 50,
  })

  return (
    <main className="min-h-screen bg-cream">
      <PageHero
        title="Reportages"
        subtitle="Persoonlijke verhalen en fotografie van de meest bijzondere plekken ter wereld."
        image={HERO_IMAGES.verhalen}
        height="md"
      />

      {/*
        Elke reportage is een foto met een tekstpaneel ernaast. De tekst stond
        eerst over de foto heen, maar op drukke beelden was die onleesbaar.
        Het paneel schuift op grote schermen een stuk over de foto, zodat het
        geheel organisch blijft en niet als twee losse blokken oogt. De
        onderste marge is ruim, want de golf van de voet ligt over deze sectie.
      */}
      <section className="pb-32 pt-16 md:pb-44 md:pt-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          {stories.length === 0 ? (
            <EmptyState
              title="De eerste reportages komen eraan"
              text="Tot die tijd vind je de korte verhalen en reistips bij de blog."
              link={{ href: '/blog', label: 'Naar de korte verhalen' }}
            />
          ) : (
            <div className="flex flex-col gap-16 md:gap-24 lg:gap-28">
              {stories.map((story, i) => (
                <StoryCard key={story.id} story={story} flip={i % 2 === 1} priority={i === 0} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

function StoryCard({ story, flip, priority }: { story: Story; flip: boolean; priority: boolean }) {
  const href = `/verhalen/${story.slug}`
  const image = imageUrl(story.heroImage)
  const eyebrow = story.eyebrow || labelFor(WERELDDEEL_OPTIONS, story.werelddeel) || 'Reportage'

  return (
    <article className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-0">
      {/* Foto */}
      <Link
        href={href}
        aria-label={story.title}
        className={`group relative block aspect-[4/3] overflow-hidden organic-img natural-shadow-box img-zoom bg-forest-dark lg:col-span-7 ${
          flip ? 'lg:order-2 lg:col-start-6' : 'lg:order-1'
        }`}
      >
        {image ? (
          <Image
            src={image}
            alt={imageAlt(story.heroImage, story.title)}
            fill
            priority={priority}
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 58vw"
          />
        ) : (
          <div className="absolute inset-0 bg-forest" />
        )}
      </Link>

      {/* Tekstpaneel */}
      <div
        className={`relative z-10 overflow-hidden rounded-3xl bg-cream-dark p-8 md:p-10 lg:col-span-5 lg:p-12 ${
          flip ? 'lg:order-1 lg:col-start-1 lg:row-start-1 lg:-mr-16' : 'lg:order-2 lg:-ml-16'
        }`}
      >
        <div aria-hidden className="grain-layer opacity-50" />
        <div className="relative">
          <Eyebrow className="mb-4">{eyebrow}</Eyebrow>
          <h2 className="t-h2 mb-4 text-forest">
            <Link href={href} className="transition-colors hover:text-accent">
              {story.title}
            </Link>
          </h2>
          <p className="t-meta mb-5 text-text-muted/70">
            <time dateTime={story.publishedDate}>{formatDate(story.publishedDate, 'long')}</time>
          </p>
          <p className="t-body mb-7 line-clamp-3 text-text-muted">{story.intro}</p>
          <TextLink href={href}>Lees reportage</TextLink>
        </div>
      </div>
    </article>
  )
}
