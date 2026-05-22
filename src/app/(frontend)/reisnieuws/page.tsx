export const dynamic = 'force-dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { NewsletterForm } from './NewsletterForm'

async function getRecentNews() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'news',
    where: { status: { equals: 'published' } },
    sort: '-publishedDate',
    limit: 3,
    depth: 1,
  })
  return docs
}

const BLIPS = [
  { top: '26%', left: '62%', delay: '1.1s', size: 'w-2 h-2' },
  { top: '58%', left: '32%', delay: '2.7s', size: 'w-1.5 h-1.5' },
  { top: '70%', left: '64%', delay: '0.4s', size: 'w-2 h-2' },
  { top: '38%', left: '18%', delay: '3.4s', size: 'w-1.5 h-1.5' },
  { top: '48%', left: '74%', delay: '1.9s', size: 'w-1.5 h-1.5' },
]

const CATEGORIES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: 'Nieuwe bestemmingen',
    text: 'Plekken die nog niet op ieders radar staan, maar dat binnenkort wel zullen zijn.',
    cardClass: 'bg-water-muted border-water-light/50',
    iconClass: 'bg-white/55 text-water',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'Reistips van de week',
    text: 'Praktische updates: de beste tijd om te boeken, nieuwe routes en lokale tips.',
    cardClass: 'bg-[#e6f0df] border-forest/10',
    iconClass: 'bg-white/55 text-forest',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
    title: 'Lokale ontdekkingen',
    text: 'Verborgen eetadressen, nieuwe hotspots en plekken die de algoritmes nog niet kennen.',
    cardClass: 'bg-accent-muted border-accent/15',
    iconClass: 'bg-white/60 text-accent',
  },
]

function RadarScreen() {
  return (
    <div className="relative w-[260px] h-[260px] md:w-[340px] md:h-[340px] lg:w-[400px] lg:h-[400px] flex-shrink-0">
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full shadow-[0_0_60px_rgba(74,160,90,0.18)]" />

      {/* Concentric rings */}
      {[1, 0.72, 0.46, 0.22].map((scale, i) => (
        <div
          key={i}
          className="absolute rounded-full border border-[#5aab6a]/25"
          style={{
            top: `${(1 - scale) * 50}%`,
            left: `${(1 - scale) * 50}%`,
            right: `${(1 - scale) * 50}%`,
            bottom: `${(1 - scale) * 50}%`,
          }}
        />
      ))}

      {/* Crosshairs */}
      <div className="absolute inset-0 flex items-center">
        <div className="w-full h-px bg-[#5aab6a]/15" />
      </div>
      <div className="absolute inset-0 flex justify-center">
        <div className="h-full w-px bg-[#5aab6a]/15" />
      </div>
      {/* Diagonals */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-px bg-[#5aab6a]/08 origin-center rotate-45" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-px bg-[#5aab6a]/08 origin-center -rotate-45" />
      </div>

      {/* Sweep wrapper */}
      <div
        className="absolute inset-0 rounded-full overflow-hidden"
        style={{ animation: 'radar-sweep 4s linear infinite' }}
      >
        {/* Conic fade trail */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'conic-gradient(from -5deg, transparent 0deg, rgba(90,171,106,0.18) 55deg, rgba(90,171,106,0.06) 80deg, transparent 90deg)',
          }}
        />
        {/* Sweep line */}
        <div
          className="absolute left-1/2 top-0 h-1/2 w-[1.5px] bg-gradient-to-b from-[#5aab6a]/0 via-[#5aab6a]/80 to-[#5aab6a]"
          style={{ transformOrigin: 'bottom center', transform: 'translateX(-50%)' }}
        />
      </div>

      {/* Center dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3 h-3 bg-[#5aab6a] rounded-full shadow-[0_0_10px_rgba(90,171,106,0.9)]" />
      </div>

      {/* Blips */}
      {BLIPS.map((blip, i) => (
        <div
          key={i}
          className={`absolute ${blip.size} rounded-full bg-[#5aab6a]`}
          style={{
            top: blip.top,
            left: blip.left,
            animation: `radar-blip 4s ${blip.delay} ease-in-out infinite`,
            boxShadow: '0 0 6px rgba(90,171,106,0.85)',
          }}
        >
          <div
            className="absolute inset-0 rounded-full bg-[#5aab6a]/40"
            style={{ animation: `radar-ping 1.5s ${blip.delay} ease-out infinite` }}
          />
        </div>
      ))}
    </div>
  )
}

export default async function ReisnieuwsPage() {
  const newsItems = await getRecentNews()
  return (
    <main className="bg-warm-white">
      {/* HERO */}
      <section className="relative min-h-[75vh] overflow-hidden bg-forest-dark px-6 pb-20 pt-32 text-cream md:pt-40 lg:px-10 noise-overlay flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-dark via-forest-dark/98 to-[#0f2a14]" />

        <div className="relative z-10 mx-auto w-full max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6">
              <span className="mb-4 block text-[12px] font-semibold uppercase tracking-[0.16em] text-[#5aab6a]">
                Reisnieuws
              </span>
              <h1 className="mb-6 font-display text-cream! leading-[0.95]" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}>
                Travel Radar
              </h1>
              <p className="text-[20px] leading-relaxed text-cream/65 md:text-[22px]">
                Alles wat er beweegt in de reiswereld: nieuwe bestemmingen, trends in de branche en alle ins en outs van reizen anno 2026. Wat zie ik op mijn radar? 👀
              </p>
            </div>

            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <RadarScreen />
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-[50px] md:h-[70px] block">
            <path d="M0,80 L0,50 C200,70 400,30 600,50 C800,70 1100,35 1440,55 L1440,80 Z" fill="var(--color-warm-white)" />
          </svg>
        </div>
      </section>

      {/* OP DE RADAR — recente nieuwsitems */}
      <section className="py-20 md:py-28 bg-warm-white">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="mb-14 text-center">
            <h2 className="text-4xl md:text-5xl font-display font-light text-forest">Op de radar</h2>
          </div>

          {newsItems.length === 0 ? (
            <p className="text-center text-text-muted text-[18px]">Binnenkort verschijnt hier het laatste reisnieuws.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {newsItems.map((item) => {
                const imageUrl = typeof item.heroImage === 'object' && item.heroImage !== null
                  ? (item.heroImage as { url?: string }).url
                  : null
                const date = item.publishedDate
                  ? new Date(item.publishedDate).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })
                  : ''
                return (
                  <Link
                    key={item.id}
                    href={`/reisnieuws/${item.slug}`}
                    className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    {imageUrl && (
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        {item.category && (
                          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-accent">
                            {item.category}
                          </span>
                        )}
                        <span className="text-[12px] text-text-muted/60">{date}</span>
                      </div>
                      <h3 className="font-display text-xl font-light text-forest mb-2 group-hover:text-accent transition-colors leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-text-muted text-[15px] leading-relaxed line-clamp-3">{item.excerpt}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* NIEUWSBRIEF */}
      <section className="relative overflow-hidden bg-forest-dark py-24 md:py-32 noise-overlay">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-dark via-forest-dark/98 to-[#0f2a14]" />

        <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Links: uitleg */}
            <div>
              <span className="mb-4 block text-[12px] font-semibold uppercase tracking-[0.16em] text-[#5aab6a]">
                Nieuwsbrief
              </span>
              <h2 className="mb-6 font-display text-cream! leading-[0.95]" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }}>
                Blijf op de hoogte van de reiswereld
              </h2>
              <p className="text-[19px] leading-relaxed text-cream/60 mb-10">
                Eén keer per maand de belangrijkste ontwikkelingen in de reisbranche, gebundeld in je inbox. Geen dagelijkse spam, geen reclame. Alleen wat de moeite waard is.
              </p>

              {/* Voordelen */}
              <div className="flex flex-col gap-5">
                {[
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/><path d="M12 6v6l4 2"/>
                      </svg>
                    ),
                    title: 'Nieuws uit de reisbranche',
                    text: 'De ins en outs van de reiswereld: trends, ontwikkelingen en bestemmingen die het waard zijn.',
                  },
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
                      </svg>
                    ),
                    title: 'Vacatures en kansen in de reiswereld',
                    text: 'Maandelijks een selectie van vacatures, freelanceopdrachten en andere kansen voor iedereen die in de reiswereld werkt of wil werken.',
                  },
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    ),
                    title: 'Beste reisdeal van de maand',
                    text: 'Elke maand de scherpste deal die ik ben tegengekomen: vluchten, accommodaties of ervaringen die écht de moeite waard zijn.',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="mt-0.5 flex-shrink-0 w-10 h-10 rounded-xl bg-cream/8 border border-cream/12 flex items-center justify-center text-[#5aab6a]">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-cream mb-1">{item.title}</p>
                      <p className="text-[14px] leading-relaxed text-cream/45">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rechts: formulier */}
            <div className="bg-cream/6 border border-cream/12 rounded-3xl p-8 md:p-10">
              <NewsletterForm />
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}
