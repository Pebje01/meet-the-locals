'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useCallback, useState, useEffect } from 'react'
import { ComposableMap, Geographies, Geography, type GeoFeature } from 'react-simple-maps'
import { NewsletterCTA } from '@/components/NewsletterCTA'

/* ─── Data ─── */
const GEO_URL = '/countries-110m.json'

export type HomeRecentPost = {
  title: string
  slug: string
  image: string
  excerpt: string
  category: string
  date: string
}

const destinations = [
  { name: 'Apulië, Italië', image: '/media/over-puglia-steeg.webp', slug: 'apulie', count: '' },
  { name: 'Sevilla, Spanje', image: '/media/over-kleur-trappen.webp', slug: 'sevilla', count: '' },
  { name: 'Ruhrgebied, Duitsland', image: '/media/over-new-york.webp', slug: 'ruhrgebied', count: '' },
  { name: 'Noorwegen', image: '/media/over-zwembad-lezen.webp', slug: 'noorwegen', count: '' },
  { name: 'Maleisië', image: '/media/Malaysia-1-7-1-scaled.webp', slug: 'maleisie', count: '8 artikelen' },
  { name: 'Peru', image: '/media/cusco-12-scaled.webp', slug: 'peru', count: '12 artikelen' },
  { name: 'Thailand', image: '/media/Ayuthayya-1-4-scaled.webp', slug: 'thailand', count: '6 artikelen' },
  { name: 'Indonesië', image: '/media/DJI_20240517152816_0082_D-scaled.webp', slug: 'indonesie', count: '10 artikelen' },
  { name: 'Japan', image: '/media/Shirakawago-3.webp', slug: 'japan', count: '5 artikelen' },
  { name: 'Marokko', image: '/media/woestijn-9-scaled.webp', slug: 'marokko', count: '4 artikelen' },
  { name: 'Colombia', image: '/media/Dansenmaloca-scaled.webp', slug: 'colombia', count: '7 artikelen' },
  { name: 'New York', image: '/media/newyork-1-scaled.webp', slug: 'new-york', count: '3 artikelen' },
]

const continents = [
  { label: 'Europa', value: 'europe' },
  { label: 'Azië', value: 'asia' },
  { label: 'Afrika', value: 'africa' },
  { label: 'Noord-Amerika', value: 'north-america' },
  { label: 'Zuid-Amerika', value: 'south-america' },
  { label: 'Oceanië', value: 'oceania' },
]

const HERO_SLIDES = [
  { src: '/media/Shirakawago-3.webp',                    alt: 'Shirakawago Japan',         kb: 'animate-ken-burns' },
  { src: '/media/DJI_20240517152816_0082_D-scaled.webp', alt: 'Indonesië vanuit de lucht', kb: 'animate-ken-burns-b' },
  { src: '/media/cusco-12-scaled.webp',                  alt: 'Cusco Peru',                kb: 'animate-ken-burns-c' },
  { src: '/media/Malaysia-1-7-1-scaled.webp',            alt: 'Maleisië',                  kb: 'animate-ken-burns-d' },
  { src: '/media/Dansenmaloca-scaled.webp',              alt: 'Colombia',                  kb: 'animate-ken-burns-e' },
]

function HeroSlideshow() {
  const [active, setActive] = useState(0)
  const [slideKeys, setSlideKeys] = useState([0, 1, 2, 3, 4])

  useEffect(() => {
    const timer = setInterval(() => {
      setActive(prev => {
        const next = (prev + 1) % HERO_SLIDES.length
        setSlideKeys(keys => {
          const updated = [...keys]
          updated[next] = Math.max(...keys) + 1
          return updated
        })
        return next
      })
    }, 7000)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      {HERO_SLIDES.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${i === active ? 'opacity-100' : 'opacity-0'}`}
        >
          <div key={slideKeys[i]} className={`absolute inset-0 ${slide.kb}`}>
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-cover"
              sizes="100vw"
              priority={i === 0}
            />
          </div>
        </div>
      ))}
    </>
  )
}

/* ─── Components ─── */
function isAntarcticGeo(geo: GeoFeature): boolean {
  const properties = geo.properties as { name?: string } | undefined
  return String(geo.id).padStart(3, '0') === '010' || /antarctic/i.test(properties?.name ?? '')
}

function ContinentMapBackdrop() {
  return (
    <ComposableMap
      projection="geoNaturalEarth1"
      projectionConfig={{ scale: 155, center: [12, 8] }}
      style={{ width: '100%', height: '100%' }}
    >
      <Geographies geography={GEO_URL}>
        {({ geographies }: { geographies: GeoFeature[] }) =>
          geographies.map((geo) =>
            isAntarcticGeo(geo) ? null : (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#d8d3cb"
                stroke="rgba(250,248,244,0.78)"
                strokeWidth={0.35}
                style={{
                  default: { outline: 'none' },
                  hover: { outline: 'none' },
                  pressed: { outline: 'none' },
                }}
              />
            ),
          )
        }
      </Geographies>
    </ComposableMap>
  )
}

function DestinationSlider() {
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
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'right' ? 400 : -400, behavior: 'smooth' })
    setTimeout(checkScroll, 400)
  }

  return (
    <>
      {/* Header uitgelijnd met de rest van de content */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 mb-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <h2 className="text-4xl md:text-5xl font-display font-light text-cream!">Recent bezochte bestemmingen</h2>
          <div className="flex items-center gap-5">
            <div className="flex gap-2">
              <button
                onClick={() => scroll('left')}
                className={`w-10 h-10 rounded-full border border-cream/30 flex items-center justify-center transition-all duration-300 ${
                  canScrollLeft ? 'text-cream hover:bg-cream hover:text-forest' : 'text-cream/20 cursor-default'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M19 12H5M5 12l6-6M5 12l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={() => scroll('right')}
                className={`w-10 h-10 rounded-full border border-cream/30 flex items-center justify-center transition-all duration-300 ${
                  canScrollRight ? 'text-cream hover:bg-cream hover:text-forest' : 'text-cream/20 cursor-default'
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M19 12l-6-6M19 12l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <div className="w-px h-5 bg-cream/20" />
            <Link href="/bestemmingen" className="group inline-flex items-center gap-2 text-cream/70 font-semibold text-sm uppercase tracking-[0.1em] hover:text-cream transition-colors">
              <span>Alle bestemmingen</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Slider loopt full-width door, eerste kaart uitgelijnd met content */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing"
        style={{ paddingLeft: '24px', paddingRight: '24px' }}
      >
        {destinations.map((dest) => (
          <Link
            key={dest.slug}
            href={`/bestemmingen/${dest.slug}`}
            className="group block relative flex-shrink-0 w-[300px] md:w-[360px] aspect-[3/4] organic-img overflow-hidden img-zoom"
          >
            <Image src={dest.image} alt={dest.name} fill className="object-cover" sizes="360px" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-accent-dark/85 transition-all duration-500" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="font-display text-2xl text-white! drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">{dest.name}</h3>
            </div>
            <div className="absolute top-4 right-4 w-9 h-9 rounded-full border border-white/40 group-hover:border-accent group-hover:bg-accent flex items-center justify-center transition-all duration-300">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}

/* ─── Page ─── */
type HomePageClientProps = {
  recentPosts: HomeRecentPost[]
}

export function HomePageClient({ recentPosts }: HomePageClientProps) {
  return (
    <main>
      {/* HERO */}
      <section className="relative h-svh flex items-center justify-center overflow-hidden bg-forest-dark">
        <HeroSlideshow />
        <div className="absolute inset-0 bg-gradient-to-t from-forest/60 via-transparent to-transparent z-[1]" />
        <div className="absolute inset-0 z-[1]" style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0.58) 0%, transparent 65%)' }} />
        <div className="relative z-10 w-full pt-16 md:pt-20 -mt-0">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
            <div className="w-full">
              <h1 className="font-display text-white! leading-[1.1] mb-5 md:mb-8 drop-shadow-[0_4px_30px_rgba(0,0,0,0.4)]" style={{ fontSize: 'clamp(1.9rem, 6vw, 4.75rem)' }}>
                De wereld in<br />beeld en verhalen
              </h1>
              <p className="text-white text-[20px] md:text-[22px] max-w-2xl mx-auto leading-relaxed mb-7 md:mb-10 drop-shadow-[0_2px_15px_rgba(0,0,0,0.4)]">
                Beleef de wereld vanuit mijn lens. Als fotograaf en avonturier neem ik je mee naar plekken op de wereld die ik vastleg op mijn manier.<br /><br />Welkom bij Meet the Locals.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/blog"
                  className="group inline-flex items-center gap-3 bg-accent text-white px-6 py-3 md:px-8 md:py-4 organic-btn text-xs md:text-sm uppercase tracking-[0.1em] font-semibold hover:bg-accent-light transition-all duration-300 hover:shadow-[0_8px_30px_-6px_rgba(200,121,82,0.35)]"
                >
                  <span>Ontdek verhalen</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link
                  href="/bestemmingen"
                  className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white px-6 py-3 md:px-8 md:py-4 organic-btn-alt text-xs md:text-sm uppercase tracking-[0.1em] font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20"
                >
                  Bestemmingen
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-2">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-[50px] md:h-[80px] block">
            <path d="M0,80 L0,65 C240,55 480,72 720,62 C960,52 1200,68 1440,60 L1440,80 Z" fill="#F5EFE8" />
          </svg>
        </div>
      </section>

      {/* INTRO */}
      <section className="relative py-24 md:py-32 bg-[#F5EFE8] noise-overlay overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2.75rem]">
                <Image src="/media/DSC_3016-copy-scaled.webp" alt="Reizen" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 42vw" />
              </div>
            </div>
            <div className="lg:col-span-6 lg:pl-8">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-light text-forest leading-[1.1] mb-6">
                Meer dan een <span className="text-accent">reisblog</span>
              </h2>
              <p className="text-text-muted text-[20px] leading-relaxed mb-6 max-w-5xl">
                Welkom, ik ben Daley. Als fotograaf leg ik al jaren de wereld vast, van leuke dorpjes vlakbij mijn huis tot regenwoud in het Amazonegebied van Peru.
              </p>
              <p className="text-text-muted text-[20px] leading-relaxed mb-6 max-w-5xl">
                Op deze website vind je alles over reizen. De mooiste plekken, afgelegen bestemmingen, reisfotografie en reistips. Ook deel ik graag de ins-and-outs in de reiswereld. Daarom is dit meer dan een reisblog. Het is mijn persoonlijke reisplatform, waarop ik de wereld deel vanuit mijn lens en visie. Fotografie staat centraal in alles wat ik doe. Ik zoek hierbij niet alleen fotogenieke landschappen, maar hou juist van het échte leven vastleggen.
              </p>
              <p className="text-text-muted text-[20px] leading-relaxed mb-8 max-w-5xl">
                Niet alleen wat mooi is, maar wat echt is. Want echt is zoveel mooier.
              </p>
              <Link
                href="/over"
                className="group inline-flex items-center gap-3 text-forest font-semibold text-sm uppercase tracking-[0.1em] hover:text-water transition-colors"
              >
                <span>Lees mijn verhaal</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-[60px] md:h-[90px] block">
            <path d="M0,120 L0,70 C180,45 300,85 480,60 C660,35 780,75 960,50 C1140,25 1260,65 1440,45 L1440,120 Z" fill="var(--color-cream)" />
          </svg>
        </div>
      </section>

      {/* RECENT POSTS */}
      <section className="relative py-24 md:py-32 bg-cream">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <h2 className="text-4xl md:text-5xl font-display font-light text-forest">Laatste verhalen</h2>
            <Link href="/blog" className="group inline-flex items-center gap-2 text-forest font-semibold text-sm uppercase tracking-[0.1em]">
              <span>Alle artikelen</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <article key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="group block card-lift">
                  <div className="relative aspect-[4/3] organic-img overflow-hidden img-zoom mb-5">
                    <Image src={post.image} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[15px] uppercase tracking-[0.12em] text-accent font-semibold">{post.category}</span>
                      <span className="text-text-muted/30">|</span>
                      <span className="text-[15px] uppercase tracking-[0.15em] text-text-muted/70">{post.date}</span>
                    </div>
                    <h3 className="text-xl font-display font-light text-forest mb-2 group-hover:text-accent transition-colors">{post.title}</h3>
                    <p className="text-text-muted text-[17px] leading-relaxed line-clamp-2">{post.excerpt}</p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/blog" className="inline-flex items-center gap-3 bg-forest text-cream px-8 py-4 organic-btn text-sm uppercase tracking-[0.1em] font-semibold hover:bg-link-hover transition-all duration-300">
              <span>Lees verder</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* DESTINATIONS — clip-path geeft de sectie een organische bovenkant zodat de
          eigen grain-textuur naadloos doorloopt tot aan de wave-rand. */}
      <section
        className="destinations-texture relative bg-forest text-cream overflow-hidden noise-overlay"
        style={{
          paddingTop: 'calc(10rem + 70px)',
          paddingBottom: '10rem',
          marginTop: '-70px',
        }}
      >
        {/* Top wave — vervangt clip-path zodat sectie altijd 100% breed is */}
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-10">
          <svg viewBox="0 0 1440 70" preserveAspectRatio="none" className="block h-[70px] w-full md:h-[90px]">
            <path d="M0,0 L0,41 C200,60 400,23 600,45 C800,68 1000,26 1200,41 C1350,53 1400,34 1440,38 L1440,0 Z" fill="var(--color-warm-white)" />
          </svg>
        </div>
        <div className="relative z-10">
          <DestinationSlider />
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-2">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-[60px] md:h-[90px] block">
            <path d="M0,120 L0,60 C160,35 320,75 540,50 C760,25 900,70 1100,45 C1300,20 1380,55 1440,40 L1440,120 Z" fill="var(--color-warm-white)" />
          </svg>
        </div>
      </section>

      {/* COMMISSION WORK */}
      <section className="relative py-24 md:py-32 bg-warm-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-light text-forest leading-[1.1] mb-6">
                Werk in opdracht
              </h2>
              <p className="text-text-muted text-[20px] leading-relaxed mb-6 max-w-5xl">
                Een greep uit het werk dat ik heb gedaan in opdracht van bedrijven in of verwant aan de reisbranche en horeca.
              </p>
              <div className="flex flex-col gap-3 mb-10">
                {[
                  'Reportagefotografie',
                  'Hotel en B&B fotografie',
                  'Fotografie voor reisbureaus, touroperators en bedrijven in de reisbranche',
                  'Webdesign in reisbranche',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-[20px] text-forest/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-[5px]" />
                    {item}
                  </div>
                ))}
              </div>
              <Link href="/fotografie" className="group inline-flex items-center gap-3 bg-accent text-white px-8 py-4 organic-btn text-sm uppercase tracking-[0.1em] font-semibold hover:bg-accent-light transition-all duration-300">
                <span>Bekijk mijn werk</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-4">
              <div className="col-span-1 md:col-span-7 space-y-3 md:space-y-4">
                <div className="aspect-[3/4] organic-img overflow-hidden relative">
                  <Image src="/media/Ayuthayya-1-9-scaled.webp" alt="Reisfotografie voorbeeld" fill className="object-cover" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 58vw, 29vw" />
                </div>
                <div className="aspect-square organic-img-alt overflow-hidden relative">
                  <Image src="/media/Franksunset-scaled.webp" alt="Zonsondergang fotografie" fill className="object-cover" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 58vw, 29vw" />
                </div>
              </div>
              <div className="col-span-1 md:col-span-5 space-y-3 md:space-y-4 pt-8 md:pt-12">
                <div className="aspect-square organic-img overflow-hidden relative">
                  <Image src="/media/Batucaves-6-scaled.webp" alt="Batu Caves Maleisië" fill className="object-cover" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 42vw, 21vw" />
                </div>
                <div className="aspect-[3/4] organic-img-alt overflow-hidden relative">
                  <Image src="/media/DJI_20240517152816_0082_D-scaled.webp" alt="Drone fotografie Indonesië" fill className="object-cover" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 42vw, 21vw" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REISBLOG PILLS */}
      <section className="py-16 md:py-20 bg-cream">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(340px,520px)_1fr] md:items-center gap-10 md:gap-16">
            <h2 className="text-3xl md:text-4xl font-display uppercase text-forest leading-[1.2] flex-shrink-0">
              Ontdek de werelddelen
            </h2>
            <div className="relative min-h-[145px] max-w-[560px] md:min-h-[165px] md:max-w-[620px] overflow-hidden">
              <div className="pointer-events-none absolute -inset-6 opacity-85" aria-hidden="true">
                <ContinentMapBackdrop />
              </div>
              <div className="relative z-10 flex min-h-[145px] flex-wrap items-center gap-3 md:min-h-[165px]">
                {continents.map((item) => (
                  <Link key={item.value} href={`/blog?werelddeel=${item.value}`} className="px-6 py-3 bg-cream-dark/75 text-forest/75 rounded-full text-sm font-medium backdrop-blur-[1px] hover:bg-accent hover:text-white transition-all duration-300">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="relative py-6 bg-accent overflow-hidden">
        <div className="animate-marquee flex whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex items-center gap-8 mr-8">
              {['Maleisië', 'Peru', 'Thailand', 'Indonesië', 'Japan', 'Colombia', 'Marokko', 'Sri Lanka'].map((place) => (
                <span key={`${place}-${i}`} className="flex items-center gap-8">
                  <span className="text-white/90 text-sm uppercase tracking-[0.2em] font-medium">{place}</span>
                  <span className="text-white/60">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* HIGHLIGHTS */}
      <section className="relative py-24 md:py-32 bg-cream">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-light text-forest">Wat je hier vindt</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                ),
                title: 'Lokale adresjes',
                text: 'De fijnste eetadresjes en verborgen plekken, zelf ontdekt en gefotografeerd.',
                cardClass: 'bg-water-muted border-water-light/50',
                iconClass: 'bg-white/55 text-water',
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                  </svg>
                ),
                title: 'Onbekende plekken',
                text: 'De stille dorpen, uitzichten en hoeken die de toeristische route links laat liggen.',
                cardClass: 'bg-[#fdf7e3] border-sand/30',
                iconClass: 'bg-white/55 text-link-hover',
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="14" rx="2" />
                    <circle cx="12" cy="11" r="4" />
                    <circle cx="20" cy="6" r="1" fill="currentColor" />
                  </svg>
                ),
                title: 'Reisfotografie',
                text: 'Mijn werk als fotograaf, en de plekken zoals ik ze door de lens zag.',
                cardClass: 'bg-accent-muted border-accent/15',
                iconClass: 'bg-white/60 text-accent',
              },
            ].map((item) => (
              <div key={item.title} className={`group organic-card p-8 md:p-10 card-lift border transition-colors ${item.cardClass}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-white/80 ${item.iconClass}`}>
                  {item.icon}
                </div>
                <h3 className="font-serif text-xl font-bold text-forest mb-3">{item.title}</h3>
                <p className="text-text-muted leading-relaxed text-[17px]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER CTA */}
      <NewsletterCTA />
    </main>
  )
}
