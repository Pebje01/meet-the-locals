import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Story } from '@/payload-types'
import { OrganicClipDefs } from '@/components/OrganicEdge'

function imageUrl(img: Story['heroImage']): string {
  return img && typeof img === 'object' ? (img.url ?? '') : ''
}

function formatDate(date?: string | null): string {
  if (!date) return ''
  return new Date(date).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function VerhalenPage() {
  const payload = await getPayload({ config })
  const { docs: stories } = await payload.find({
    collection: 'stories',
    where: { status: { equals: 'published' } },
    sort: '-publishedDate',
    depth: 1,
    limit: 50,
  })

  return (
    <main className="min-h-screen bg-warm-white">

      {/*
        De hero krijgt zelf een golvende onderrand via clip-path, in plaats van
        er een gevulde golf overheen te leggen. Die golf was crèmekleurig,
        terwijl eronder een foto staat, en dat gaf een witte strook.
        Nu is het gebied onder de golf gewoon weggeknipt en schuift het eerste
        verhaal er met een negatieve marge onder, zodat de foto doorloopt.
      */}
      <OrganicClipDefs id="verhalenWaveClip" diepte={0.13} />
      <OrganicClipDefs id="verhaalKaartClip" diepte={0.075} />

      <section
        className="relative z-10 h-[75vh] min-h-[500px] flex flex-col items-center justify-center overflow-hidden bg-forest-dark"
        style={{ clipPath: 'url(#verhalenWaveClip)' }}
      >
        <Image
          src="/media/maleisie-5-scaled.webp"
          alt="Reizen"
          fill
          priority
          className="object-cover object-center opacity-20"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-dark via-forest-dark/90 to-forest-dark" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(15,29,15,0.55) 100%)' }} />

        <div className="relative z-10 text-center px-6 w-full pt-16">
          <span className="block text-[11px] uppercase tracking-[0.3em] text-white/55 mb-5">
            Diepgaande reisverhalen
          </span>
          <h1
            className="!text-white leading-none mb-6 drop-shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
            style={{ fontSize: 'clamp(3.5rem, 11vw, 11rem)' }}
          >
            Verhalen
          </h1>
          <p className="text-white/75 text-lg md:text-xl max-w-xl mx-auto leading-relaxed drop-shadow-[0_2px_15px_rgba(0,0,0,0.3)]">
            Meer dan een blog, minder dan een boek.
          </p>
        </div>
      </section>

      {stories.length === 0 ? (
        <section className="relative z-0 -mt-[9vh] py-24 md:py-32">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
            <p className="text-text-muted text-lg">De eerste verhalen komen er aan. Snel terug.</p>
          </div>
        </section>
      ) : (
        <section className="relative z-0 -mt-[9vh]">
        {/*
          Elke kaart knipt zijn eigen onderrand en de volgende schuift eronder,
          zodat de foto's in elkaar overlopen in plaats van met een rechte naad
          op elkaar te stapelen. De z-index loopt af, want anders schildert een
          latere kaart met haar rechte bovenkant over de golf van de vorige.
          De laatste kaart blijft ongeknipt: daaronder zit geen foto meer.
        */}
          {stories.map((story, i) => {
            const isLaatste = i === stories.length - 1
            return (
            <Link
              key={story.id}
              href={`/verhalen/${story.slug}`}
              className={`group block relative overflow-hidden ${i > 0 ? '-mt-[6vh]' : ''}`}
              style={{
                zIndex: stories.length - i,
                clipPath: isLaatste ? undefined : 'url(#verhaalKaartClip)',
              }}
            >
              {/* Kaart: min 70vh, foto rechts zichtbaar, tekst links */}
              <div className="relative h-screen">
                {imageUrl(story.heroImage) ? (
                  <Image
                    src={imageUrl(story.heroImage)}
                    alt={story.title}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
                    sizes="100vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-forest" />
                )}

                {/* Links-naar-rechts gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Content links */}
                <div className="absolute inset-0 flex items-end">
                  <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-16 pb-14 md:pb-20">
                    <div className="w-full">
                      {story.eyebrow && (
                        <span className="block font-oswald text-lg uppercase tracking-[0.05em] !text-white/70 mb-4">
                          {story.eyebrow}
                        </span>
                      )}
                      <h2 className="!font-editorial text-4xl md:text-5xl lg:text-6xl !text-white !font-normal leading-[1.0] mb-4">
                        {story.title}
                      </h2>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-6 h-px bg-white/35" />
                        <span className="text-[11px] uppercase tracking-[0.15em] !text-white/50">
                          {formatDate(story.publishedDate)}
                        </span>
                      </div>
                      <p className="!text-white/65 text-[15px] md:text-base leading-relaxed line-clamp-2 mb-6">
                        {story.intro}
                      </p>
                      <span className="font-btn inline-flex items-center gap-2 text-accent font-semibold text-sm uppercase tracking-[0.1em] group-hover:gap-3 transition-all">
                        Lees verhaal
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
              </div>
            </Link>
            )
          })}
        </section>
      )}
    </main>
  )
}
