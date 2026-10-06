'use client'

import { useCallback, useRef, useState } from 'react'
import { PhotoCard } from '@/components/ui/PhotoCard'
import { TextLink } from '@/components/ui/TextLink'

export type SliderDestination = {
  name: string
  image: string
  slug: string
  /** Bijvoorbeeld "3 artikelen". Leeg laten als er nog niets over staat. */
  count?: string
}

/**
 * Gutter van de content (px-6, vanaf lg px-10), plus de ruimte naast de
 * 1400px-container op brede schermen. Zo staat de eerste kaart precies onder
 * de titel, terwijl de slider zelf tot de schermrand doorloopt.
 */
const GUTTER =
  'px-[max(1.5rem,calc((100vw-1400px)/2+1.5rem))] lg:px-[max(2.5rem,calc((100vw-1400px)/2+2.5rem))]'

function ArrowButton({ direction, disabled, onClick }: { direction: 'left' | 'right'; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'left' ? 'Vorige bestemmingen' : 'Volgende bestemmingen'}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-white/10"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d={direction === 'left' ? 'M19 12H5M5 12l6-6M5 12l6 6' : 'M5 12h14M19 12l-6-6M19 12l-6 6'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

export function DestinationSlider({ destinations }: { destinations: SliderDestination[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }, [])

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'right' ? 400 : -400, behavior: 'smooth' })
  }

  return (
    <>
      <div className="mx-auto mb-12 max-w-[1400px] px-6 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="t-h2 text-cream">Recent bezochte bestemmingen</h2>
          <div className="flex items-center gap-5">
            <div className="flex gap-2">
              <ArrowButton direction="left" disabled={!canScrollLeft} onClick={() => scroll('left')} />
              <ArrowButton direction="right" disabled={!canScrollRight} onClick={() => scroll('right')} />
            </div>
            <div aria-hidden className="h-5 w-px bg-cream/20" />
            <TextLink href="/bestemmingen" tone="light">
              Alle bestemmingen
            </TextLink>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className={`no-scrollbar flex gap-5 overflow-x-auto scroll-smooth md:gap-6 ${GUTTER}`}
      >
        {destinations.map((dest) => (
          <PhotoCard
            key={dest.slug}
            href={`/bestemmingen/${dest.slug}`}
            image={dest.image}
            alt={dest.name}
            title={dest.name}
            meta={dest.count || undefined}
            sizes="(max-width: 768px) 78vw, 360px"
            className="w-[min(78vw,300px)] shrink-0 md:w-[360px]"
          />
        ))}
      </div>
    </>
  )
}
