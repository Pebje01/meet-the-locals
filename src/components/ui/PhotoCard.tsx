import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * Foto met titel erover, voor bestemmingen en fotoverhalen.
 * De tekst staat altijd op het vaste `photo-overlay`-verloop, zodat hij op
 * elke foto leesbaar is. `aspect` bepaalt de verhouding, `shape` de hoeken.
 */
export function PhotoCard({
  href,
  image,
  alt,
  title,
  eyebrow,
  meta,
  aspect = 'aspect-[3/4]',
  shape = 'organic-img',
  sizes = '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw',
  priority = false,
  className = '',
  children,
}: {
  href: string
  image: string
  alt: string
  title: ReactNode
  /** Klein label linksboven, bijvoorbeeld de regio. */
  eyebrow?: string
  /** Regel onder de titel, bijvoorbeeld "3 artikelen". */
  meta?: string
  aspect?: string
  shape?: 'organic-img' | 'organic-img-alt' | 'rounded-3xl'
  sizes?: string
  priority?: boolean
  className?: string
  children?: ReactNode
}) {
  return (
    <Link
      href={href}
      className={`group relative block overflow-hidden img-zoom natural-shadow-box bg-forest-dark ${shape} ${aspect} ${className}`}
    >
      {image ? (
        <Image src={image} alt={alt} fill priority={priority} className="object-cover" sizes={sizes} />
      ) : (
        <div className="absolute inset-0 bg-forest" />
      )}
      <div aria-hidden className="absolute inset-0 photo-overlay transition-opacity duration-500 group-hover:opacity-90" />

      {eyebrow && (
        <span className="pill absolute left-4 top-4 bg-cream/15 text-cream backdrop-blur-sm">{eyebrow}</span>
      )}

      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
        <h3 className="t-card text-cream drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]">{title}</h3>
        {meta && <p className="t-meta mt-1.5 text-cream/70">{meta}</p>}
        {children}
      </div>

      <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/40 text-white transition-all duration-300 group-hover:border-accent group-hover:bg-accent">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  )
}
