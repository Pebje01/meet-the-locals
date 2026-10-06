import Image from 'next/image'
import { OrganicEdge } from '@/components/OrganicEdge'
import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs'
import { Eyebrow } from '@/components/ui/Eyebrow'
import type { HeroImage } from '@/lib/heroImages'

/**
 * De vaste paginakop: foto, titel, subtitel en een organische onderrand in
 * de kleur van de sectie eronder.
 *
 * `image` is een object uit `src/lib/heroImages.ts`, zodat elke hero een
 * blur-placeholder heeft en de foto niet seconden lang een leeg vlak is.
 * `next` is de achtergrondkleur van wat eronder komt; de golf neemt die kleur
 * over, anders zie je een streep op de naad.
 */
export function PageHero({
  title,
  subtitle,
  eyebrow,
  image,
  variant = 'photo',
  height = 'lg',
  align = 'center',
  next = 'var(--color-cream)',
  breadcrumbs,
}: {
  title: string
  subtitle?: string
  eyebrow?: string
  image: HeroImage
  variant?: 'photo' | 'dark'
  height?: 'md' | 'lg'
  align?: 'center' | 'left'
  next?: string
  /** Kruimelpad zonder Home, de laatste stap is deze pagina. */
  breadcrumbs?: Crumb[]
}) {
  const isDark = variant === 'dark'
  const centered = align === 'center'

  return (
    <section
      className={`relative flex items-center overflow-hidden bg-forest-dark ${
        height === 'md' ? 'min-h-[440px] h-[60vh]' : 'min-h-[520px] h-[75vh]'
      }`}
    >
      <div className="absolute inset-0">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          placeholder="blur"
          blurDataURL={image.blur}
          className={`object-cover ${isDark ? 'opacity-25' : ''}`}
          sizes="100vw"
        />
        <div
          aria-hidden
          className={`absolute inset-0 ${
            isDark
              ? 'bg-gradient-to-b from-forest-dark/80 via-forest-dark/85 to-forest-dark'
              : 'photo-overlay'
          }`}
        />
        {/* Lichte foto's (strand, bergen) maken gecentreerde tekst anders slecht leesbaar */}
        {!isDark && <div aria-hidden className="absolute inset-0 bg-forest-dark/30" />}
        {isDark && <div aria-hidden className="grain-layer opacity-60" />}
      </div>

      <div className="relative z-10 w-full pt-16 md:pt-20">
        <div className={`mx-auto max-w-[1400px] px-6 lg:px-10 ${centered ? 'text-center' : ''}`}>
          <div className={centered ? 'mx-auto max-w-4xl' : 'max-w-3xl'}>
            {breadcrumbs && (
              <Breadcrumbs items={breadcrumbs} align={align} className="mb-5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]" />
            )}
            {eyebrow && (
              <Eyebrow tone="light" className="mb-5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]">
                {eyebrow}
              </Eyebrow>
            )}
            <h1 className="t-h1 mb-5 text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.4)]">{title}</h1>
            {subtitle && (
              <p
                className={`t-lead text-white/85 drop-shadow-[0_2px_15px_rgba(0,0,0,0.35)] md:text-xl ${
                  centered ? 'mx-auto max-w-2xl' : 'max-w-xl'
                }`}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      <OrganicEdge fill={next} className="h-[36px] md:h-[64px]" />
    </section>
  )
}
