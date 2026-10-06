import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Category, Destination, Post, Story } from '@/payload-types'
import { NewsletterCTA } from '@/components/NewsletterCTA'
import { Marquee } from '@/components/Marquee'
import { OrganicEdge } from '@/components/OrganicEdge'
import { HeroSlideshow } from '@/components/home/HeroSlideshow'
import { DestinationSlider, type SliderDestination } from '@/components/home/DestinationSlider'
import { ContinentMap } from '@/components/home/ContinentMap'
import { Button } from '@/components/ui/Button'
import { TextLink } from '@/components/ui/TextLink'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { TintedCard, type TintedCardTone } from '@/components/ui/TintedCard'
import { PostCard, type PostCardData } from '@/components/ui/PostCard'
import { publishedPostsWhere } from '@/lib/queries'
import { formatDate } from '@/lib/format'
import { imageUrl } from '@/lib/media'
import { WERELDDEEL_OPTIONS, labelFor } from '@/lib/taxonomy'

export const revalidate = 300

/* ─── Vaste inhoud ─── */

/**
 * Recent bezochte bestemmingen, op volgorde van laatste bezoek.
 *
 * De volgorde komt uit de datums en GPS van Daley's eigen fotobibliotheek,
 * niet uit een gevoel. Het jaartal staat erbij zodat de volgorde na te lopen
 * is als er een reis bij komt.
 */
const DESTINATIONS: SliderDestination[] = [
  { name: 'New York', image: '/media/newyork-1-scaled.webp', slug: 'new-york', count: '3 artikelen' },              // aug 2026
  { name: 'Apulië, Italië', image: '/media/over-puglia-steeg.webp', slug: 'apulie' },                               // mei 2026
  { name: 'Sevilla, Spanje', image: '/media/over-kleur-trappen.webp', slug: 'sevilla' },                            // mrt 2026
  { name: 'Ruhrgebied, Duitsland', image: '/media/ruhrgebied-zollverein-essen.webp', slug: 'ruhrgebied' },          // dec 2025, Zeche Zollverein
  { name: 'Noorwegen', image: '/media/over-zwembad-lezen.webp', slug: 'noorwegen' },                                // jul 2025
  { name: 'Indonesië', image: '/media/DJI_20240517152816_0082_D-scaled.webp', slug: 'indonesie', count: '10 artikelen' }, // mei 2024
  { name: 'Japan', image: '/media/Shirakawago-3.webp', slug: 'japan', count: '5 artikelen' },                       // mrt 2024
  { name: 'Maleisië', image: '/media/Malaysia-1-7-1-scaled.webp', slug: 'maleisie', count: '8 artikelen' },         // aug 2023
  { name: 'Thailand', image: '/media/Ayuthayya-1-4-scaled.webp', slug: 'thailand', count: '6 artikelen' },          // aug 2023
  { name: 'Marokko', image: '/media/woestijn-9-scaled.webp', slug: 'marokko', count: '4 artikelen' },               // dec 2022
  { name: 'Peru', image: '/media/cusco-12-scaled.webp', slug: 'peru', count: '12 artikelen' },                      // jul 2022
]

const CONTINENTS = [
  { label: 'Europa', value: 'europe' },
  { label: 'Azië', value: 'asia' },
  { label: 'Afrika', value: 'africa' },
  { label: 'Noord-Amerika', value: 'north-america' },
  { label: 'Zuid-Amerika', value: 'south-america' },
  { label: 'Oceanië', value: 'oceania' },
]

const MARQUEE_PLACES = ['Maleisië', 'Peru', 'Thailand', 'Indonesië', 'Japan', 'Marokko', 'Singapore', 'New York']

const INTRO_PROMISES = [
  'Eigen fotografie',
  'Echte en unieke plekken en mensen',
  'Reistips uit ervaring',
  'Reizen op eigen wijze',
]

const COMMISSION_SERVICES = [
  'Reportagefotografie',
  'Hotel en B&B fotografie',
  'Fotografie voor reisbureaus, touroperators en bedrijven in de reisbranche',
  'Webdesign in reisbranche',
]

const HIGHLIGHTS: { title: string; text: string; tone: TintedCardTone; icon: ReactNode }[] = [
  {
    title: 'Lokale adresjes',
    text: 'De fijnste eetadresjes en verborgen plekken, zelf ontdekt en gefotografeerd.',
    tone: 'water',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    title: 'Onbekende plekken',
    text: 'De stille dorpen, uitzichten en hoeken die de toeristische route links laat liggen.',
    tone: 'sand',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
  },
  {
    title: 'Reisfotografie',
    text: 'Mijn werk als fotograaf, en de plekken zoals ik ze door de lens zag.',
    tone: 'accent',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="2" y="4" width="20" height="14" rx="2" />
        <circle cx="12" cy="11" r="4" />
        <circle cx="20" cy="6" r="1" fill="currentColor" />
      </svg>
    ),
  },
]

/* ─── Laatste verhalen ─── */

function firstRelationName<T extends Category | Destination>(items?: (number | T)[] | null): string {
  const relation = items?.find((item): item is T => typeof item === 'object')
  return relation?.name ?? ''
}

function postCategory(post: Post): string {
  return (
    firstRelationName(post.categories) ||
    firstRelationName(post.destinations) ||
    labelFor(WERELDDEEL_OPTIONS, post.werelddeel) ||
    'Reisverhaal'
  )
}

type MetDatum = PostCardData & { publishedDate: string }

function toCardFromPost(post: Post): MetDatum {
  return {
    title: post.title,
    href: `/blog/${post.slug}`,
    image: imageUrl(post.heroImage),
    excerpt: post.excerpt,
    category: postCategory(post),
    date: formatDate(post.publishedDate),
    publishedDate: post.publishedDate,
  }
}

function toCardFromStory(story: Story): MetDatum {
  return {
    title: story.title,
    href: `/verhalen/${story.slug}`,
    image: imageUrl(story.heroImage as Post['heroImage']),
    excerpt: story.intro,
    category: story.eyebrow || 'Reportage',
    date: formatDate(story.publishedDate),
    publishedDate: story.publishedDate,
  }
}

/**
 * Laatste verhalen mengt de twee soorten: korte blogposts en lange reportages.
 * Ze staan in aparte collecties, dus ze worden hier apart opgehaald en daarna
 * op publicatiedatum door elkaar gezet. Elke kaart draagt haar eigen pad mee,
 * want /blog en /verhalen zijn verschillende routes.
 */
async function getRecentPosts(): Promise<PostCardData[]> {
  const payload = await getPayload({ config })
  const [posts, stories] = await Promise.all([
    payload.find({ collection: 'posts', where: publishedPostsWhere(), sort: '-publishedDate', depth: 1, limit: 3 }),
    payload.find({ collection: 'stories', where: { status: { equals: 'published' } }, sort: '-publishedDate', depth: 1, limit: 3 }),
  ])

  return [...posts.docs.map(toCardFromPost), ...stories.docs.map(toCardFromStory)]
    .filter((item) => item.image)
    .sort((a, b) => Date.parse(b.publishedDate) - Date.parse(a.publishedDate))
    .slice(0, 3)
    .map(({ publishedDate: _publishedDate, ...kaart }) => kaart)
}

/* ─── Onderdelen ─── */

/**
 * Ingelijst beeld met het verschoven kader en een bijschrift.
 * Laat het bijschrift weg als de locatie niet zeker is: liever geen dan een verkeerd.
 */
function FramedPhoto({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <div className="relative">
      {/* Kader in bosgroen, iets verschoven achter de foto */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 translate-x-3 translate-y-3 organic-card border-2 border-forest/70 md:translate-x-4 md:translate-y-4"
      />

      <div className="relative aspect-[4/5] overflow-hidden organic-card natural-shadow-box bg-forest-dark sm:aspect-[5/4] lg:aspect-[4/3.3]">
        <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 46vw" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-forest-dark/40 via-transparent to-transparent" />
      </div>

      {caption && (
        <div className="absolute -bottom-5 left-4 flex items-center gap-2 border border-forest/15 bg-cream px-4 py-2.5 organic-btn-alt natural-shadow-box md:left-7">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0 text-accent">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="t-meta whitespace-nowrap font-semibold text-forest">{caption}</span>
        </div>
      )}
    </div>
  )
}

/* ─── Pagina ─── */

export default async function HomePage() {
  const recentPosts = await getRecentPosts()

  return (
    <main>
      {/* HERO: schermvullende foto's, gecentreerde tekst eroverheen */}
      <section className="relative flex h-svh items-center justify-center overflow-hidden bg-forest-dark">
        <HeroSlideshow />

        {/* Twee lagen voor leesbaarheid: donker onderin, en een vignet in het midden */}
        <div aria-hidden className="absolute inset-0 z-[1] bg-gradient-to-t from-forest/60 via-transparent to-transparent" />
        <div
          aria-hidden
          className="absolute inset-0 z-[1]"
          style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0.58) 0%, transparent 62%)' }}
        />

        <div className="relative z-10 w-full pt-16 md:pt-20">
          <div className="mx-auto max-w-[1400px] px-6 text-center lg:px-10">
            <span className="t-eyebrow mb-6 inline-flex items-center gap-2.5 text-accent drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden className="shrink-0">
                <path d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9" />
              </svg>
              Welkom bij Meet the Locals
            </span>

            <h1 className="t-h1 mb-5 text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.4)] md:mb-8">
              De wereld in
              <br />
              beeld en verhalen
            </h1>

            <p className="t-lead mx-auto mb-8 max-w-2xl text-white drop-shadow-[0_2px_15px_rgba(0,0,0,0.35)] md:mb-10 md:text-[21px]">
              Beleef de wereld vanuit mijn lens. Als fotograaf en avonturier neem ik je mee naar
              plekken die ik op mijn manier vastleg: niet alleen wat mooi is, maar wat echt is.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Button href="/blog" arrow="right">
                Ontdek verhalen
              </Button>
              <Button href="/bestemmingen" variant="glass" shape="organic-btn-alt">
                Bestemmingen
              </Button>
            </div>
          </div>
        </div>

        <OrganicEdge fill="var(--color-cream-dark)" texture className="h-[44px] md:h-[80px]" />
      </section>

      {/* INTRO */}
      <section className="relative overflow-hidden bg-cream-dark py-24 md:py-32">
        {/* Korrel in plaats van een stippenraster: dat laatste stond op een
            regelmatig grid en oogde daardoor mechanisch. */}
        <div aria-hidden className="grain-layer" />
        {/* Zachte organische vlek achter de tekst */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 -top-40 h-[34rem] w-[34rem] blob-1 bg-water-muted/50"
          style={{
            // De vlek steekt boven de sectie uit en werd daar recht afgeknipt,
            // wat een streep gaf onder de golf. Bovenin dus laten opkomen.
            maskImage: 'linear-gradient(to bottom, transparent 0, transparent 160px, black 340px)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, transparent 160px, black 340px)',
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 lg:px-10">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-6">
              <FramedPhoto
                src="/media/DSC_3016-copy-scaled.webp"
                alt="Daley op de trap in de tuin van Yves Saint Laurent in Marrakesh, Marokko"
                caption="Yves Saint Laurent tuin, Marrakesh"
              />
            </div>

            <div className="lg:col-span-6 lg:pl-6">
              <ul className="mb-7 flex flex-wrap gap-2.5">
                {INTRO_PROMISES.map((item) => (
                  <li key={item} className="pill border border-forest/15 bg-cream/70 text-forest">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0 text-accent">
                      <path d="M4 12.5l5 5L20 6.5" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <h2 className="t-h2 mb-6 text-forest">
                Meer dan een <span className="text-accent">reisblog</span>
              </h2>
              <div className="t-lead mb-8 max-w-xl space-y-6 text-text-muted">
                <p>
                  Welkom, ik ben Daley. Als fotograaf leg ik al jaren de wereld vast, van leuke dorpjes vlakbij mijn huis tot regenwoud in het Amazonegebied van Peru.
                </p>
                <p>
                  Op deze website vind je alles over reizen. De mooiste plekken, afgelegen bestemmingen, reisfotografie en reistips. Ook deel ik graag de ins-and-outs in de reiswereld. Daarom is dit meer dan een reisblog. Het is mijn persoonlijke reisplatform, waarop ik de wereld deel vanuit mijn lens en visie.
                </p>
                <p>Niet alleen wat mooi is, maar wat echt is. Want echt is zoveel mooier.</p>
              </div>
              <TextLink href="/over" tone="forest" direction="diagonal">
                Lees mijn verhaal
              </TextLink>
            </div>
          </div>
        </div>

        <OrganicEdge fill="var(--color-cream)" className="h-[50px] md:h-[80px]" />
      </section>

      {/* LAATSTE VERHALEN */}
      <section className="relative bg-cream py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <SectionHeader title="Laatste verhalen" link={{ href: '/blog', label: 'Alle verhalen' }} />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
            {recentPosts.map((post) => (
              <PostCard key={post.href} post={post} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button href="/blog" variant="forest" arrow="right">
              Lees verder
            </Button>
          </div>
        </div>
      </section>

      {/* BESTEMMINGEN */}
      <section className="destinations-texture noise-overlay relative overflow-hidden bg-forest py-32 text-cream md:py-40">
        <div className="relative z-10">
          <DestinationSlider destinations={DESTINATIONS} />
        </div>
        {/* Boven de korrel van de sectie, zodat de crème golven effen blijven
            en naadloos aansluiten op de secties erboven en eronder. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
          <OrganicEdge position="top" fill="var(--color-cream)" className="h-[50px] md:h-[80px]" />
          <OrganicEdge fill="var(--color-cream)" className="h-[50px] md:h-[80px]" />
        </div>
      </section>

      {/* WERK IN OPDRACHT */}
      <section className="relative overflow-hidden bg-cream py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
            <div>
              <SectionHeader title="Werk in opdracht" className="mb-8">
                Een greep uit het werk dat ik heb gedaan in opdracht van bedrijven in of verwant aan de reisbranche en horeca.
              </SectionHeader>
              <ul className="mb-10 flex flex-col gap-3">
                {COMMISSION_SERVICES.map((item) => (
                  <li key={item} className="t-lead flex items-start gap-3 text-forest/75">
                    <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button href="/werk-in-opdracht" arrow="right">
                Bekijk mijn werk
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-12 md:gap-4">
              <div className="col-span-1 space-y-3 md:col-span-7 md:space-y-4">
                <div className="relative aspect-[3/4] overflow-hidden organic-img">
                  <Image src="/media/kip-caravans.webp" alt="Kip Kompakt caravan in een Noors landschap" fill className="object-cover object-[64%_center]" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 58vw, 29vw" />
                </div>
                <div className="relative aspect-square overflow-hidden organic-img-alt">
                  <Image src="/media/trulli-home-1.webp" alt="Trulli Lupoli, vooraanzicht in Ceglie Messapica, Apulië" fill className="object-cover" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 58vw, 29vw" />
                </div>
              </div>
              <div className="col-span-1 space-y-3 pt-8 md:col-span-5 md:space-y-4 md:pt-12">
                <div className="relative aspect-square overflow-hidden organic-img">
                  <Image src="/media/kip-caravans-haven.webp" alt="Kip caravan achter een witte SUV in de Noorse bergen" fill className="object-cover object-[45%_center]" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 42vw, 21vw" />
                </div>
                <div className="relative aspect-[3/4] overflow-hidden organic-img-alt">
                  <Image src="/media/trulli-home-2.webp" alt="Trulli Lupoli, blauwe deur en terras in Apulië" fill className="object-cover" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 42vw, 21vw" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WERELDDELEN */}
      <section className="bg-cream py-16 md:py-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,520px)_1fr] lg:items-center lg:gap-16">
            <h2 className="t-h2 text-forest">Ontdek de werelddelen</h2>
            <div className="relative min-h-[145px] max-w-[620px] overflow-hidden md:min-h-[165px]">
              <div className="pointer-events-none absolute -inset-6 opacity-85" aria-hidden="true">
                <ContinentMap />
              </div>
              <div className="relative z-10 flex min-h-[145px] flex-wrap items-center gap-3 md:min-h-[165px]">
                {CONTINENTS.map((item) => (
                  <Link
                    key={item.value}
                    href={`/blog?werelddeel=${item.value}`}
                    className="pill whitespace-nowrap bg-cream-dark/75 text-forest/80 backdrop-blur-[1px] hover:bg-accent hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="relative overflow-hidden bg-accent py-6">
        <Marquee className="flex whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="mr-8 flex items-center gap-8">
              {MARQUEE_PLACES.map((place) => (
                <span key={`${place}-${i}`} className="flex items-center gap-8">
                  <span className="text-sm font-medium uppercase tracking-[0.2em] text-white/90">{place}</span>
                  <span aria-hidden className="text-white/60">✦</span>
                </span>
              ))}
            </span>
          ))}
        </Marquee>
      </div>

      {/* WAT JE HIER VINDT */}
      <section className="relative bg-cream pb-8 pt-24 md:pb-12 md:pt-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <SectionHeader title="Wat je hier vindt" align="center" className="mb-14 md:mb-16" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6">
            {HIGHLIGHTS.map((item) => (
              <TintedCard key={item.title} icon={item.icon} title={item.title} text={item.text} tone={item.tone} />
            ))}
          </div>
        </div>
      </section>

      <NewsletterCTA />
    </main>
  )
}
