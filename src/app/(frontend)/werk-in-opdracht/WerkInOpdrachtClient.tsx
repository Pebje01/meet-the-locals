'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'

export type Commission = {
  cardTitle: string
  description?: string
  image: string
  imageAlt: string
  link?: { url: string }
}

export const commissions: Commission[] = [
  {
    cardTitle: 'Fotografie, dronefotografie en video voor Kip Caravans',
    description:
      'Fotografie, dronefotografie en video van een content reis naar Noorwegen voor Kip Caravans. Kip Kompakt polar blue.',
    image: '/media/kip-caravans.webp',
    imageAlt: 'Kip Kompakt caravan in een Noors landschap',
    link: {
      url: 'https://www.behance.net/gallery/239930507/Kip-Caravans-Content',
    },
  },
  // Voeg hier nieuwe opdrachten toe
]

const TEXT_HEIGHT = 76 // px — hoogte van de tekstbalk bij hover

function ProjectCard({ project, index }: { project: Commission; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, delay: 0.06 * index }}
    >
      <a
        href={project.link?.url}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '1.5rem',
          overflow: 'hidden',
          aspectRatio: '3/4',
          cursor: 'pointer',
          textDecoration: 'none',
        }}
      >
        {/* Afbeelding — krimpt automatisch als tekst groeit */}
        <div
          style={{
            flex: '1 1 auto',
            position: 'relative',
            overflow: 'hidden',
            minHeight: 0,
          }}
        >
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            style={{
              objectFit: 'cover',
              transition: 'transform 700ms ease-out',
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
            }}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={index === 0}
          />
        </div>

        {/* Tekst — groeit van 0 naar TEXT_HEIGHT op hover */}
        <div
          style={{
            height: hovered ? `${TEXT_HEIGHT}px` : '0px',
            overflow: 'hidden',
            transition: 'height 500ms ease',
            backgroundColor: '#2b4a2a',
            display: 'flex',
            alignItems: 'center',
            padding: '0 1.5rem',
            flexShrink: 0,
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              color: 'white',
              fontSize: 'clamp(14px, 1.6vw, 19px)',
              lineHeight: 1.25,
              margin: 0,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {project.cardTitle}
          </h3>
        </div>
      </a>
    </motion.div>
  )
}

export function WerkInOpdrachtClient() {
  const leftCol = commissions.filter((_, i) => i % 2 === 0)
  const rightCol = commissions.filter((_, i) => i % 2 === 1)

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#2b4a2a' }}>

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
            className="font-display font-bold text-white leading-[0.92] tracking-[-0.02em]"
            style={{ fontSize: 'clamp(52px, 9vw, 112px)' }}
          >
            Geselecteerde
            <br />
            <span className="text-white/35">opdrachten</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.12 }}
            className="mt-10 max-w-xl text-white/55 text-base md:text-lg leading-relaxed"
          >
            Reis, content en fotografie in opdracht. Van contentreizen tot
            merkverhalen, hier vind je een selectie van het werk dat ik voor
            klanten maak.{' '}
            <Link href="/contact" className="text-white/75 underline underline-offset-4 hover:text-white transition-colors">
              Iets in gedachten?
            </Link>
          </motion.p>
        </div>
      </section>

      {/* Projecten */}
      <section className="px-6 pb-32 md:pb-40 lg:px-10">
        <div className="max-w-[1400px] mx-auto">
          {commissions.length === 0 ? (
            <div className="py-32 text-center border border-white/10 rounded-3xl">
              <p className="text-white/30 text-lg">De eerste opdrachten komen eraan.</p>
            </div>
          ) : commissions.length === 1 ? (
            <div className="max-w-lg mx-auto">
              <ProjectCard project={commissions[0]!} index={0} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7 items-start">
              <div className="flex flex-col gap-5 md:gap-7">
                {leftCol.map((project, i) => (
                  <ProjectCard key={project.cardTitle} project={project} index={i * 2} />
                ))}
              </div>
              <div className="flex flex-col gap-5 md:gap-7 md:pt-[100px]">
                {rightCol.map((project, i) => (
                  <ProjectCard key={project.cardTitle} project={project} index={i * 2 + 1} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Scheidingslijn */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="border-t border-white/10" />
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
                className="font-display font-bold text-white leading-tight"
                style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}
              >
                Iets moois
                <br />
                <span className="text-white/35">te vertellen?</span>
              </h2>
            </div>

            <div className="flex flex-col gap-5 md:items-end">
              <p className="text-white/50 text-base leading-relaxed max-w-sm md:text-right">
                Of het nu om een contentreis, fotografie of een compleet
                merkverhaal gaat: stuur een bericht en we kijken samen
                wat er mogelijk is.
              </p>
              <Link
                href="/contact"
                className="self-start md:self-auto inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-white text-forest font-semibold text-sm uppercase tracking-[0.1em] hover:bg-accent hover:text-white transition-all duration-300"
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
