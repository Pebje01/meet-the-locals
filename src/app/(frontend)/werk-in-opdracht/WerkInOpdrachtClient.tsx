'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export type Commission = {
  title: string
  client: string
  role: string
  year: string
  location?: string
  description: string
  image: string
  imageAlt: string
  tags: string[]
  link?: { label: string; url: string }
}

export const commissions: Commission[] = [
  {
    title: 'Kip Caravans',
    client: 'Kip Caravans',
    role: 'Foto, drone & video',
    year: '2024',
    location: 'Noorwegen',
    description:
      'Op contentreis voor Kip Caravans naar het indrukwekkende Noorwegen. De gloednieuwe Kip Kompakt caravan gefotografeerd en gefilmd met camera en drone, beelden voornamelijk bedoeld voor hun social media.',
    image: '/media/kip-caravans.webp',
    imageAlt: 'Kip Kompakt caravan in een Noors landschap',
    tags: ['Fotografie', 'Dronefotografie', 'Dronevideo', 'Travel content'],
    link: {
      label: 'Bekijk op Behance',
      url: 'https://www.behance.net/gallery/239930507/Kip-Caravans-Content',
    },
  },
  // Voeg hier nieuwe opdrachten toe
]

function ProjectCard({ project, index }: { project: Commission; index: number }) {
  const num = String(index + 1).padStart(2, '0')

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, delay: 0.06 * index }}
      className="group relative"
    >
      {/* Afbeelding met hover overlay */}
      <div className="relative overflow-hidden rounded-3xl aspect-[3/4]">
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={index === 0}
        />

        {/* Overlay — blijft donker want staat over een foto */}
        <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-8 bg-gradient-to-t from-forest-dark/95 via-forest-dark/60 to-forest-dark/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">

          {/* Groot projectnummer op achtergrond */}
          <span
            className="absolute top-5 right-6 font-display font-bold text-cream/15 select-none leading-none pointer-events-none"
            style={{ fontSize: 96 }}
          >
            {num}
          </span>

          <div>
            <span className="block text-[11px] uppercase tracking-[0.18em] font-semibold text-accent mb-2">
              {project.role}{project.location ? ` · ${project.location}` : ''}
            </span>

            <h3 className="font-display font-bold text-cream leading-tight mb-3" style={{ fontSize: 24 }}>
              {project.title}
            </h3>

            <p className="text-cream/65 text-[13px] leading-relaxed mb-5 line-clamp-3">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full border border-cream/20 text-cream/55 text-[11px]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {project.link && (
              <a
                href={project.link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-cream text-[12px] font-semibold uppercase tracking-[0.12em] hover:gap-3 transition-all duration-200"
              >
                {project.link.label}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Minimale info onder de kaart */}
      <div className="mt-4 px-1 flex items-start justify-between gap-4">
        <div>
          <span className="block text-forest-dark/20 text-[10px] font-bold tracking-[0.25em] uppercase mb-0.5">
            {num}
          </span>
          <h3 className="font-display font-bold text-forest-dark text-[16px] leading-snug">
            {project.title}
          </h3>
          <span className="text-forest-dark/40 text-[12px] mt-0.5 block">
            {project.role}
          </span>
        </div>
        <span className="text-forest-dark/30 text-[12px] font-medium mt-1 whitespace-nowrap">
          {project.year}
        </span>
      </div>
    </motion.article>
  )
}

export function WerkInOpdrachtClient() {
  const leftCol = commissions.filter((_, i) => i % 2 === 0)
  const rightCol = commissions.filter((_, i) => i % 2 === 1)

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#e8f2e8' }}>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-36 pb-20 md:pt-48 md:pb-24 lg:px-10">
        <div className="relative z-10 max-w-[1400px] mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-accent mb-5"
          >
            Samenwerken
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.06 }}
            className="font-display font-bold text-forest-dark leading-[0.92] tracking-[-0.02em]"
            style={{ fontSize: 'clamp(52px, 9vw, 112px)' }}
          >
            Geselecteerde
            <br />
            <span className="text-forest-dark/30">opdrachten</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.12 }}
            className="mt-10 max-w-xl text-forest-dark/55 text-base md:text-lg leading-relaxed"
          >
            Reis, content en fotografie in opdracht. Van contentreizen tot
            merkverhalen, hier vind je een selectie van het werk dat ik voor
            klanten maak.{' '}
            <Link href="/contact" className="text-forest-dark/70 underline underline-offset-4 hover:text-forest-dark transition-colors">
              Iets in gedachten?
            </Link>
          </motion.p>
        </div>
      </section>

      {/* Projecten */}
      <section className="px-6 pb-32 md:pb-40 lg:px-10">
        <div className="max-w-[1400px] mx-auto">
          {commissions.length === 0 ? (
            <div className="py-32 text-center border border-forest-dark/10 rounded-3xl">
              <p className="text-forest-dark/30 text-lg">De eerste opdrachten komen eraan.</p>
            </div>
          ) : commissions.length === 1 ? (
            <div className="max-w-lg mx-auto">
              <ProjectCard project={commissions[0]!} index={0} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7 items-start">
              <div className="flex flex-col gap-5 md:gap-7">
                {leftCol.map((project, i) => (
                  <ProjectCard key={project.title} project={project} index={i * 2} />
                ))}
              </div>
              <div className="flex flex-col gap-5 md:gap-7 md:pt-[100px]">
                {rightCol.map((project, i) => (
                  <ProjectCard key={project.title} project={project} index={i * 2 + 1} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Scheidingslijn */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="border-t border-forest-dark/10" />
      </div>

      {/* CTA */}
      <section className="px-6 py-24 md:py-32 lg:px-10">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-10"
          >
            <div>
              <span className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-accent mb-4">
                Contact
              </span>
              <h2
                className="font-display font-bold text-forest-dark leading-tight"
                style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}
              >
                Iets moois
                <br />
                <span className="text-forest-dark/30">te vertellen?</span>
              </h2>
            </div>

            <div className="flex flex-col gap-5 md:items-end">
              <p className="text-forest-dark/50 text-base leading-relaxed max-w-sm md:text-right">
                Of het nu om een contentreis, fotografie of een compleet
                merkverhaal gaat: stuur een bericht en we kijken samen
                wat er mogelijk is.
              </p>
              <Link
                href="/contact"
                className="self-start md:self-auto inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-forest-dark text-cream font-semibold text-sm uppercase tracking-[0.1em] hover:bg-accent hover:text-white transition-all duration-300"
              >
                Neem contact op
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
