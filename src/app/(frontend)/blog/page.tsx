'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.19, 1, 0.22, 1] as const } },
}
const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

const posts = [
  {
    title: 'Twee weken route door Maleisië',
    slug: 'route-maleisie-twee-weken',
    image: '/media/maleisie-7-scaled.webp',
    excerpt: 'Van Kuala Lumpur naar Langkawi — de ultieme route door het mooiste van Maleisië. We ontdekten verborgen stranden, proefden streetfood en ontmoetten de vriendelijkste mensen.',
    category: 'Zuidoost-Azië',
    date: '14 feb 2026',
  },
  {
    title: '3 weken rondreizen door Peru',
    slug: '3-weken-rondreizen-door-peru',
    image: '/media/cusco-12-scaled.webp',
    excerpt: 'Lima, Cusco, Machu Picchu en de Amazone — alles wat je moet weten voor de perfecte rondreis door Peru.',
    category: 'Zuid-Amerika',
    date: '28 jan 2026',
  },
  {
    title: 'Hoe Machu Picchu kaartjes kopen als het uitverkocht is',
    slug: 'machu-picchu-zonder-kaartje-gekocht',
    image: '/media/DSC_3016-copy-scaled.webp',
    excerpt: 'Uitverkocht? Geen paniek. Zo koop je alsnog kaartjes voor Machu Picchu — getest en bewezen.',
    category: 'Peru',
    date: '12 jan 2026',
  },
  {
    title: 'De mooiste tempels van Ayutthaya',
    slug: 'mooiste-tempels-ayutthaya',
    image: '/media/Ayuthayya-1-4-scaled.webp',
    excerpt: 'Een dagtrip vanuit Bangkok naar de historische tempels van Ayutthaya. Welke moet je zien en welke kun je overslaan?',
    category: 'Thailand',
    date: '3 jan 2026',
  },
  {
    title: 'Streetfood tour door Bangkok',
    slug: 'streetfood-bangkok',
    image: '/media/bangkok-scaled.webp',
    excerpt: 'Van pad thai op straat tot verborgen food courts — de beste plekken om te eten in Bangkok zonder toeristenprijzen.',
    category: 'Thailand',
    date: '18 dec 2025',
  },
  {
    title: 'Langkawi: het relaxte eiland van Maleisië',
    slug: 'langkawi-maleisie',
    image: '/media/langkawi-scaled.webp',
    excerpt: 'Waarom Langkawi het perfecte eiland is om even helemaal tot rust te komen. Plus de beste tips voor budget reizigers.',
    category: 'Zuidoost-Azië',
    date: '5 dec 2025',
  },
  {
    title: 'Fotografie in de woestijn: tips en gear',
    slug: 'fotografie-woestijn',
    image: '/media/woestijn-9-scaled.webp',
    excerpt: 'Hoe bescherm je je camera tegen zand? En hoe vang je het perfecte licht in de woestijn? Mijn beste tips.',
    category: 'Reisfotografie',
    date: '20 nov 2025',
  },
  {
    title: 'De heilige vallei van Peru',
    slug: 'heilige-vallei-peru',
    image: '/media/DSC_3088-scaled.webp',
    excerpt: 'Vergeet Machu Picchu even — de Sacred Valley heeft minstens zoveel te bieden. Ontdek de lokale markten, ruïnes en dorpjes.',
    category: 'Peru',
    date: '8 nov 2025',
  },
  {
    title: 'Cameron Highlands: theeplantages en jungle',
    slug: 'cameron-highlands-maleisie',
    image: '/media/Cameronhighlands-1-scaled.webp',
    excerpt: 'Een verfrissende ontsnapping uit de hitte. Wandel door theeplantages, ontdek de Mossy Forest en proef de beste scones van Azië.',
    category: 'Zuidoost-Azië',
    date: '25 okt 2025',
  },
]

const categories = [
  { name: 'Alles', slug: '' },
  { name: 'Zuidoost-Azië', slug: 'zuidoost-azie' },
  { name: 'Zuid-Amerika', slug: 'zuid-amerika' },
  { name: 'Reisfotografie', slug: 'reisfotografie' },
  { name: 'Thailand', slug: 'thailand' },
  { name: 'Peru', slug: 'peru' },
]

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-warm-white">
      {/* Hero */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 bg-forest noise-overlay overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-6xl lg:text-7xl font-display text-white! leading-[1.05] mb-6"
            >
              Reisverhalen &amp; Tips
            </motion.h1>
            <motion.p variants={fadeUp} className="text-white/70 text-lg md:text-xl max-w-2xl leading-relaxed">
              Persoonlijke verhalen, praktische tips en reisfotografie van bestemmingen wereldwijd.
            </motion.p>
          </motion.div>
        </div>
        {/* Soft organic edge */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-[50px] md:h-[75px] block">
            <defs>
              <filter id="blogRough" x="-5%" y="-30%" width="110%" height="160%">
                <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" seed="5" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>
            <rect x="-20" y="45" width="1480" height="70" fill="var(--color-warm-white)" filter="url(#blogRough)" />
            <rect x="0" y="75" width="1440" height="30" fill="var(--color-warm-white)" />
          </svg>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 border-b border-cream-dark/50 bg-warm-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            {categories.map((cat, i) => (
              <button
                key={cat.slug}
                className={`flex-shrink-0 px-5 py-2 rounded-full text-[12px] uppercase tracking-[0.1em] font-semibold transition-all duration-300 ${
                  i === 0
                    ? 'bg-forest text-cream'
                    : 'bg-cream text-forest hover:bg-accent hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            <Link href={`/blog/${posts[0].slug}`} className="group block">
              <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div className="relative aspect-[4/3] organic-img overflow-hidden img-zoom">
                  <Image
                    src={posts[0].image}
                    alt={posts[0].title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div>
                  <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-[11px] uppercase tracking-[0.12em] font-semibold rounded-full mb-4">
                    {posts[0].category}
                  </span>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-forest leading-[1.1] mb-4 group-hover:text-accent transition-colors">
                    {posts[0].title}
                  </h2>
                  <p className="text-text-muted text-lg leading-relaxed mb-6 max-w-lg">
                    {posts[0].excerpt}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] uppercase tracking-[0.15em] text-text-muted/70">{posts[0].date}</span>
                    <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-2 text-accent font-semibold text-sm uppercase tracking-[0.1em]">
                      Lees meer
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Post Grid */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {posts.slice(1).map((post) => (
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
                      <span className="text-text-muted/50">|</span>
                      <span className="text-[11px] uppercase tracking-[0.15em] text-text-muted/70">{post.date}</span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-forest mb-2 group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-text-muted text-[15px] leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>
    </main>
  )
}
