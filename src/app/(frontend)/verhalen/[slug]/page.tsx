import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import type { Story } from '@/payload-types'
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd'

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
  const ogImg =
    story.seo?.ogImage && typeof story.seo.ogImage === 'object'
      ? (story.seo.ogImage.url ?? '')
      : imageUrl(story.heroImage)

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

function imageUrl(img: Story['heroImage']): string {
  return img && typeof img === 'object' ? (img.url ?? '') : ''
}

function formatDate(date?: string | null): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function VerhaalDetailPage({ params }: Props) {
  const { slug } = await params
  const story = await getStory(slug)
  if (!story) notFound()

  return (
    <main>
      <ArticleJsonLd
        title={story.title}
        description={story.seo?.metaDescription || story.intro || ''}
        slug={slug}
        image={imageUrl(story.heroImage)}
        datePublished={story.publishedDate ?? story.createdAt}
        dateModified={story.updatedAt}
        basePath="/verhalen"
        {...(story.thema?.length && { category: story.thema[0] })}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Verhalen', url: '/verhalen' },
          { name: story.title, url: `/verhalen/${slug}` },
        ]}
      />
      {/* Full-screen hero — links gradient, tekst links, foto rechts zichtbaar */}
      <section className="relative min-h-screen w-full overflow-hidden">
        {imageUrl(story.heroImage) && (
          <Image
            src={imageUrl(story.heroImage)}
            alt={story.title}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        )}
        {/* Links-naar-rechts: donker links, foto rechts vrij zichtbaar */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/20" />
        {/* Subtiele bottom vignette voor leesbaarheid */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-16 pb-16 md:pb-24">
                <div className="w-full">
              {story.eyebrow && (
                <span className="block font-oswald text-lg uppercase tracking-[0.05em] !text-white/70 mb-4">
                  {story.eyebrow}
                </span>
              )}
              <h1 className="!font-editorial !text-white !font-normal leading-[1.0] mb-5" style={{ fontSize: 'clamp(2rem, 8vw, 5.5rem)' }}>
                {story.title}
              </h1>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-px bg-white/40" />
                <span className="text-[11px] uppercase tracking-[0.15em] !text-white/55">
                  {formatDate(story.publishedDate)}
                </span>
              </div>
              <p className="!text-white/75 text-base md:text-[17px] leading-relaxed">
                {story.intro}
              </p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-8 md:right-12 flex flex-col items-center gap-2 text-white/30">
          <div className="w-px h-12 bg-white/20" />
          <span className="text-[9px] uppercase tracking-[0.2em] rotate-90 origin-center mt-2">
            Scroll
          </span>
        </div>
      </section>

      {/* Content */}
      <article className="bg-warm-white">
        <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
          <Link
            href="/verhalen"
            className="inline-block mb-10 text-accent font-semibold text-sm uppercase tracking-[0.1em]"
          >
            ← Alle verhalen
          </Link>

          <div className="text-text-muted text-lg leading-relaxed [&_p]:mb-5 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:text-forest [&_h2]:leading-snug [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-forest [&_h3]:mt-8 [&_h3]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_li]:mb-1 [&_a]:text-accent [&_a]:underline [&_strong]:text-forest [&_img]:rounded-xl [&_img]:my-6">
            <RichText data={story.content} />
          </div>

          {story.gallery && story.gallery.length > 0 && (
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-4">
              {story.gallery.map((item, i) => {
                const src =
                  item.image && typeof item.image === 'object' ? (item.image.url ?? '') : ''
                if (!src) return null
                return (
                  <figure key={i} className="overflow-hidden rounded-xl">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={src}
                        alt={item.caption ?? story.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    {item.caption && (
                      <figcaption className="mt-2 text-[12px] text-text-muted/60 uppercase tracking-[0.1em]">
                        {item.caption}
                      </figcaption>
                    )}
                  </figure>
                )
              })}
            </div>
          )}
        </div>
      </article>
    </main>
  )
}
