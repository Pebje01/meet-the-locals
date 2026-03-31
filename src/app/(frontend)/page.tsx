'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { TextReveal, LineReveal } from '@/components/TextReveal'

/* ─── Animation Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.19, 1, 0.22, 1] } },
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
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] } },
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
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-[50px] md:h-[75px] block">
            <defs>
              <filter id="roughEdge" x="-5%" y="-30%" width="110%" height="160%">
                <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" seed="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>
            <rect x="-20" y="45" width="1480" height="70" fill="white" filter="url(#roughEdge)" />
            <rect x="0" y="75" width="1440" height="30" fill="white" />
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
              {/* Floating accent card */}
              <motion.div
                variants={fadeUp}
                className="absolute -bottom-6 -right-4 md:right-8 bg-accent text-white px-6 py-4 organic-btn shadow-xl"
              >
                <span className="block text-3xl font-display font-light">15+</span>
                <span className="text-[11px] uppercase tracking-[0.15em] text-white/80">Landen bezocht</span>
              </motion.div>
            </div>

            {/* Right text */}
            <div className="lg:col-span-7 lg:pl-8">
              <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
                <span className="w-8 h-[1px] bg-accent" />
                <span className="text-[11px] uppercase tracking-[0.25em] text-accent font-semibold">Over Meet the Locals</span>
              </motion.div>

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
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-[50px] md:h-[75px] block">
            <defs>
              <filter id="waveEdge1" x="-5%" y="-30%" width="110%" height="160%">
                <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" seed="7" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>
            <rect x="-20" y="45" width="1480" height="70" fill="var(--color-cream)" filter="url(#waveEdge1)" />
            <rect x="0" y="75" width="1440" height="30" fill="var(--color-cream)" />
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
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-[1px] bg-accent" />
                  <span className="text-[11px] uppercase tracking-[0.25em] text-accent font-semibold">Blog</span>
                </div>
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

            {/* Featured post (large) + 2 smaller */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Featured */}
              <motion.article variants={scaleIn} className="lg:row-span-2">
                <Link href={`/blog/${recentPosts[0].slug}`} className="group block h-full">
                  <div className="relative h-full min-h-[350px] md:min-h-[500px] organic-card overflow-hidden img-zoom card-lift">
                    <Image
                      src={recentPosts[0].image}
                      alt={recentPosts[0].title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/90 via-forest-dark/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                      <span className="inline-block px-3 py-1 bg-accent text-white text-[11px] uppercase tracking-[0.12em] font-semibold rounded-full mb-4">
                        {recentPosts[0].category}
                      </span>
                      <h3 className="text-2xl md:text-3xl font-display font-light text-white mb-3 group-hover:text-accent-light transition-colors">
                        {recentPosts[0].title}
                      </h3>
                      <p className="text-white/70 leading-relaxed mb-4 max-w-md">{recentPosts[0].excerpt}</p>
                      <span className="text-[11px] uppercase tracking-[0.15em] text-white/60">{recentPosts[0].date}</span>
                    </div>
                  </div>
                </Link>
              </motion.article>

              {/* Smaller posts */}
              {recentPosts.slice(1).map((post) => (
                <motion.article key={post.slug} variants={fadeUp}>
                  <Link href={`/blog/${post.slug}`} className="group flex flex-col md:flex-row gap-6 bg-warm-white organic-card-alt overflow-hidden card-lift">
                    <div className="relative w-full md:w-[280px] flex-shrink-0 aspect-[4/3] md:aspect-auto md:min-h-full organic-img-alt overflow-hidden img-zoom">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 280px"
                      />
                    </div>
                    <div className="flex flex-col justify-center py-5 px-5 md:px-0 md:pr-6">
                      <span className="text-[11px] uppercase tracking-[0.12em] text-accent font-semibold mb-2">
                        {post.category}
                      </span>
                      <h3 className="text-xl font-display font-light text-forest mb-2 group-hover:text-accent transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-text-muted text-sm leading-relaxed mb-3">{post.excerpt}</p>
                      <span className="text-[11px] uppercase tracking-[0.15em] text-text-muted/70">{post.date}</span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </div>
        {/* Wave: cream → forest */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-[50px] md:h-[75px] block">
            <defs>
              <filter id="waveEdge2" x="-5%" y="-30%" width="110%" height="160%">
                <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" seed="12" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>
            <rect x="-20" y="45" width="1480" height="70" fill="var(--color-forest)" filter="url(#waveEdge2)" />
            <rect x="0" y="75" width="1440" height="30" fill="var(--color-forest)" />
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
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-[1px] bg-accent" />
                  <span className="text-[11px] uppercase tracking-[0.25em] text-accent font-semibold">Bestemmingen</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-light">Waar ben ik geweest?</h2>
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

            {/* Draggable slider */}
            <motion.div
              className="overflow-hidden cursor-grab active:cursor-grabbing"
            >
              <motion.div
                drag="x"
                dragConstraints={{ right: 0, left: -(destinations.length * 310 - (typeof window !== 'undefined' ? window.innerWidth : 1400) + 100) }}
                dragElastic={0.1}
                className="flex gap-6"
              >
                {destinations.map((dest, i) => (
                  <motion.div
                    key={dest.slug}
                    variants={fadeUp}
                    custom={i}
                    className="flex-shrink-0 w-[260px] md:w-[300px]"
                  >
                    <Link href={`/bestemmingen/${dest.slug}`} className="group block relative aspect-[3/4] organic-img overflow-hidden img-zoom">
                      <Image
                        src={dest.image}
                        alt={dest.name}
                        fill
                        className="object-cover"
                        sizes="300px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/80 via-transparent to-transparent group-hover:from-accent-dark/80 transition-all duration-500" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="font-serif text-2xl font-bold text-white mb-1">{dest.name}</h3>
                        <span className="text-[11px] uppercase tracking-[0.15em] text-white/70 transition-colors">
                          {dest.count}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-accent/0 group-hover:bg-accent flex items-center justify-center transition-all duration-300 scale-0 group-hover:scale-100">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M7 17L17 7M17 7H7M17 7V17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        {/* Wave: forest → warm-white */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-[50px] md:h-[75px] block">
            <defs>
              <filter id="waveEdge3" x="-5%" y="-30%" width="110%" height="160%">
                <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" seed="19" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>
            <rect x="-20" y="45" width="1480" height="70" fill="white" filter="url(#waveEdge3)" />
            <rect x="0" y="75" width="1440" height="30" fill="white" />
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
              <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
                <span className="w-8 h-[1px] bg-accent" />
                <span className="text-[11px] uppercase tracking-[0.25em] text-accent font-semibold">Reisfotografie</span>
              </motion.div>

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
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="w-8 h-[1px] bg-accent" />
                <span className="text-[11px] uppercase tracking-[0.25em] text-accent font-semibold">Waarom MTL</span>
                <span className="w-8 h-[1px] bg-accent" />
              </div>
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
