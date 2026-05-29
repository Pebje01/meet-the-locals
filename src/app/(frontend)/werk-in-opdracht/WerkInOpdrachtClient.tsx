'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export type Commission = {
  /** Korte koptekst die verschijnt bij hover onder de afbeelding */
  cardTitle: string
  /** Volledige beschrijving (optioneel, voor intern gebruik) */
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

function ProjectCard({ project, index }: { project: Commission; index: number }) {
  const CardWrapper = project.link
    ? ({ children }: { children: React.ReactNode }) => (
        <a
          href={project.link!.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block focus:outline-none"
        >
          {children}
        </a>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <div className="group block">{children}</div>
      )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, delay: 0.06 * index }}
    >
      <CardWrapper>
        {/* Afbeelding — inkort visueel op hover door upward shift */}
        <div className="relative overflow-hidden rounded-3xl aspect-[3/4]">
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            className="object-cover transition-all duration-700 ease-out group-hover:scale-[1.06] group-hover:-translate-y-[4%]"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={index === 0}
          />
        </div>

        {/* Koptekst — verschijnt onder de afbeelding bij hover (grid-rows techniek) */}
        <div className="grid [grid-template-rows:0fr] group-hover:[grid-template-rows:1fr] transition-[grid-template-rows] duration-500 ease-out">
          <div className="overflow-hidden min-h-0">
            <h3
              className="pt-5 font-display font-bold text-white leading-tight"
              style={{ fontSize: 'clamp(17px, 2vw, 22px)' }}
            >
              {project.cardTitle}
            </h3>
          </div>
        </div>
      </CardWrapper>
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
