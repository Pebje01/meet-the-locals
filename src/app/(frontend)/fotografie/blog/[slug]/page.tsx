import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Media, PhotographyPost } from '@/payload-types'
import { RichText } from '@/components/blog/RichText'
import { AuthorByline } from '@/components/AuthorByline'
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://meetthelocals.nl'

type Props = { params: Promise<{ slug: string }> }

const CATEGORY_LABELS: Record<PhotographyPost['photoCategory'], string> = {
  'tips-tutorials': 'Tips & Tutorials',
  'gear-reviews': 'Gear Reviews',
  'behind-the-lens': 'Behind the Lens',
  'editing-post-processing': 'Editing & Post-processing',
}

function imageUrl(img: number | Media | null | undefined): string {
  return img && typeof img === 'object' ? (img.url ?? '') : ''
}

function formatDate(date?: string | null): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
}

async function getPost(slug: string): Promise<PhotographyPost | null> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'photography-posts',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    depth: 1,
    limit: 1,
  })
  return docs[0] ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Artikel niet gevonden', robots: { index: false } }

  const title = post.seo?.metaTitle || `${post.title} | Meet the Locals`
  const description = post.seo?.metaDescription || post.excerpt
  const image = imageUrl(post.seo?.ogImage) || imageUrl(post.heroImage)
  const url = `${SITE_URL}/fotografie/blog/${slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: 'article',
      url,
      publishedTime: post.publishedDate,
      ...(image && { images: [{ url: image.startsWith('http') ? image : `${SITE_URL}${image}`, alt: post.title }] }),
    },
  }
}

export default async function FotografieBlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const hero = imageUrl(post.heroImage)

  return (
    <main className="min-h-screen bg-warm-white">
      <ArticleJsonLd
        title={post.title}
        description={post.seo?.metaDescription || post.excerpt}
        slug={slug}
        image={hero}
        datePublished={post.publishedDate}
        dateModified={post.updatedAt}
        basePath="/fotografie/blog"
        category={CATEGORY_LABELS[post.photoCategory]}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Fotografie', url: '/fotografie' },
          { name: 'Fotografie blog', url: '/fotografie/blog' },
          { name: post.title, url: `/fotografie/blog/${slug}` },
        ]}
      />

      <section className="relative h-[65vh] min-h-[460px] flex items-end overflow-hidden bg-forest-dark">
        {hero && <Image src={hero} alt={post.title} fill priority className="object-cover object-center" sizes="100vw" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="relative z-10 w-full pb-12 md:pb-16">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <Link
              href="/fotografie/blog"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white text-[11px] uppercase tracking-[0.18em] font-semibold mb-6 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Fotografie blog
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] uppercase tracking-[0.2em] text-accent font-semibold">{CATEGORY_LABELS[post.photoCategory]}</span>
              <span className="text-white/30 text-xs">·</span>
              <time dateTime={post.publishedDate} className="text-[11px] uppercase tracking-[0.15em] text-white/50">
                {formatDate(post.publishedDate)}
              </time>
            </div>
            <h1 className="!text-white !font-normal leading-[1.05] max-w-4xl" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 5rem)' }}>
              {post.title}
            </h1>
          </div>
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <p className="text-[19px] md:text-xl text-forest/70 leading-relaxed font-light mb-10 pb-10 border-b border-forest/10">{post.excerpt}</p>
        <RichText data={post.content} />
        <AuthorByline />
      </article>
    </main>
  )
}
