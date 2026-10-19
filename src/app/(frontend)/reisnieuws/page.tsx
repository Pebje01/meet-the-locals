export const dynamic = 'force-dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { NewsletterForm } from './NewsletterForm'
import { OrganicEdge } from '@/components/OrganicEdge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { formatDate } from '@/lib/format'
import { imageUrl } from '@/lib/media'

/**
 * De laatste nieuwsitems. Faalt de query (op productie bestaat de tabel
 * `news` nog niet), dan toont de pagina de lege staat in plaats van een
 * serverfout: de radar en de nieuwsbrief werken dan gewoon.
 */
async function getRecentNews() {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'news',
      where: { status: { equals: 'published' } },
      sort: '-publishedDate',
      limit: 3,
      depth: 1,
    })
    return docs
  } catch (error) {
    console.error('[reisnieuws] nieuws niet opgehaald:', error instanceof Error ? error.message : error)
    return []
  }
}

const BLIPS = [
  { top: '26%', left: '62%', delay: '1.1s', size: 'w-2 h-2' },
  { top: '58%', left: '32%', delay: '2.7s', size: 'w-1.5 h-1.5' },
  { top: '70%', left: '64%', delay: '0.4s', size: 'w-2 h-2' },
  { top: '38%', left: '18%', delay: '3.4s', size: 'w-1.5 h-1.5' },
  { top: '48%', left: '74%', delay: '1.9s', size: 'w-1.5 h-1.5' },
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
          className="absolute rounded-full border border-radar/25"
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
        <div className="w-full h-px bg-radar/15" />
      </div>
      <div className="absolute inset-0 flex justify-center">
        <div className="h-full w-px bg-radar/15" />
      </div>
      {/* Diagonals */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-px bg-radar/8 origin-center rotate-45" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-px bg-radar/8 origin-center -rotate-45" />
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
          className="absolute left-1/2 top-0 h-1/2 w-[1.5px] bg-gradient-to-b from-radar/0 via-radar/80 to-radar"
          style={{ transformOrigin: 'bottom center', transform: 'translateX(-50%)' }}
        />
      </div>

      {/* Center dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3 h-3 bg-radar rounded-full shadow-[0_0_10px_rgba(90,171,106,0.9)]" />
      </div>

      {/* Blips */}
      {BLIPS.map((blip, i) => (
        <div
          key={i}
          className={`absolute ${blip.size} rounded-full bg-radar`}
          style={{
            top: blip.top,
            left: blip.left,
            animation: `radar-blip 4s ${blip.delay} ease-in-out infinite`,
            boxShadow: '0 0 6px rgba(90,171,106,0.85)',
          }}
        >
          <div
            className="absolute inset-0 rounded-full bg-radar/40"
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
    <main className="bg-cream">
      {/* HERO */}
      <section className="relative min-h-[75vh] overflow-hidden bg-forest-dark px-6 pb-20 pt-32 text-cream md:pt-40 lg:px-10 flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-dark via-forest-dark/98 to-forest-deep" />
        <div aria-hidden className="grain-layer opacity-60" />

        <div className="relative z-10 mx-auto w-full max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6">
              <Breadcrumbs items={[{ name: 'Reisnieuws', href: '/reisnieuws' }]} className="mb-5" />
              <p className="t-eyebrow mb-4 text-radar">Reisnieuws</p>
              <h1 className="t-h1-xl mb-6 text-cream">Travel Radar</h1>
              <p className="t-lead text-cream/70 md:text-[21px]">
                Alles wat er beweegt in de reiswereld: nieuwe bestemmingen, trends in de branche en alle ins en outs van reizen anno 2026. Wat zie ik op mijn radar? 👀
              </p>
            </div>

            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <RadarScreen />
            </div>
          </div>
        </div>

        <OrganicEdge fill="var(--color-cream)" className="h-[40px] md:h-[70px]" />
      </section>

      {/* OP DE RADAR — recente nieuwsitems */}
      <section className="bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <SectionHeader title="Op de radar" align="center" className="mb-12 md:mb-14" />

          {newsItems.length === 0 ? (
            <EmptyState
              title="Nog even stil op de radar"
              text="Binnenkort verschijnt hier het laatste reisnieuws. Schrijf je in voor de nieuwsbrief, dan mis je niets."
              link={{ href: '#nieuwsbrief', label: 'Naar de nieuwsbrief' }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {newsItems.map((item) => {
                const image = imageUrl(item.heroImage)
                const date = formatDate(item.publishedDate)
                return (
                  <Link
                    key={item.id}
                    href={`/reisnieuws/${item.slug}`}
                    className="group block overflow-hidden rounded-3xl bg-white natural-shadow-box card-lift"
                  >
                    {image && (
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <Image
                          src={image}
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
                          <span className="t-meta font-semibold text-accent">
                            {item.category}
                          </span>
                        )}
                        <span className="t-meta text-text-muted/70">{date}</span>
                      </div>
                      <h3 className="t-card mb-2 text-forest transition-colors group-hover:text-accent">
                        {item.title}
                      </h3>
                      <p className="t-body line-clamp-3 text-text-muted">{item.excerpt}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* NIEUWSBRIEF */}
      <section id="nieuwsbrief" className="footer-ready relative scroll-mt-20 overflow-hidden bg-forest-dark py-28 noise-overlay md:py-36">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-dark via-forest-dark/98 to-forest-deep" />
        <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
          <OrganicEdge position="top" fill="var(--color-cream)" className="h-[40px] md:h-[70px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Links: uitleg */}
            <div>
              <p className="t-eyebrow mb-4 text-radar">Nieuwsbrief</p>
              <h2 className="t-h2 mb-6 text-cream">
                Blijf op de hoogte van de reiswereld
              </h2>
              <p className="t-lead mb-10 text-cream/65">
                Eén keer per maand reisnieuws, een lokale ondernemer in de spotlight, eerlijke verhalen over werken in de reisbranche en een overzicht van aankomende events. Geen spam, geen reclame.
              </p>

              {/* Voordelen */}
              <div className="flex flex-col gap-5">
                {[
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                      </svg>
                    ),
                    title: 'Nieuws uit de reisbranche',
                    text: 'Maandelijks de belangrijkste ontwikkelingen uit de reiswereld: trends, nieuwe bestemmingen en wat er speelt in de branche.',
                  },
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                      </svg>
                    ),
                    title: 'Lokale ondernemer in de spotlight',
                    text: 'Elke maand een portret van een lokale ondernemer in de reiswereld. Van guesthouse-eigenaar tot lokale gids.',
                  },
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                      </svg>
                    ),
                    title: 'Werken in de reisbranche en fotografie',
                    text: 'Eerlijke verhalen over werken als fotograaf en in de reissector: opdrachtwerk, vrijheid, uitdagingen en alles ertussenin.',
                  },
                  {
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    ),
                    title: 'Aankomende reisevents en beurzen',
                    text: 'Een overzicht van vakbeurzen, reisfestivals en events die de moeite waard zijn om dit jaar in je agenda te zetten.',
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-cream/12 bg-cream/8 text-radar">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-cream mb-1">{item.title}</p>
                      <p className="text-[14px] leading-relaxed text-cream/55">{item.text}</p>
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
