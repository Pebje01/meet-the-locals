import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Post } from '@/payload-types'
import { ArticleJsonLd } from '@/components/JsonLd'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://meetthelocals.nl'

type Props = {
  params: Promise<{ slug: string }>
}

function imageUrl(img: Post['heroImage']): string {
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'posts',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    depth: 1,
    limit: 1,
  })
  const post = docs[0]
  if (!post) return { title: 'Artikel niet gevonden' }

  const hero = imageUrl(post.heroImage)
  const heroAbsolute = hero ? (hero.startsWith('http') ? hero : `${SITE_URL}${hero}`) : undefined

  return {
    title: `${post.title} | Meet the Locals`,
    description: post.excerpt ?? '',
    alternates: {
      canonical: `${SITE_URL}/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt ?? '',
      type: 'article',
      url: `${SITE_URL}/blog/${slug}`,
      publishedTime: post.publishedDate ?? undefined,
      modifiedTime: post.updatedAt,
      authors: ['Daley Jansen'],
      siteName: 'Meet the Locals',
      ...(heroAbsolute && { images: [{ url: heroAbsolute, alt: post.title }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt ?? '',
      ...(heroAbsolute && { images: [heroAbsolute] }),
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'posts',
    where: {
      slug: { equals: slug },
      status: { equals: 'published' },
    },
    depth: 1,
    limit: 1,
  })

  const post = docs[0]
  if (!post) notFound()

  const hero = imageUrl(post.heroImage)

  return (
    <main className="min-h-screen bg-warm-white">
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt ?? ''}
        slug={post.slug}
        image={hero}
        datePublished={post.publishedDate ?? post.updatedAt}
        dateModified={post.updatedAt}
      />
      <article className="mx-auto max-w-[1400px] px-6 py-20 md:py-28 lg:px-10">
        <Link
          href="/blog"
          className="inline-block mb-8 text-accent font-semibold text-sm uppercase tracking-[0.1em]"
        >
          ← Terug naar reistips
        </Link>

        <h1 className="text-4xl md:text-5xl font-display font-bold text-forest leading-[1.1] mb-4">
          {post.title}
        </h1>

        <p className="text-[12px] uppercase tracking-[0.15em] text-text-muted/70 mb-8">
          {formatDate(post.publishedDate)}
        </p>

        {hero && (
          <div className="relative aspect-[16/9] organic-img overflow-hidden mb-10">
            <Image
              src={hero}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        <div className="max-w-3xl text-text-muted text-lg leading-relaxed [&_p]:mb-5 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:text-forest [&_h2]:leading-snug [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-forest [&_h3]:mt-8 [&_h3]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_li]:mb-1 [&_a]:text-accent [&_a]:underline [&_strong]:text-forest [&_img]:rounded-xl [&_img]:my-6">
          <RichText data={post.content} />
        </div>
      </article>
    </main>
  )
}
