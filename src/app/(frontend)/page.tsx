'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useCallback, useState } from 'react'
import { TextReveal, LineReveal } from '@/components/TextReveal'

/* ─── Animation Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.19, 1, 0.22, 1] as const } },
}
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
}
const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}
const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] as const } },
}

/* ─── Data ─── */
const categories = [
  { name: 'Reistips', slug: 'reis-en-budgettips' },
  { name: 'Food', slug: 'food' },
  { name: 'Verhalen', slug: 'bijzondere-verhalen' },
  { name: 'Fotografie', slug: 'reisfotografie' },
  { name: 'Nederland', slug: 'op-nederlandse-bodem' },
]

const recentPosts = [
  {
    title: 'Twee weken route door Maleisië',
    slug: 'route-maleisie-twee-weken',
    image: '/media/maleisie-7-scaled.jpg',
    excerpt: 'Van Kuala Lumpur naar Langkawi — de ultieme route door het mooiste van Maleisië.',
    category: 'Zuidoost-Azië',
    date: '14 feb 2026',
  },
  {
    title: '3 weken rondreizen door Peru',
    slug: '3-weken-rondreizen-door-peru',
    image: '/media/cusco-12-scaled.jpg',
    excerpt: 'Lima, Cusco, Machu Picchu en de Amazone — alles wat je moet weten.',
    category: 'Zuid-Amerika',
    date: '28 jan 2026',
  },
  {
    title: 'Hoe Machu Picchu kaartjes kopen als het uitverkocht is',
    slug: 'machu-picchu-zonder-kaartje-gekocht',
    image: '/media/DSC_3016-copy-scaled.jpg',
    excerpt: 'Uitverkocht? Geen paniek. Zo koop je alsnog kaartjes voor Machu Picchu.',
    category: 'Peru',
    date: '12 jan 2026',
  },
]

const destinations = [
  { name: 'Maleisië', image: '/media/Malaysia-1-7-1-scaled.jpg', slug: 'maleisie', count: '8 artikelen' },
  { name: 'Peru', image: '/media/cusco-12-scaled.jpg', slug: 'peru', count: '12 artikelen' },
  { name: 'Thailand', image: '/media/Ayuthayya-1-4-scaled.jpg', slug: 'thailand', count: '6 artikelen' },
  { name: 'Indonesië', image: '/media/DJI_20240517152816_0082_D-scaled.jpg', slug: 'indonesie', count: '10 artikelen' },
  { name: 'Japan', image: '/media/Shirakawago-3.jpg', slug: 'japan', count: '5 artikelen' },
  { name: 'Marokko', image: '/media/woestijn-9-scaled.jpg', slug: 'marokko', count: '4 artikelen' },
  { name: 'Colombia', image: '/media/Dansenmaloca-scaled.jpg', slug: 'colombia', count: '7 artikelen' },
  { name: 'New York', image: '/media/newyork-1-scaled.jpg', slug: 'new-york', count: '3 artikelen' },
]

const stats = [
  { value: '15+', label: 'Landen bezocht' },
  { value: '50+', label: 'Verhalen gedeeld' },
  { value: '4', label: 'Continenten' },
]

/* ─── Components ─── */
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
    const amount = 400
    el.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' })
    setTimeout(checkScroll, 400)
  }

  return (
    <div className="relative">
      {/* Nav arrows */}
      <div className="absolute -top-16 right-0 flex gap-3 z-10">
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

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing"
      >
        {destinations.map((dest) => (
          <Link
            key={dest.slug}
            href={`/bestemmingen/${dest.slug}`}
            className="group block relative flex-shrink-0 w-[300px] md:w-[360px] aspect-[3/4] organic-img overflow-hidden img-zoom"
          >
            <Image
              src={dest.image}
              alt={dest.name}
              fill
              className="object-cover"
              sizes="360px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-forest-dark/20 to-transparent group-hover:from-accent-dark/80 transition-all duration-500" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="font-display text-2xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">{dest.name}</h3>
            </div>
            {/* Arrow — always visible, fills on hover */}
            <div className="absolute top-4 right-4 w-9 h-9 rounded-full border border-white/40 group-hover:border-accent group-hover:bg-accent flex items-center justify-center transition-all duration-300">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function ParallaxImage({
  src, alt, className, speed = 0.15,
}: {
  src: string; alt: string; className?: string; speed?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [speed * -100, speed * 100])

  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ''}`}>
      <motion.div style={{ y }} className="h-[120%] w-full relative -top-[10%]">
        <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
      </motion.div>
    </div>
  )
}

/* ─── Page ─── */
export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null)
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(heroScroll, [0, 1], [0, 150])
  const heroOpacity = useTransform(heroScroll, [0, 0.6], [1, 0])

  return (
    <main>
      {/* ════════════════════════════════════════
          HERO — Full-bleed
      ════════════════════════════════════════ */}
      <section ref={heroRef} className="relative h-screen min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 -top-[50px]">
          <Image
            src="/media/Shirakawago-3.jpg"
            alt="Turquoise rivier met boten in Azië vanuit de lucht"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest/70 via-transparent to-transparent" />
        </motion.div>
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 w-full"
        >
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="max-w-5xl mx-auto"
            >
              <motion.h1
                variants={fadeUp}
                className="text-[clamp(2.5rem,8vw,6rem)] font-display text-white! leading-[1.05] mb-8 drop-shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
              >
                Ontdek de wereld
                <br />
                door lokale ogen
              </motion.h1>
              <motion.p variants={fadeUp} className="text-white text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 drop-shadow-[0_2px_15px_rgba(0,0,0,0.4)]">
                Persoonlijke reisverhalen, budgettips en fotografie. Van verborgen parels tot bijzondere ontmoetingen.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/blog"
                  className="group inline-flex items-center gap-3 bg-accent text-white px-6 py-3 md:px-8 md:py-4 organic-btn text-xs md:text-sm uppercase tracking-[0.1em] font-semibold hover:bg-accent-light transition-all duration-300 hover:shadow-[0_8px_30px_-6px_rgba(212,132,90,0.35)]"
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
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-[1px] h-8 bg-gradient-to-b from-transparent to-white/40"
          />
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-[30px] md:h-[50px] block">
            <path d="M0,60 L0,30 C180,15 360,45 540,25 C720,5 900,40 1080,20 C1260,0 1380,30 1440,18 L1440,60 Z" fill="white" />
          </svg>
        </div>
      </section>


      {/* ════════════════════════════════════════
          INTRO — Over MTL
      ════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32 bg-white noise-overlay overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center"
          >
            {/* Left images */}
            <div className="lg:col-span-5 relative">
              <motion.div variants={scaleIn}>
                <ParallaxImage
                  src="/media/woestijn-9-scaled.jpg"
                  alt="Woestijn fotografie"
                  className="aspect-[3/4] organic-img"
                />
              </motion.div>
            </div>

            {/* Right text */}
            <div className="lg:col-span-7 lg:pl-8">
              <LineReveal className="mb-6">
                <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl lg:text-6xl font-display font-light text-forest leading-[1.1]">
                  Meer dan een
                  <br />
                  <span className="text-accent">reisblog</span>
                </motion.h2>
              </LineReveal>

              <TextReveal className="text-text-muted text-lg leading-relaxed mb-6 max-w-xl">
                Meet the Locals is een verzameling persoonlijke verhalen over bijzondere ontmoetingen, lokale culturen en de mooiste plekken die je niet in de reisgids vindt.
              </TextReveal>

              <TextReveal className="text-text-muted leading-relaxed mb-8 max-w-xl">
                Van straatfotografie in Bangkok tot verborgen bergdorpjes in Peru — ik deel niet alleen de highlights, maar ook de eerlijke verhalen, budgettips en de mensen die je onderweg tegenkomt.
              </TextReveal>

              <motion.div variants={fadeUp}>
                <Link
                  href="/over"
                  className="group inline-flex items-center gap-3 text-forest font-semibold text-sm uppercase tracking-[0.1em]"
                >
                  <span className="reveal-line">Lees mijn verhaal</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
        {/* Wave: white → cream */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-[60px] md:h-[90px] block">
            <path d="M0,120 L0,70 C180,45 300,85 480,60 C660,35 780,75 960,50 C1140,25 1260,65 1440,45 L1440,120 Z" fill="var(--color-cream)" />
          </svg>
        </div>
      </section>

      {/* ════════════════════════════════════════
          RECENT POSTS — Blog grid
      ════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32 bg-cream">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {/* Section header */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
              <motion.div variants={fadeUp}>
                <h2 className="text-4xl md:text-5xl font-display font-light text-forest">Laatste verhalen</h2>
              </motion.div>
              <motion.div variants={fadeUp}>
                <Link
                  href="/blog"
                  className="group inline-flex items-center gap-2 text-forest font-semibold text-sm uppercase tracking-[0.1em]"
                >
                  <span className="reveal-line">Alle artikelen</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </motion.div>
            </div>

            {/* Post cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <motion.article key={post.slug} variants={fadeUp}>
                  <Link href={`/blog/${post.slug}`} className="group block card-lift">
                    <div className="relative aspect-[4/3] organic-img overflow-hidden img-zoom mb-5">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[11px] uppercase tracking-[0.12em] text-accent font-semibold">
                          {post.category}
                        </span>
                        <span className="text-text-muted/30">|</span>
                        <span className="text-[11px] uppercase tracking-[0.15em] text-text-muted/70">{post.date}</span>
                      </div>
                      <h3 className="text-xl font-display font-light text-forest mb-2 group-hover:text-accent transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-text-muted text-[15px] leading-relaxed line-clamp-2">{post.excerpt}</p>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>

            <motion.div variants={fadeUp} className="mt-12 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-3 bg-forest text-cream px-8 py-4 organic-btn text-sm uppercase tracking-[0.1em] font-semibold hover:bg-link-hover transition-all duration-300"
              >
                <span>Lees verder</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        {/* Wave: cream → forest */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-[60px] md:h-[90px] block">
            <path d="M0,120 L0,55 C200,80 400,30 600,60 C800,90 1000,35 1200,55 C1350,70 1400,45 1440,50 L1440,120 Z" fill="var(--color-forest)" />
          </svg>
        </div>
      </section>

      {/* ════════════════════════════════════════
          DESTINATIONS — Immersive grid
      ════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32 bg-forest text-cream overflow-hidden noise-overlay">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
              <motion.div variants={fadeUp}>
                <h2 className="text-4xl md:text-5xl font-display font-light text-cream!">Recent bezochte bestemmingen</h2>
              </motion.div>
              <motion.div variants={fadeUp}>
                <Link
                  href="/bestemmingen"
                  className="group inline-flex items-center gap-2 text-cream/70 font-semibold text-sm uppercase tracking-[0.1em] hover:text-cream transition-colors"
                >
                  <span>Alle bestemmingen</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </motion.div>
            </div>

            {/* Slider with nav arrows */}
            <DestinationSlider />
          </motion.div>
        </div>
        {/* Wave: forest → warm-white */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-[60px] md:h-[90px] block">
            <path d="M0,120 L0,60 C160,35 320,75 540,50 C760,25 900,70 1100,45 C1300,20 1380,55 1440,40 L1440,120 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ════════════════════════════════════════
          PHOTOGRAPHY — Split section
      ════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32 bg-warm-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center"
          >
            {/* Text */}
            <div>
              <LineReveal className="mb-6">
                <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-display font-light text-forest leading-[1.1]">
                  De mooiste foto&apos;s
                  <br />
                  maak je <span className="text-accent">onderweg</span>
                </motion.h2>
              </LineReveal>

              <TextReveal className="text-text-muted text-lg leading-relaxed mb-6 max-w-lg">
                Leer hoe je jouw reisfoto&apos;s naar een hoger niveau tilt. Van compositie-tips tot gear reviews en bewerkingstutorials.
              </TextReveal>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mb-10">
                {['Tips & Tutorials', 'Gear Reviews', 'Behind the Lens'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-forest/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {item}
                  </div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp}>
                <Link
                  href="/fotografie"
                  className="group inline-flex items-center gap-3 bg-forest text-cream px-8 py-4 organic-btn text-sm uppercase tracking-[0.1em] font-semibold hover:bg-forest-light transition-all duration-300"
                >
                  <span>Ontdek fotografie</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </motion.div>
            </div>

            {/* Photo grid */}
            <motion.div variants={scaleIn} className="grid grid-cols-12 gap-4">
              <div className="col-span-7 space-y-4">
                <ParallaxImage
                  src="/media/Ayuthayya-1-9-scaled.jpg"
                  alt="Reisfotografie voorbeeld"
                  className="aspect-[3/4] organic-img"
                  speed={0.08}
                />
                <ParallaxImage
                  src="/media/Franksunset-scaled.jpg"
                  alt="Zonsondergang fotografie"
                  className="aspect-square organic-img-alt"
                  speed={0.05}
                />
              </div>
              <div className="col-span-5 space-y-4 pt-12">
                <ParallaxImage
                  src="/media/Batucaves-6-scaled.jpg"
                  alt="Batu Caves Maleisië"
                  className="aspect-square organic-img"
                  speed={0.1}
                />
                <ParallaxImage
                  src="/media/DJI_20240517152816_0082_D-scaled.jpg"
                  alt="Drone fotografie Indonesië"
                  className="aspect-[3/4] organic-img-alt"
                  speed={0.06}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          REISBLOG PILLS — Ontdek reisblogs
      ════════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-cream">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className="flex flex-col md:flex-row md:items-center gap-10 md:gap-16"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-display uppercase text-forest leading-[1.2] flex-shrink-0 max-w-xs">
              Ontdek onze
              <br />
              nieuwste reisblogs
            </motion.h2>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              {[
                { label: 'Reisblog Peru', href: '/blog?bestemming=peru' },
                { label: 'Reisblog Maleisië', href: '/blog?bestemming=maleisie' },
                { label: 'Reisblog Thailand', href: '/blog?bestemming=thailand' },
                { label: 'Reisblog Indonesië', href: '/blog?bestemming=indonesie' },
                { label: 'Reisblog Japan', href: '/blog?bestemming=japan' },
                { label: 'Reisblog Colombia', href: '/blog?bestemming=colombia' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-6 py-3 bg-cream-dark/60 text-forest/70 rounded-full text-sm font-medium hover:bg-accent hover:text-white transition-all duration-300"
                >
                  {item.label}
                </Link>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          MARQUEE — Infinite scroll text
      ════════════════════════════════════════ */}
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

      {/* ════════════════════════════════════════
          HIGHLIGHTS — Feature cards
      ════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32 bg-cream">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-light text-forest">Wat je hier vindt</h2>
            </motion.div>

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
                  text: 'De fijnste restaurants, bijzondere accommodaties en hidden gems — getest en goedgekeurd.',
                },
                {
                  icon: (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                    </svg>
                  ),
                  title: 'Lokale ontmoetingen',
                  text: 'De mooiste verhalen komen van de mensen die je onderweg ontmoet. Die ontmoetingen deel ik met jou.',
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
                  text: 'Tips, tutorials en gear reviews. Leer hoe je de mooiste reisfoto\'s maakt met elke camera.',
                },
              ].map((item) => (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  className="group bg-warm-white organic-card p-8 md:p-10 card-lift border border-cream-dark/50 hover:border-accent/20 transition-colors"
                >
                  <div className="w-14 h-14 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                    {item.icon}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-forest mb-3">{item.title}</h3>
                  <p className="text-text-muted leading-relaxed text-[15px]">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
