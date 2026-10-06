import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'
import type { Media, Story } from '@/payload-types'
import { ArticleJsonLd } from '@/components/JsonLd'
import { AuthorByline } from '@/components/AuthorByline'
import { OrganicEdge } from '@/components/OrganicEdge'
import { RichText } from '@/components/blog/RichText'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { CREDIT } from '@/lib/credit'
import { formatDate } from '@/lib/format'
import { imageUrl, imageAlt } from '@/lib/media'
import { WERELDDEEL_OPTIONS, labelFor } from '@/lib/taxonomy'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://meetthelocals.nl'

type Props = {
  params: Promise<{ slug: string }>
}

async function getStory(slug: string): Promise<Story | null> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'stories',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    depth: 1,
    limit: 1,
  })
  return docs[0] ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const story = await getStory(slug)
  if (!story) return {}

  const title = story.seo?.metaTitle || `${story.title} | Meet the Locals`
  const description = story.seo?.metaDescription || story.intro || ''
  const ogImg = imageUrl(story.seo?.ogImage) || imageUrl(story.heroImage)

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/verhalen/${slug}` },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `${SITE_URL}/verhalen/${slug}`,
      ...(ogImg && { images: [{ url: ogImg, alt: story.title }] }),
      ...(story.publishedDate && { publishedTime: story.publishedDate }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImg && { images: [ogImg] }),
    },
  }
}

/** EXIF-regel onder een galerijfoto, alleen de velden die gevuld zijn. */
function exifLine(media: number | Media | null | undefined): string[] {
  if (!media || typeof media !== 'object' || !media.exif) return []
  const e = media.exif
  return [e.camera, e.lens, e.aperture, e.shutterSpeed, e.iso ? `ISO ${e.iso}` : '', e.focalLength].filter(
    (v): v is string => Boolean(v),
  )
}

export default async function VerhaalDetailPage({ params }: Props) {
  const { slug } = await params
  const story = await getStory(slug)
  if (!story) notFound()

  const hero = imageUrl(story.heroImage)
  const eyebrow = story.eyebrow || labelFor(WERELDDEEL_OPTIONS, story.werelddeel) || 'Reportage'

  return (
    <main className="bg-cream">
      <ArticleJsonLd
        title={story.title}
        description={story.seo?.metaDescription || story.intro || ''}
        slug={slug}
        image={hero}
        datePublished={story.publishedDate ?? story.createdAt}
        dateModified={story.updatedAt}
        basePath="/verhalen"
        {...(story.thema?.length && { category: story.thema[0] })}
      />

      {/* Hero: beeldvullend, tekst linksonder op het vaste zijverloop */}
      <section className="relative flex min-h-[85vh] items-end overflow-hidden bg-forest-dark">
        {hero && (
          <Image
            src={hero}
            alt={imageAlt(story.heroImage, story.title)}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        )}
        <div aria-hidden className="absolute inset-0 photo-overlay-side" />

        <div className="relative z-10 w-full pb-24 pt-40 md:pb-32">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="max-w-[60ch]">
              <Breadcrumbs
                items={[
                  { name: 'Reportages', href: '/verhalen' },
                  { name: story.title, href: `/verhalen/${slug}` },
                ]}
                className="mb-6"
              />
              <Eyebrow tone="light" className="mb-4">
                {eyebrow}
              </Eyebrow>
              <h1 className="t-h1 font-editorial mb-5 text-white">{story.title}</h1>
              <p className="t-meta mb-6 text-white/60">
                <time dateTime={story.publishedDate}>{formatDate(story.publishedDate, 'long')}</time>
              </p>
              <p className="t-lead text-white/85">{story.intro}</p>
            </div>
          </div>
        </div>

        <OrganicEdge fill="var(--color-cream)" className="h-[36px] md:h-[64px]" />
      </section>

      <article>
        <div className="mx-auto max-w-3xl px-6 py-14 md:py-20">
          <RichText data={story.content} />

          {story.gallery && story.gallery.length > 0 && (
            <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-2">
              {story.gallery.map((item, i) => {
                const src = imageUrl(item.image)
                if (!src) return null
                const exif = exifLine(item.image)
                return (
                  <figure key={i} className="group">
                    <div className="relative aspect-[4/3] overflow-hidden organic-img natural-shadow-box bg-forest-dark">
                      <Image
                        src={src}
                        alt={imageAlt(item.image, item.caption ?? story.title)}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      {exif.length > 0 && (
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap gap-x-3 gap-y-1 bg-black/50 px-4 py-2.5 text-[11px] text-white/90 [@media(hover:hover)]:opacity-0 backdrop-blur-sm transition-opacity [@media(hover:hover)]:group-hover:opacity-100">
                          {exif.map((v) => (
                            <span key={v}>{v}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <figcaption className="t-meta mt-3 flex flex-wrap gap-x-3 text-text-muted/60">
                      {item.caption && <span>{item.caption}</span>}
                      <span className="ml-auto">© {CREDIT.creator}</span>
                    </figcaption>
                  </figure>
                )
              })}
            </div>
          )}

          <AuthorByline />
        </div>
      </article>
    </main>
  )
}
