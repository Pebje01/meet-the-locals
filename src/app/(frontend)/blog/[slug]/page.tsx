import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Media, Post } from '@/payload-types'
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd'
import OrganicRectangle from '@/components/OrganicRectangle'
import { RichText, extractHeadings } from '@/components/blog/RichText'
import { publishedPostsWhere } from '@/lib/queries'
import { THEMA_OPTIONS, WERELDDEEL_OPTIONS, labelFor } from '@/lib/taxonomy'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://meetthelocals.nl'

type Props = { params: Promise<{ slug: string }> }

function imageUrl(img: number | Media | null | undefined): string {
  return img && typeof img === 'object' ? (img.url ?? '') : ''
}

function absoluteUrl(path: string): string {
  return path.startsWith('http') ? path : `${SITE_URL}${path}`
}

function formatDate(date?: string | null): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
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
    <main className="min-h-screen bg-warm-white">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(15,29,15,0.55) 100%)' }}
        />

        <div className="relative z-10 w-full pb-12 md:pb-16">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white text-[11px] uppercase tracking-[0.18em] font-semibold mb-6 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Alle korte verhalen
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] uppercase tracking-[0.2em] text-accent font-semibold">
                {werelddeelLabel || 'Reisverhaal'}
              </span>
              <span className="text-white/30 text-xs">·</span>
              <time dateTime={post.publishedDate} className="text-[11px] uppercase tracking-[0.15em] text-white/50">
                {formatDate(post.publishedDate)}
              </time>
            </div>
            <h1
              className="!text-white !font-normal leading-[1.05] drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)] max-w-4xl"
              style={{ fontSize: 'clamp(2.2rem, 5.5vw, 5rem)' }}
            >
              {post.title}
            </h1>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-[40px] md:h-[60px] block" aria-hidden="true">
            <path d="M0,60 L0,45 C240,35 480,55 720,45 C960,35 1200,52 1440,42 L1440,60 Z" fill="var(--color-warm-white)" />
          </svg>
        </div>
      </section>

      {/* ── CONTENT + SIDEBAR ────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
          <article className="min-w-0 flex-1">
            {post.excerpt && (
              <p className="text-[19px] md:text-xl text-forest/70 leading-relaxed font-light mb-10 pb-10 border-b border-forest/10">
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
                    className="px-4 py-1.5 bg-cream-dark/60 text-forest/60 hover:bg-forest hover:text-cream transition-colors text-[12px] uppercase tracking-[0.1em] rounded-full"
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
                <OrganicRectangle className="p-7">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-forest/40 font-semibold mb-4">In dit artikel</p>
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
                </OrganicRectangle>
              )}

              {/* Auteur */}
              <div className="bg-accent rounded-2xl p-7 overflow-hidden relative">
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: "url('/textures/grain.webp')",
                    backgroundSize: '600px',
                    backgroundRepeat: 'repeat',
                    opacity: 0.5,
                    mixBlendMode: 'overlay' as const,
                  }}
                />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-cream/30">
                      <Image src="/media/daley-jansen.webp" alt="Daley Jansen" width={80} height={80} className="object-cover object-center w-full h-full" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-cream/60 mb-1">Over de auteur</p>
                      <p className="font-display text-cream text-base font-light">Daley Jansen</p>
                    </div>
                  </div>
                  <p className="text-cream/75 text-[12px] leading-relaxed mb-5">
                    Fotograaf, marketeer en vormgever. Legt de wereld vast zoals zij hem ziet. Wil in een wereld vol AI juist de echtheid laten zien.
                  </p>
                  <Link href="/over" className="inline-flex items-center gap-1.5 text-cream text-[11px] uppercase tracking-[0.1em] font-semibold hover:gap-2.5 transition-all">
                    Lees mijn verhaal
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Nieuwsbrief mini */}
              <div className="bg-cream-dark/40 rounded-2xl p-6 border border-forest/8">
                <p className="text-[10px] uppercase tracking-[0.2em] text-forest/40 font-semibold mb-2">Nieuwsbrief</p>
                <p className="text-forest/70 text-[14px] leading-relaxed mb-4">Nieuwe verhalen direct in je inbox?</p>
                <Link
                  href="/reisnieuws#nieuwsbrief"
                  className="block text-center bg-accent text-white text-[12px] uppercase tracking-[0.1em] font-semibold py-3 rounded-xl hover:bg-accent-dark transition-colors"
                >
                  Schrijf je in
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── GERELATEERDE POSTS ────────────────────────────── */}
      {related.length > 0 && (
        <section className="bg-cream-dark/30 border-t border-forest/8 py-16 md:py-20">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <h2 className="text-2xl md:text-3xl text-forest mb-10">
              Meer uit {werelddeelLabel || 'de blog'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => {
                const rImg = imageUrl(r.heroImage)
                return (
                  <Link key={r.id} href={`/blog/${r.slug}`} className="group block">
                    <div className="aspect-[4/3] organic-img overflow-hidden relative mb-4">
                      {rImg ? (
                        <Image
                          src={rImg}
                          alt={r.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-forest/20" />
                      )}
                    </div>
                    <p className="text-[11px] uppercase tracking-[0.15em] text-text-muted/50 mb-1.5">{formatDate(r.publishedDate)}</p>
                    <h3 className="text-lg text-forest leading-snug group-hover:text-accent transition-colors">{r.title}</h3>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
