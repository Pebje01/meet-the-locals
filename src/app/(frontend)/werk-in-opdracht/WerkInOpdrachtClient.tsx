'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export type Commission = {
  cardTitle: string
  modalTitle?: string
  description?: string
  client?: string
  tags?: string[]
  image: string
  imageAlt: string
  images?: string[]   // extra foto's voor de slider
  link?: { url: string }
  linkLabel?: string
}

export const commissions: Commission[] = [
  {
    cardTitle: 'Fotografie en dronebeelden voor Kip Caravans',
    modalTitle: 'Fotografie, dronefotografie en video voor Kip Caravans',
    description:
      'Content reis naar Noorwegen voor Kip Caravans. Fotografie, dronefotografie en video van de Kip Kompakt polar blue in het Noorse fjordenlandschap.',
    client: 'Kip Caravans',
    tags: ['Fotografie', 'Content', 'Drone', 'Video', 'Dronefotografie'],
    image: 'https://mir-s3-cdn-cf.behance.net/project_modules/1400_webp/a07e40239930507.693376d2b9c8a.png',
    imageAlt: 'Kip Kompakt caravan in een Noors landschap',
    images: [
      // Landschap/Noorwegen
      'https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/1a2c90239930507.69337c3b41f24.jpg',
      'https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/e57107239930507.69337c3c39f83.jpg',
      'https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/2b116e239930507.693376d18a367.jpg',
      // Met mensen
      'https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/c6e05f239930507.69337c3c39879.jpg',
      'https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/50548f239930507.69337c43c525e.jpg',
      'https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/4f5d78239930507.69337c43c5bf0.jpg',
      // Drone
      'https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/f71c67239930507.69337c4238b4a.jpg',
      'https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/472bd4239930507.69337c4238607.jpg',
      'https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/935404239930507.69337c46218dd.jpg',
      'https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/b7b704239930507.69337c4620ee1.jpg',
      'https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/5ea60f239930507.69337c4537808.jpg',
      'https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/60cf77239930507.69337c4537d0c.jpg',
      // Portret/detail
      'https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/9a3e6c239930507.69337c3e75beb.jpg',
      'https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/c52a13239930507.69337c3e76c6c.jpg',
    ],
    link: {
      url: 'https://www.behance.net/gallery/239930507/Kip-Caravans-Content',
    },
    linkLabel: 'Bekijk op Behance',
  },
  // Voeg hier nieuwe opdrachten toe
]

const TEXT_HEIGHT = 76 // px — hoogte van de tekstbalk bij hover

// ─────────────────────────────────────────────────────────────────
// ProjectCard
// ─────────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Commission
  index: number
  onOpen: (project: Commission) => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, delay: 0.06 * index }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => onOpen(project)}
        onKeyDown={(e) => e.key === 'Enter' && onOpen(project)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '1.5rem',
          overflow: 'hidden',
          aspectRatio: '3/4',
          cursor: 'pointer',
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

        {/* Tekst + pijl — groeit van 0 naar TEXT_HEIGHT op hover */}
        <div
          style={{
            height: hovered ? `${TEXT_HEIGHT}px` : '0px',
            overflow: 'hidden',
            transition: 'height 500ms ease',
            backgroundColor: '#2b4a2a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingRight: '16px',
            flexShrink: 0,
          }}
        >
          <h3
            style={{
              fontFamily: "'oslla', Georgia, serif",
              fontWeight: 400,
              color: 'white',
              fontSize: 'clamp(15px, 1.7vw, 20px)',
              lineHeight: 1.25,
              margin: 0,
              flex: 1,
              minWidth: 0,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {project.cardTitle}
          </h3>

          {/* Handgetekende pijl — schuin omhoog rechts */}
          <div
            style={{
              flexShrink: 0,
              marginLeft: '14px',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: '1.5px solid rgba(255,255,255,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'border-color 300ms ease, background 300ms ease',
              ...(hovered ? {} : {}),
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────
// ImageSlider — gebruikt in de modal
// ─────────────────────────────────────────────────────────────────
function ImageSlider({ slides }: { slides: { src: string; alt: string }[] }) {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent(i => (i - 1 + slides.length) % slides.length)
  const next = () => setCurrent(i => (i + 1) % slides.length)

  return (
    <div className="relative overflow-hidden w-full" style={{ aspectRatio: '16/9' }}>
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={slide.src + i}
          className="absolute inset-0"
          style={{
            transform: `translateX(${(i - current) * 100}%)`,
            transition: 'transform 420ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 680px"
          />
        </div>
      ))}

      {/* Pijlknoppen — alleen bij meer dan 1 foto */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Vorige foto"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <button
            onClick={next}
            aria-label="Volgende foto"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Puntjes */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Foto ${i + 1}`}
                className="rounded-full transition-all duration-200"
                style={{
                  width: i === current ? '20px' : '6px',
                  height: '6px',
                  backgroundColor: i === current ? 'white' : 'rgba(255,255,255,0.45)',
                }}
              />
            ))}
          </div>

          {/* Teller */}
          <div
            className="absolute top-3 right-3 text-[11px] font-semibold text-white px-2 py-0.5 rounded-full"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
          >
            {current + 1} / {slides.length}
          </div>
        </>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// ProjectModal
// ─────────────────────────────────────────────────────────────────
function ProjectModal({
  project,
  onClose,
}: {
  project: Commission
  onClose: () => void
}) {
  // Sluit met Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Vergrendel body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const title = project.modalTitle || project.cardTitle

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-8"
      style={{ backgroundColor: 'rgba(0,0,0,0.72)' }}
      onClick={onClose}
    >
      {/* Modal panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl w-full overflow-hidden flex flex-col"
        style={{ maxWidth: '680px', maxHeight: '90vh' }}
      >
        {/* ── Sticky header ── */}
        <div className="sticky top-0 z-10 bg-white flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2
            className="font-display font-bold leading-tight pr-4"
            style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', color: '#2b4a2a' }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Sluiten"
            className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200"
            style={{ backgroundColor: '#2b4a2a' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3d6b3c' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2b4a2a' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M2 2l10 10M12 2L2 12" />
            </svg>
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto flex-1">
          {/* Slider */}
          <ImageSlider
            slides={[
              { src: project.image, alt: project.imageAlt },
              ...(project.images ?? []).map((src) => ({ src, alt: project.imageAlt })),
            ]}
          />

          {/* Content */}
          <div className="px-6 pt-5 pb-6">
            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-semibold uppercase tracking-[0.1em] px-3 py-1 organic-btn-alt"
                    style={{ border: '1.5px solid #2b4a2a', color: '#2b4a2a' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            {project.description && (
              <p className="text-gray-700 text-[15px] leading-relaxed mb-4">
                {project.description}
              </p>
            )}

            {/* Client */}
            {project.client && (
              <p className="text-[13px] text-gray-400">
                <span className="font-semibold text-gray-500">Klant:</span>{' '}
                {project.client}
              </p>
            )}
          </div>
        </div>

        {/* ── Sticky footer ── */}
        {project.link && (
          <div className="sticky bottom-0 z-10 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-between">
            <span className="text-[13px] text-gray-400">
              Bekijk het volledige project
            </span>
            <a
              href={project.link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 organic-btn text-white text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors duration-200"
              style={{ backgroundColor: '#2b4a2a' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#3d6b3c' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#2b4a2a' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              {project.linkLabel || 'Bekijk op Behance'}
            </a>
          </div>
        )}
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Main page component
// ─────────────────────────────────────────────────────────────────
export function WerkInOpdrachtClient() {
  const [activeProject, setActiveProject] = useState<Commission | null>(null)

  const openProject = useCallback((project: Commission) => {
    setActiveProject(project)
  }, [])

  const closeProject = useCallback(() => {
    setActiveProject(null)
  }, [])

  const leftCol = commissions.filter((_, i) => i % 2 === 0)
  const rightCol = commissions.filter((_, i) => i % 2 === 1)

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#2b4a2a' }}>

      {/* Modal */}
      <AnimatePresence>
        {activeProject && (
          <ProjectModal project={activeProject} onClose={closeProject} />
        )}
      </AnimatePresence>

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
            <span className="text-white">opdrachten</span>
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
              <ProjectCard project={commissions[0]!} index={0} onOpen={openProject} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7 items-start">
              <div className="flex flex-col gap-5 md:gap-7">
                {leftCol.map((project, i) => (
                  <ProjectCard key={project.cardTitle} project={project} index={i * 2} onOpen={openProject} />
                ))}
              </div>
              <div className="flex flex-col gap-5 md:gap-7 md:pt-[100px]">
                {rightCol.map((project, i) => (
                  <ProjectCard key={project.cardTitle} project={project} index={i * 2 + 1} onOpen={openProject} />
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
