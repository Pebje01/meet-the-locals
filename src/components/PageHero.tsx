import Image from 'next/image'

export function PageHero({
  title,
  subtitle,
  image,
  imageAlt,
  variant = 'photo',
}: {
  title: string
  subtitle?: string
  image: string
  imageAlt: string
  variant?: 'photo' | 'dark'
}) {
  const isDark = variant === 'dark'

  return (
    <section
      className={`relative h-[75vh] min-h-[500px] flex items-center justify-center overflow-hidden ${
        isDark ? 'bg-forest-dark' : ''
      }`}
    >
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className={`object-cover ${isDark ? 'opacity-20' : ''}`}
          priority
          sizes="100vw"
        />
        <div
          className={`absolute inset-0 ${
            isDark
              ? 'bg-gradient-to-b from-forest-dark via-forest-dark/90 to-forest-dark'
              : 'bg-gradient-to-t from-forest/70 via-forest/30 to-forest/10'
          }`}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(15,29,15,0.55) 100%)' }}
        />
      </div>

      <div className="relative z-10 w-full">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
          <div className="w-full">
            <h1 className="text-white! drop-shadow-[0_4px_30px_rgba(0,0,0,0.4)] mb-4">
              {title}
            </h1>
            {subtitle && (
              <p className="text-white/80 text-lg md:text-xl max-w-6xl mx-auto leading-relaxed drop-shadow-[0_2px_15px_rgba(0,0,0,0.3)]">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-2">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-[20px] md:h-[32px] block">
          <path d="M0,80 L0,76 C360,72 720,78 1080,74 C1200,73 1320,75 1440,73 L1440,80 Z" fill="var(--color-warm-white)" />
        </svg>
      </div>
    </section>
  )
}
