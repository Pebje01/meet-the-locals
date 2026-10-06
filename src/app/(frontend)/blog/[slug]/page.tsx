import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Post } from '@/payload-types'
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd'
import { OrganicEdge } from '@/components/OrganicEdge'
import { RichText, extractHeadings } from '@/components/blog/RichText'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { PostCard } from '@/components/ui/PostCard'
import { TextLink } from '@/components/ui/TextLink'
import { formatDate } from '@/lib/format'
import { imageUrl } from '@/lib/media'
import { publishedPostsWhere } from '@/lib/queries'
import { THEMA_OPTIONS, WERELDDEEL_OPTIONS, labelFor } from '@/lib/taxonomy'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://meetthelocals.nl'

type Props = { params: Promise<{ slug: string }> }

function absoluteUrl(path: string): string {
  return path.startsWith('http') ? path : `${SITE_URL}${path}`
}

async function getPost(slug: string): Promise<Post | null> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'posts',
    where: { and: [{ slug: { equals: slug } }, publishedPostsWhere()] },
    depth: 1,
    limit: 1,
  })
  return docs[0] ?? null
}

/* ─── Metadata ───────────────────────────────────────────── */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Artikel niet gevonden' }

  // De SEO-velden uit het CMS gaan voor; zonder invulling vallen we terug op
  // titel, samenvatting en hero-afbeelding.
  const title = post.seo?.metaTitle || `${post.title} | Meet the Locals`
  const description = post.seo?.metaDescription || post.excerpt || ''
  const image = imageUrl(post.seo?.ogImage) || imageUrl(post.heroImage)
  const url = `${SITE_URL}/blog/${slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: 'article',
      url,
      publishedTime: post.publishedDate ?? undefined,
      modifiedTime: post.updatedAt,
      authors: ['Daley Jansen'],
      siteName: 'Meet the Locals',
      ...(image && { images: [{ url: absoluteUrl(image), alt: post.title }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(image && { images: [absoluteUrl(image)] }),
    },
  }
}

/* ─── Pagina ─────────────────────────────────────────────── */
export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const hero = imageUrl(post.heroImage)
  const headings = extractHeadings(post.content)
  const werelddeelLabel = labelFor(WERELDDEEL_OPTIONS, post.werelddeel)
  const themas = (post.thema ?? []).map((value) => ({ value, label: labelFor(THEMA_OPTIONS, value) })).filter((t) => t.label)

  // Gerelateerde posts: zelfde werelddeel, andere slug
  const payload = await getPayload({ config })
  const { docs: related } = await payload.find({
    collection: 'posts',
    where: {
      and: [
        publishedPostsWhere(),
        { slug: { not_equals: post.slug } },
        ...(post.werelddeel ? [{ werelddeel: { equals: post.werelddeel } }] : []),
      ],
    },
    sort: '-publishedDate',
    depth: 1,
    limit: 3,
  })

  return (
    <main className="min-h-screen bg-cream">
      <ArticleJsonLd
        title={post.title}
        description={post.seo?.metaDescription || post.excerpt || ''}
        slug={post.slug}
        image={hero}
        datePublished={post.publishedDate ?? post.updatedAt}
        dateModified={post.updatedAt}
        {...(themas.length ? { keywords: themas.map((t) => t.label) } : {})}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Korte verhalen', url: '/blog' },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
      />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative h-[75vh] min-h-[520px] flex items-end overflow-hidden bg-forest-dark">
        {hero ? (
          <Image src={hero} alt={post.title} fill priority className="object-cover object-center" sizes="100vw" />
        ) : (
          <div className="absolute inset-0 bg-forest" />
        )}
        <div aria-hidden className="absolute inset-0 photo-overlay" />

        <div className="relative z-10 w-full pb-16 md:pb-24">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <TextLink href="/blog" tone="light" direction="left" className="mb-6">
              Alle korte verhalen
            </TextLink>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Eyebrow>{werelddeelLabel || 'Reisverhaal'}</Eyebrow>
              <span aria-hidden className="text-xs text-white/30">·</span>
              <time dateTime={post.publishedDate} className="t-meta text-white/60">
                {formatDate(post.publishedDate, 'long')}
              </time>
            </div>
            <h1 className="t-h1 max-w-4xl text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)]">{post.title}</h1>
          </div>
        </div>

        <OrganicEdge fill="var(--color-cream)" className="h-[36px] md:h-[64px]" />
      </section>

      {/* ── CONTENT + SIDEBAR ────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
          <article className="min-w-0 flex-1">
            {post.excerpt && (
              <p className="t-lead mb-10 border-b border-forest/10 pb-10 font-light text-forest/70 md:text-xl">
                {post.excerpt}
              </p>
            )}

            <div className="prose-mtl">
              <RichText data={post.content} />
            </div>

            {themas.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-forest/10">
                {themas.map((t) => (
                  <Link
                    key={t.value}
                    href={`/blog?thema=${t.value}`}
                    className="pill bg-cream-dark/60 text-forest/70 hover:bg-forest hover:text-cream"
                  >
                    {t.label}
                  </Link>
                ))}
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:w-[300px] xl:w-[320px] flex-shrink-0">
            <div className="sticky top-24 flex flex-col gap-6">
              {headings.length > 1 && (
                <nav aria-label="In dit artikel" className="rounded-3xl border border-forest/10 bg-white/60 p-7 natural-shadow-box">
                  <Eyebrow tone="muted" as="p" className="mb-4">In dit artikel</Eyebrow>
                  <ul className="space-y-2.5">
                    {headings.map((h) => (
                      <li key={h.id}>
                        <a
                          href={`#${h.id}`}
                          className={`block text-[14px] leading-snug hover:text-accent transition-colors ${
                            h.tag === 'h3' ? 'pl-3 text-forest/50' : 'text-forest/70 font-medium'
                          }`}
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}

              {/* Auteur */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent to-accent-deep p-7">
                <div aria-hidden className="grain-layer" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-cream/30">
                      <Image src="/media/daley-jansen.webp" alt="Daley Jansen" width={80} height={80} className="object-cover object-center w-full h-full" />
                    </div>
                    <div>
                      <Eyebrow tone="light" as="p" className="mb-1">Over de auteur</Eyebrow>
                      <p className="font-display text-cream text-base font-light">Daley Jansen</p>
                    </div>
                  </div>
                  <p className="mb-5 text-[14px] leading-relaxed text-cream/80">
                    Fotograaf, marketeer en vormgever. Legt de wereld vast zoals zij hem ziet. Wil in een wereld vol AI juist de echtheid laten zien.
                  </p>
                  <TextLink href="/over" tone="light">
                    Lees mijn verhaal
                  </TextLink>
                </div>
              </div>

              {/* Nieuwsbrief mini */}
              <div className="relative overflow-hidden rounded-3xl border border-forest/10 bg-cream-dark/50 p-7">
                <div aria-hidden className="grain-layer" />
                <div className="relative">
                  <Eyebrow tone="muted" as="p" className="mb-2">Nieuwsbrief</Eyebrow>
                  <p className="mb-5 text-[15px] leading-relaxed text-forest/75">Nieuwe verhalen direct in je inbox?</p>
                  <Button href="/reisnieuws#nieuwsbrief" size="sm" className="w-full">
                    Schrijf je in
                  </Button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── GERELATEERDE POSTS ────────────────────────────── */}
      {related.length > 0 && (
        <section className="border-t border-forest/10 bg-cream-dark/40 py-16 md:py-20">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <h2 className="t-h3 mb-10 text-forest">Meer uit {werelddeelLabel || 'de blog'}</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {related.map((r) => (
                <PostCard
                  key={r.id}
                  post={{
                    title: r.title,
                    href: `/blog/${r.slug}`,
                    image: imageUrl(r.heroImage),
                    date: formatDate(r.publishedDate),
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
