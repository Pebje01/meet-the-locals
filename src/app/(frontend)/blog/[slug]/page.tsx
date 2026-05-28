import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Post } from '@/payload-types'
import { ArticleJsonLd } from '@/components/JsonLd'
import OrganicRectangle from '@/components/OrganicRectangle'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://meetthelocals.nl'

type Props = { params: Promise<{ slug: string }> }

function imageUrl(img: Post['heroImage']): string {
  return img && typeof img === 'object' ? (img.url ?? '') : ''
}

function formatDate(date?: string | null): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('nl-NL', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

/* ─── Lexical → JSX renderer ─────────────────────────────── */
type LexNode = {
  type: string
  tag?: string
  text?: string
  format?: number
  url?: string
  listType?: string
  value?: number
  children?: LexNode[]
}

function renderText(node: LexNode): React.ReactNode {
  let el: React.ReactNode = node.text ?? ''
  const fmt = node.format ?? 0
  if (fmt & 1)  el = <strong key="b">{el}</strong>
  if (fmt & 2)  el = <em key="i">{el}</em>
  if (fmt & 8)  el = <u key="u">{el}</u>
  if (fmt & 16) el = <s key="s">{el}</s>
  if (fmt & 32) el = <code key="c" className="bg-cream-dark/60 px-1.5 py-0.5 rounded text-[0.88em] font-mono text-forest">{el}</code>
  return el
}

function renderNodes(nodes: LexNode[], key?: string): React.ReactNode {
  return nodes.map((node, i) => renderNode(node, `${key ?? 'n'}-${i}`))
}

function renderNode(node: LexNode, key: string): React.ReactNode {
  const children = node.children ? renderNodes(node.children, key) : null

  switch (node.type) {
    case 'text':
      return <span key={key}>{renderText(node)}</span>

    case 'linebreak':
      return <br key={key} />

    case 'paragraph':
      if (!node.children?.length) return <br key={key} />
      return (
        <p key={key} className="mb-6 leading-[1.85] text-[17px] text-forest/80">
          {children}
        </p>
      )

    case 'heading': {
      const tag = node.tag ?? 'h2'
      if (tag === 'h2') return (
        <h2 key={key} className="font-display text-2xl md:text-3xl text-forest font-light leading-snug mt-12 mb-4 pb-3 border-b border-forest/10">
          {children}
        </h2>
      )
      if (tag === 'h3') return (
        <h3 key={key} className="font-display text-xl md:text-2xl text-forest font-light leading-snug mt-8 mb-3">
          {children}
        </h3>
      )
      return <h4 key={key} className="font-semibold text-forest text-lg mt-6 mb-2">{children}</h4>
    }

    case 'list': {
      const isOl = node.listType === 'number'
      const cls = isOl
        ? 'list-decimal pl-6 mb-6 space-y-2 text-[17px] text-forest/80'
        : 'mb-6 space-y-2 text-[17px] text-forest/80'
      if (isOl) return <ol key={key} className={cls}>{children}</ol>
      return <ul key={key} className={cls}>{children}</ul>
    }

    case 'listitem':
      return (
        <li key={key} className="flex items-start gap-2.5 leading-relaxed">
          {node.children?.[0]?.type !== 'list' && (
            <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-[9px]" />
          )}
          <span>{children}</span>
        </li>
      )

    case 'quote':
      return (
        <blockquote key={key} className="my-8 pl-6 border-l-4 border-accent/50 bg-cream-dark/40 py-4 pr-6 rounded-r-xl">
          <p className="text-forest/75 text-[17px] italic leading-relaxed">{children}</p>
        </blockquote>
      )

    case 'horizontalrule':
      return <hr key={key} className="my-10 border-forest/10" />

    case 'link': {
      const href = node.url ?? '#'
      const isExternal = href.startsWith('http')
      return (
        <a key={key} href={href} {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="text-accent underline underline-offset-2 hover:text-accent-dark transition-colors">
          {children}
        </a>
      )
    }

    default:
      return <span key={key}>{children}</span>
  }
}

function RenderRichText({ data }: { data: unknown }) {
  if (!data || typeof data !== 'object') return null
  const root = (data as { root?: { children?: LexNode[] } }).root
  if (!root?.children) return null
  return <>{renderNodes(root.children, 'root')}</>
}

/* ─── TOC extractie ──────────────────────────────────────── */
function extractHeadings(data: unknown): { text: string; tag: string }[] {
  if (!data || typeof data !== 'object') return []
  const root = (data as { root?: { children?: LexNode[] } }).root
  if (!root?.children) return []

  const headings: { text: string; tag: string }[] = []
  for (const node of root.children) {
    if (node.type === 'heading' && node.children) {
      const text = node.children.map(c => c.text ?? '').join('')
      if (text) headings.push({ text, tag: node.tag ?? 'h2' })
    }
  }
  return headings
}

function headingSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

/* ─── Metadata ───────────────────────────────────────────── */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    depth: 1, limit: 1,
  })
  const post = docs[0]
  if (!post) return { title: 'Artikel niet gevonden' }

  const hero = imageUrl(post.heroImage)
  const heroAbsolute = hero ? (hero.startsWith('http') ? hero : `${SITE_URL}${hero}`) : undefined

  return {
    title: `${post.title} | Meet the Locals`,
    description: post.excerpt ?? '',
    alternates: { canonical: `${SITE_URL}/blog/${slug}` },
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

/* ─── Pagina ─────────────────────────────────────────────── */
export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    depth: 1, limit: 1,
  })

  const post = docs[0]
  if (!post) notFound()

  const hero = imageUrl(post.heroImage)
  const headings = extractHeadings(post.content)

  // Gerelateerde posts: zelfde werelddeel, andere slug
  const { docs: related } = await payload.find({
    collection: 'posts',
    where: {
      status: { equals: 'published' },
      slug: { not_equals: post.slug },
      ...(post.werelddeel ? { werelddeel: { equals: post.werelddeel } } : {}),
    },
    sort: '-publishedDate',
    depth: 1,
    limit: 3,
  })

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

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative h-[75vh] min-h-[520px] flex items-end overflow-hidden bg-forest-dark">
        {hero ? (
          <Image
            src={hero}
            alt={post.title}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-forest" />
        )}
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(15,29,15,0.55) 100%)' }} />

        <div className="relative z-10 w-full pb-12 md:pb-16">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <Link href="/blog"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white text-[11px] uppercase tracking-[0.18em] font-semibold mb-6 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Alle blogs
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[11px] uppercase tracking-[0.2em] text-accent font-semibold">
                {post.werelddeel === 'europe' ? 'Europa'
                  : post.werelddeel === 'asia' ? 'Azië'
                  : post.werelddeel === 'africa' ? 'Afrika'
                  : post.werelddeel === 'north-america' ? 'Noord-Amerika'
                  : post.werelddeel === 'south-america' ? 'Zuid-Amerika'
                  : post.werelddeel === 'oceania' ? 'Oceanië'
                  : 'Reisverhaal'}
              </span>
              <span className="text-white/30 text-xs">·</span>
              <span className="text-[11px] uppercase tracking-[0.15em] text-white/50">
                {formatDate(post.publishedDate)}
              </span>
            </div>
            <h1
              className="!text-white !font-normal leading-[1.05] drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)] max-w-4xl"
              style={{ fontSize: 'clamp(2.2rem, 5.5vw, 5rem)' }}
            >
              {post.title}
            </h1>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-[40px] md:h-[60px] block">
            <path d="M0,60 L0,45 C240,35 480,55 720,45 C960,35 1200,52 1440,42 L1440,60 Z" fill="var(--color-warm-white)" />
          </svg>
        </div>
      </section>

      {/* ── CONTENT + SIDEBAR ────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">

          {/* Artikel */}
          <article className="min-w-0 flex-1">
            {/* Lead */}
            {post.excerpt && (
              <p className="text-[19px] md:text-xl text-forest/70 leading-relaxed font-light mb-10 pb-10 border-b border-forest/10">
                {post.excerpt}
              </p>
            )}

            {/* Rijke tekst */}
            <div className="prose-mtl">
              <RenderRichText data={post.content} />
            </div>

            {/* Tags */}
            {(post.thema as string[] | null | undefined)?.length ? (
              <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-forest/10">
                {(post.thema as string[]).map((t) => (
                  <span key={t} className="px-4 py-1.5 bg-cream-dark/60 text-forest/60 text-[12px] uppercase tracking-[0.1em] rounded-full">
                    {t.replace(/-/g, ' ')}
                  </span>
                ))}
              </div>
            ) : null}
          </article>

          {/* Sidebar */}
          <aside className="lg:w-[300px] xl:w-[320px] flex-shrink-0">
            <div className="sticky top-24 flex flex-col gap-6">

              {/* TOC */}
              {headings.length > 1 && (
                <OrganicRectangle className="p-7">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-forest/40 font-semibold mb-4">
                    In dit artikel
                  </p>
                  <ul className="space-y-2.5">
                    {headings.map((h, i) => (
                      <li key={i}>
                        <a href={`#${headingSlug(h.text)}`}
                          className={`block text-[14px] leading-snug hover:text-accent transition-colors ${h.tag === 'h3' ? 'pl-3 text-forest/50' : 'text-forest/70 font-medium'}`}>
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </OrganicRectangle>
              )}

              {/* Auteur */}
              <div className="bg-accent rounded-2xl p-7 overflow-hidden relative">
                <div className="absolute inset-0 pointer-events-none"
                  style={{ backgroundImage: "url('/textures/grain.webp')", backgroundSize: '600px', backgroundRepeat: 'repeat', opacity: 0.5, mixBlendMode: 'overlay' as const }} />
                <div className="relative z-10">
                  {/* Bovenste rij: foto links, naam rechts */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-cream/30">
                      <Image
                        src="/media/portretje-400x300.png"
                        alt="Daley Jansen"
                        width={80} height={80}
                        className="object-cover object-top w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-cream/60 mb-1">Over de auteur</p>
                      <p className="font-display text-cream text-base font-light">Daley Jansen</p>
                    </div>
                  </div>
                  {/* Bio tekst onder, volle breedte */}
                  <p className="text-cream/75 text-[12px] leading-relaxed mb-5">
                    Fotograaf, marketeer en vormgever. Legt de wereld vast zoals zij hem ziet. Wil in een wereld vol AI juist de echtheid laten zien.
                  </p>
                  <Link href="/over"
                    className="inline-flex items-center gap-1.5 text-cream text-[11px] uppercase tracking-[0.1em] font-semibold hover:gap-2.5 transition-all">
                    Lees mijn verhaal
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </div>

              {/* Nieuwsbrief mini */}
              <div className="bg-cream-dark/40 rounded-2xl p-6 border border-forest/8">
                <p className="text-[10px] uppercase tracking-[0.2em] text-forest/40 font-semibold mb-2">Nieuwsbrief</p>
                <p className="text-forest/70 text-[14px] leading-relaxed mb-4">
                  Nieuwe verhalen direct in je inbox?
                </p>
                <Link href="/#nieuwsbrief"
                  className="block text-center bg-accent text-white text-[12px] uppercase tracking-[0.1em] font-semibold py-3 rounded-xl hover:bg-accent-dark transition-colors">
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
            <h2 className="font-display text-2xl md:text-3xl text-forest font-light mb-10">
              Meer uit{' '}
              {post.werelddeel === 'europe' ? 'Europa'
                : post.werelddeel === 'asia' ? 'Azië'
                : post.werelddeel === 'africa' ? 'Afrika'
                : post.werelddeel === 'north-america' ? 'Noord-Amerika'
                : post.werelddeel === 'south-america' ? 'Zuid-Amerika'
                : post.werelddeel === 'oceania' ? 'Oceanië'
                : 'de blog'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => {
                const rImg = imageUrl(r.heroImage)
                return (
                  <Link key={r.id} href={`/blog/${r.slug}`} className="group block">
                    <div className="aspect-[4/3] organic-img overflow-hidden relative mb-4">
                      {rImg ? (
                        <Image src={rImg} alt={r.title} fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                          sizes="(max-width: 768px) 100vw, 33vw" />
                      ) : (
                        <div className="absolute inset-0 bg-forest/20" />
                      )}
                    </div>
                    <p className="text-[11px] uppercase tracking-[0.15em] text-text-muted/50 mb-1.5">
                      {formatDate(r.publishedDate)}
                    </p>
                    <h3 className="font-display text-lg text-forest font-light leading-snug group-hover:text-accent transition-colors">
                      {r.title}
                    </h3>
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
