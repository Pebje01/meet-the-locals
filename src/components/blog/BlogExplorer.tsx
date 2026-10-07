'use client'

import { useCallback, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Post } from '@/payload-types'
import { EmptyState } from '@/components/ui/EmptyState'
import { PostCard } from '@/components/ui/PostCard'
import { formatDate } from '@/lib/format'
import { imageUrl } from '@/lib/media'
import { WERELDDEEL_OPTIONS, THEMA_OPTIONS, labelFor } from '@/lib/taxonomy'

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
  const [activeFilter, setActiveFilterState] = useState<ActiveFilter>(initialFilter)

  // Het filter staat ook in de URL (?werelddeel=... of ?thema=...), zodat een
  // gefilterd overzicht te delen is en de homepage er direct naartoe kan
  // linken. replaceState houdt de pagina op de client, zonder nieuwe
  // serverronde en zonder dat de scrollpositie verspringt.
  const setActiveFilter = useCallback((filter: ActiveFilter) => {
    setActiveFilterState(filter)
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    url.searchParams.delete('werelddeel')
    url.searchParams.delete('thema')
    if (filter.type) url.searchParams.set(filter.type, filter.value)
    window.history.replaceState(window.history.state, '', url)
  }, [])

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

  const pillClass = (active: boolean) =>
    `pill shrink-0 ${active ? 'bg-forest text-cream' : 'bg-cream-dark/60 text-forest hover:bg-cream-dark'}`

  return (
    <>
      {posts.length > 0 && hasFilters && (
        <section className="bg-cream pb-2 pt-4 md:pt-6">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="no-scrollbar flex items-center gap-2.5 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveFilter({ type: '', value: '' })}
                aria-pressed={!hasActiveFilter}
                className={pillClass(!hasActiveFilter)}
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
                    className={pillClass(isActive)}
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
        <section className="px-6 py-20 md:py-28">
          <EmptyState
            title={posts.length === 0 ? 'Nog geen verhalen' : 'Niets gevonden'}
            text={
              posts.length === 0
                ? 'Er staan nog geen korte verhalen online. Kom snel terug.'
                : 'Geen verhalen gevonden voor dit filter.'
            }
          >
            {hasActiveFilter && posts.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveFilter({ type: '', value: '' })}
                className="font-btn mt-6 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-accent hover:text-accent-dark"
              >
                Filter wissen
              </button>
            )}
          </EmptyState>
        </section>
      )}

      {featured && (
        <section className="py-12 md:py-20">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <Link href={`/blog/${featured.slug}`} className="group block">
              <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
                <div className="relative aspect-[4/3] overflow-hidden organic-img img-zoom bg-cream-dark">
                  {imageUrl(featured.heroImage) && (
                    <Image
                      src={imageUrl(featured.heroImage)}
                      alt={featured.title}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  )}
                </div>
                <div>
                  {postBadge(featured) && (
                    <span className="pill mb-4 bg-accent/10 text-accent">{postBadge(featured)}</span>
                  )}
                  <h2 className="t-h2 mb-4 text-forest transition-colors group-hover:text-accent">
                    {featured.title}
                  </h2>
                  {featured.excerpt && <p className="t-lead mb-6 max-w-2xl text-text-muted">{featured.excerpt}</p>}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <span className="t-meta text-text-muted/70">{formatDate(featured.publishedDate)}</span>
                    <span className="font-btn inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-accent">
                      Lees verhaal
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
          <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
              {rest.map((post) => (
                <PostCard
                  key={post.id}
                  post={{
                    title: post.title,
                    href: `/blog/${post.slug}`,
                    image: imageUrl(post.heroImage),
                    excerpt: post.excerpt,
                    category: postBadge(post),
                    date: formatDate(post.publishedDate),
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
