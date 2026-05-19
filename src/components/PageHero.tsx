import Image from 'next/image'

export function PageHero({
  title,
  subtitle,
  image,
  imageAlt,
}: {
  title: string
  subtitle?: string
  image: string
  imageAlt: string
}) {
  return (
    <section className="relative h-[60vh] min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest/70 via-forest/30 to-forest/10" />
      </div>

      <div className="relative z-10 w-full">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
          <div className="w-full">
            <h1 className="text-white! drop-shadow-[0_4px_30px_rgba(0,0,0,0.4)] mb-4">
              {title}
            </h1>
            {subtitle && (
              <p className="text-white/80 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed drop-shadow-[0_2px_15px_rgba(0,0,0,0.3)]">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-[30px] md:h-[50px] block">
          <path d="M0,60 L0,30 C180,15 360,45 540,25 C720,5 900,40 1080,20 C1260,0 1380,30 1440,18 L1440,60 Z" fill="var(--color-warm-white)" />
        </svg>
      </div>
    </section>
  )
}
