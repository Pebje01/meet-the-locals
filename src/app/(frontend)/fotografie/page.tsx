import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { PageHero } from '@/components/PageHero'
import type { Story } from '@/payload-types'

function storyImageUrl(img: Story['heroImage']): string {
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

export default async function FotografiePage() {
  const payload = await getPayload({ config })

  const [{ docs: fotoVerhalen }, { docs: tips }] = await Promise.all([
    payload.find({
      collection: 'stories',
      where: {
        status: { equals: 'published' },
        thema: { contains: 'reisfotografie' },
      },
      sort: '-publishedDate',
      depth: 1,
      limit: 6,
    }),
    payload.find({
      collection: 'photography-posts',
      where: { status: { equals: 'published' } },
      sort: '-publishedDate',
      depth: 1,
      limit: 6,
    }),
  ])

  return (
    <main className="min-h-screen bg-warm-white">
      <PageHero
        title="Fotografie"
        subtitle="Reisfotografie verhalen, compositietips en eerlijke gear reviews."
        image="/media/DSC_3088-scaled.webp"
        imageAlt="Reisfotografie landschap"
      />

      {/* Reisfotografie verhalen */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="block text-[11px] uppercase tracking-[0.15em] text-accent font-semibold mb-2">
                Diepte
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-forest leading-tight">
                Reisfotografie verhalen
              </h2>
            </div>
            <Link
              href="/verhalen"
              className="hidden md:inline-flex items-center gap-2 text-accent font-semibold text-sm uppercase tracking-[0.1em] hover:gap-3 transition-all"
            >
              Alle verhalen
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {fotoVerhalen.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-cream-dark rounded-2xl">
              <p className="text-text-muted">De eerste reisfotografie verhalen komen er aan.</p>
              <p className="text-text-muted/60 text-sm mt-1">
                Voeg een verhaal toe in het admin panel en tag het met &ldquo;Reisfotografie&rdquo;.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {fotoVerhalen.map((story, i) => (
                <Link
                  key={story.id}
                  href={`/verhalen/${story.slug}`}
                  className={`group block relative overflow-hidden rounded-2xl ${i === 0 ? 'lg:col-span-2' : ''}`}
                >
                  <div className={`relative ${i === 0 ? 'min-h-[480px]' : 'min-h-[320px]'}`}>
                    {storyImageUrl(story.heroImage) ? (
                      <Image
                        src={storyImageUrl(story.heroImage)}
                        alt={story.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        sizes={i === 0 ? '100vw' : '(max-width: 1024px) 100vw, 50vw'}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-forest/60" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute inset-0 flex items-end p-6 md:p-8">
                      <div className="w-full">
                        {story.eyebrow && (
                          <span className="block text-[10px] uppercase tracking-[0.15em] text-accent font-semibold mb-2">
                            {story.eyebrow}
                          </span>
                        )}
                        <h3
                          className={`font-display font-bold text-white leading-tight mb-2 group-hover:text-cream/90 transition-colors ${i === 0 ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-xl md:text-2xl'}`}
                        >
                          {story.title}
                        </h3>
                        {i === 0 && (
                          <p className="text-cream/70 text-sm md:text-base leading-relaxed line-clamp-2 mb-4 max-w-xl">
                            {story.intro}
                          </p>
                        )}
                        <span className="text-[10px] uppercase tracking-[0.15em] text-cream/50">
                          {formatDate(story.publishedDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <Link
            href="/verhalen"
            className="md:hidden mt-6 inline-flex items-center gap-2 text-accent font-semibold text-sm uppercase tracking-[0.1em]"
          >
            Alle verhalen
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Tips & Gear */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="mb-10">
            <span className="block text-[11px] uppercase tracking-[0.15em] text-accent font-semibold mb-2">
              Kennis
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-forest leading-tight">
              Tips & Inspiratie
            </h2>
          </div>

          {tips.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-cream-dark rounded-2xl">
              <p className="text-text-muted">Fotografie tips en gear reviews komen er aan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tips.map((tip) => {
                const img =
                  tip.heroImage && typeof tip.heroImage === 'object' ? (tip.heroImage.url ?? '') : ''
                return (
                  <article key={tip.id}>
                    <Link href={`/fotografie/blog/${tip.slug}`} className="group block card-lift">
                      {img && (
                        <div className="relative aspect-[4/3] organic-img overflow-hidden img-zoom mb-5">
                          <Image
                            src={img}
                            alt={tip.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[11px] uppercase tracking-[0.12em] text-accent font-semibold">
                            Fotografie
                          </span>
                          <span className="text-text-muted/50">|</span>
                          <span className="text-[11px] uppercase tracking-[0.15em] text-text-muted/70">
                            {formatDate(tip.publishedDate)}
                          </span>
                        </div>
                        <h3 className="text-xl font-serif font-bold text-forest mb-2 group-hover:text-accent transition-colors">
                          {tip.title}
                        </h3>
                        <p className="text-text-muted text-[15px] leading-relaxed line-clamp-2">
                          {tip.excerpt}
                        </p>
                      </div>
                    </Link>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
