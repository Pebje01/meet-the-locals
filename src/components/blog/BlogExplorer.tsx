'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Post } from '@/payload-types'
import { WERELDDEEL_OPTIONS, THEMA_OPTIONS, labelFor } from '@/lib/taxonomy'

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

function postBadge(post: Post): string {
  const thema = post.thema?.[0]
  if (thema) return labelFor(THEMA_OPTIONS, thema)
  return labelFor(WERELDDEEL_OPTIONS, post.werelddeel)
}

type ActiveFilter = { type: 'werelddeel' | 'thema' | ''; value: string }

export function BlogExplorer({
  posts,
  initialFilter = { type: '', value: '' },
}: {
  posts: Post[]
  initialFilter?: ActiveFilter
}) {
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>(initialFilter)

  const { allOptions } = useMemo(() => {
    const usedWerelddeel = new Set<string>()
    const usedThema = new Set<string>()
    for (const post of posts) {
      if (post.werelddeel) usedWerelddeel.add(post.werelddeel)
      for (const value of post.thema ?? []) usedThema.add(value)
    }
    return {
      allOptions: [
        ...WERELDDEEL_OPTIONS.filter((o) => usedWerelddeel.has(o.value)).map((o) => ({
          ...o,
          filterType: 'werelddeel' as const,
        })),
        ...THEMA_OPTIONS.filter((o) => usedThema.has(o.value)).map((o) => ({
          ...o,
          filterType: 'thema' as const,
        })),
      ],
    }
  }, [posts])

  const filtered = useMemo(
    () =>
      posts.filter((post) => {
        if (activeFilter.type === '') return true
        if (activeFilter.type === 'werelddeel') return post.werelddeel === activeFilter.value
        return (post.thema ?? []).some((value) => value === activeFilter.value)
      }),
    [posts, activeFilter],
  )

  const featured = filtered[0]
  const rest = filtered.slice(1)
  const hasActiveFilter = activeFilter.type !== ''
  const hasFilters = allOptions.length > 0

  return (
    <>
      {posts.length > 0 && hasFilters && (
        <section className="py-5 border-b border-cream-dark/50 bg-warm-white">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveFilter({ type: '', value: '' })}
                aria-pressed={!hasActiveFilter}
                className={`flex-shrink-0 px-5 py-2 organic-btn text-[12px] uppercase tracking-[0.1em] font-semibold transition-colors ${
                  !hasActiveFilter
                    ? 'bg-forest text-cream'
                    : 'bg-cream text-forest hover:bg-cream-dark/50'
                }`}
              >
                Alles
              </button>
              {allOptions.map((option) => {
                const isActive =
                  activeFilter.type === option.filterType && activeFilter.value === option.value
                return (
                  <button
                    key={`${option.filterType}-${option.value}`}
                    type="button"
                    onClick={() =>
                      setActiveFilter({ type: option.filterType, value: option.value })
                    }
                    aria-pressed={isActive}
                    className={`flex-shrink-0 px-5 py-2 organic-btn text-[12px] uppercase tracking-[0.1em] font-semibold transition-colors ${
                      isActive
                        ? 'bg-forest text-cream'
                        : 'bg-cream text-forest hover:bg-cream-dark/50'
                    }`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {filtered.length === 0 && (
        <section className="py-24 md:py-32">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
            <p className="text-text-muted text-lg">
              {posts.length === 0
                ? 'Er zijn nog geen gepubliceerde verhalen. Kom snel terug.'
                : 'Geen verhalen gevonden voor deze combinatie van filters.'}
            </p>
            {hasActiveFilter && posts.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveFilter({ type: '', value: '' })}
                className="mt-5 inline-flex items-center gap-2 text-accent font-semibold text-sm uppercase tracking-[0.1em]"
              >
                Filters wissen
              </button>
            )}
          </div>
        </section>
      )}

      {featured && (
        <section className="py-16 md:py-24">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <Link href={`/blog/${featured.slug}`} className="group block">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="relative aspect-[4/3] organic-img overflow-hidden img-zoom">
                  {imageUrl(featured.heroImage) && (
                    <Image
                      src={imageUrl(featured.heroImage)}
                      alt={featured.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  )}
                </div>
                <div>
                  {postBadge(featured) && (
                    <span className="font-btn inline-block px-3 py-1 bg-accent/10 text-accent text-[11px] uppercase tracking-[0.12em] font-semibold rounded-full mb-4">
                      {postBadge(featured)}
                    </span>
                  )}
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-forest leading-[1.1] mb-4 group-hover:text-accent transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-text-muted text-lg leading-relaxed mb-6 max-w-5xl">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="font-btn text-[11px] uppercase tracking-[0.15em] text-text-muted/70">
                      {formatDate(featured.publishedDate)}
                    </span>
                    <span className="font-btn group-hover:translate-x-1 transition-transform inline-flex items-center gap-2 text-accent font-semibold text-sm uppercase tracking-[0.1em]">
                      Lees meer
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M5 12h14M13 6l6 6-6 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section className="pb-24 md:pb-32">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rest.map((post) => (
                <article key={post.id}>
                  <Link href={`/blog/${post.slug}`} className="group block card-lift">
                    <div className="relative aspect-[4/3] organic-img overflow-hidden img-zoom mb-5">
                      {imageUrl(post.heroImage) && (
                        <Image
                          src={imageUrl(post.heroImage)}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        {postBadge(post) && (
                          <>
                            <span className="font-btn text-[11px] uppercase tracking-[0.12em] text-accent font-semibold">
                              {postBadge(post)}
                            </span>
                            <span className="text-text-muted/50">|</span>
                          </>
                        )}
                        <span className="font-btn text-[11px] uppercase tracking-[0.15em] text-text-muted/70">
                          {formatDate(post.publishedDate)}
                        </span>
                      </div>
                      <h3 className="text-xl font-serif font-bold text-forest mb-2 group-hover:text-accent transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-text-muted text-[15px] leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
