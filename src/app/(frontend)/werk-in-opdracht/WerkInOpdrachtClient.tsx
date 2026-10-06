'use client'

import Image from 'next/image'
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
  {
    cardTitle: 'Accommodatiefotografie voor Trulli Lupoli, Apulië',
    modalTitle: 'Fotografie voor Trulli Lupoli in Ceglie Messapica, Apulië',
    description:
      'Volledige fotoreportage van Trulli Lupoli, twee authentieke trulli in Ceglie Messapica in Apulië. Van de karakteristieke kegeldaken en de buitenruimtes tot de keuken en de details binnen, beelden die de sfeer van deze bijzondere plek laten zien voor website, boekingsplatforms en promotie.',
    client: 'Trulli Lupoli',
    tags: ['Fotografie', 'Accommodatie', 'Interieur', 'Reisfotografie'],
    image: '/media/trulli-home-1.webp',
    imageAlt: 'Trulli Lupoli, twee trulli in Ceglie Messapica, Apulië',
    images: [
      '/media/trulli-home-2.webp',
      '/media/trulli-lupoli-1.webp',
      '/media/trulli-lupoli-2.webp',
      '/media/trulli-lupoli-3.webp',
      '/media/trulli-lupoli-4.webp',
      '/media/trulli-lupoli-5.webp',
      '/media/trulli-lupoli-6.webp',
      '/media/trulli-lupoli-7.webp',
      '/media/trulli-lupoli-8.webp',
      '/media/trulli-lupoli-9.webp',
      '/media/trulli-lupoli-10.webp',
      '/media/trulli-lupoli-11.webp',
      '/media/trulli-lupoli-12.webp',
      '/media/trulli-lupoli-13.webp',
      '/media/trulli-lupoli-14.webp',
      '/media/trulli-lupoli-15.webp',
      '/media/trulli-lupoli-16.webp',
      '/media/trulli-lupoli-17.webp',
      '/media/trulli-lupoli-18.webp',
      '/media/trulli-lupoli-19.webp',
      '/media/trulli-lupoli-20.webp',
      '/media/trulli-lupoli-21.webp',
      '/media/trulli-lupoli-22.webp',
      '/media/trulli-lupoli-23.webp',
      '/media/trulli-lupoli-24.webp',
      '/media/trulli-lupoli-25.webp',
      '/media/trulli-lupoli-26.webp',
      '/media/trulli-lupoli-27.webp',
      '/media/trulli-lupoli-28.webp',
      '/media/trulli-lupoli-29.webp',
      '/media/trulli-lupoli-30.webp',
    ],
  },
  // Voeg hier nieuwe opdrachten toe
]

const TEXT_HEIGHT = 76 // px — hoogte van de tekstbalk bij hover

// ─────────────────────────────────────────────────────────────────
// Skills — wat ik voor reisbedrijven doe
// ─────────────────────────────────────────────────────────────────
type SkillItem = {
  title: string
  description: string
  items: string[]
  icon: React.ReactNode
}

const skills: SkillItem[] = [
  {
    title: 'Fotografie & drone',
    description: 'Beeld dat de sfeer van je plek echt laat zien, vanaf de grond en uit de lucht.',
    items: ['Accommodatie', 'Reisfotografie', 'Dronefotografie'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
  },
  {
    title: 'Video',
    description: 'Dronevideo, korte reels en social content die de sfeer van een plek of verblijf laat zien.',
    items: ['Sfeerfilm', 'Social content', 'Dronevideo'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
  },
  {
    title: 'Vormgeving & branding',
    description: 'Van brochure tot volledige huisstijl.',
    items: ['Huisstijl & logo', 'Brochures', 'Templates'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    ),
  },
  {
    title: 'Websites',
    description: 'Maatwerk websites in jouw huisstijl. Snel, vindbaar en klaar voor AI zoekmachines.',
    items: ['Webdesign', 'Basis SEO', 'Hosting & onderhoud'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
]

function SkillsBlock() {
  return (
    <section
      id="samenwerken"
      className="relative z-10 px-6 pt-24 md:pt-28 lg:px-10"
      style={{ scrollMarginTop: '90px' }}
    >
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.35 }}
        >
          <span className="block text-[12px] font-semibold uppercase tracking-[0.16em] text-cream/50 mb-4">
            Samenwerken
          </span>
          <h2 className="text-cream! text-3xl md:text-5xl leading-[1.05] mb-4">
            Wat ik voor reisbedrijven doe
          </h2>
          <p className="text-cream/60 text-[16px] md:text-[17px] leading-relaxed">
            Als fotograaf en brand designer help ik hotels, B&amp;B&apos;s, touroperators,
            kampeermerken en verkeersbureaus aan beeld en een merk dat klopt.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mt-10 md:mt-12">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.35, delay: 0.05 * i }}
              className="rounded-3xl border border-cream/15 bg-cream/[0.06] p-6 md:p-7 flex flex-col gap-3"
            >
              <div className="w-11 h-11 rounded-full border border-cream/25 flex items-center justify-center text-cream/80">
                {skill.icon}
              </div>
              <h3 className="text-cream! text-xl md:text-2xl leading-tight">
                {skill.title}
              </h3>
              <p className="text-cream/60 text-[14px] leading-relaxed">
                {skill.description}
              </p>
              <p className="text-cream/40 text-[12px] font-semibold uppercase tracking-[0.08em] mt-auto pt-1">
                {skill.items.join(' · ')}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.35 }}
          className="mt-10 md:mt-12 text-cream/60 text-[16px] md:text-[17px] leading-relaxed"
        >
          Bekijk ook mijn eigen website{' '}
          <a
            href="https://thedaleyedit.nl"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cream underline underline-offset-4 decoration-cream/40 transition-colors hover:decoration-cream"
          >
            www.thedaleyedit.nl
          </a>
          .
        </motion.p>
      </div>
    </section>
  )
}

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
      className="w-full max-w-[500px] mx-auto"
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
        {/* Afbeelding */}
        <div style={{ flex: '1 1 auto', position: 'relative', overflow: 'hidden', minHeight: 0 }}>
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

        {/* Witte tekst + pijl — schuift omhoog op hover */}
        <div
          style={{
            height: hovered ? `${TEXT_HEIGHT}px` : '0px',
            overflow: 'hidden',
            transition: 'height 500ms ease',
            backgroundColor: '#2b4a2a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
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
// PlaceholderCard — lege plek voor toekomstige opdrachten
// ─────────────────────────────────────────────────────────────────
function PlaceholderCard({ index }: { index: number }) {
  return (
    <motion.div
      className="w-full max-w-[500px] mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, delay: 0.06 * index }}
    >
      <div
        className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-cream/20 text-center px-6"
        style={{ aspectRatio: '3/4' }}
      >
        <div className="w-12 h-12 rounded-full border border-cream/20 flex items-center justify-center text-cream/40">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </div>
        <p className="font-display text-cream/40 text-lg">Binnenkort meer</p>
        <p className="text-cream/30 text-[13px] leading-relaxed">Nieuwe opdrachten volgen snel.</p>
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
            className="leading-tight pr-4"
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
// HireForm — contactformulier + WhatsApp optie
// ─────────────────────────────────────────────────────────────────
function HireForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Er ging iets mis. Probeer het later opnieuw.')
        return
      }
      setSubmitted(true)
    } catch {
      setError('Geen verbinding. Probeer het later opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  const fieldClass =
    'w-full bg-cream/12 rounded-2xl border border-cream/25 px-5 py-3 text-[15px] text-cream placeholder-cream/40 outline-none transition-colors focus:border-cream/50'

  return (
    <div className="max-w-4xl mx-auto rounded-3xl px-8 py-12 md:px-16 md:py-14 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#bd6a3a] via-[#bd6a3a] to-[#8a3f1e] rounded-3xl" />
      <div className="relative z-10">
        {submitted ? (
          <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
            <div className="w-12 h-12 rounded-full bg-cream/20 border border-cream/40 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-cream">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-cream font-display text-2xl">Bericht verstuurd.</p>
            <p className="text-cream/60 text-[15px]">Ik neem zo snel mogelijk contact met je op.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h2 className="text-cream! text-3xl md:text-4xl leading-tight mb-3">
                Samenwerken?
              </h2>
              <p className="text-cream/65 text-[15px] leading-relaxed max-w-xl mx-auto">
                Voor bedrijven in de reisbranche doe ik (drone) fotografie en video, vormgeving en maak ik websites. Stuur een bericht of app me direct.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Je naam"
                  className={fieldClass}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jij@voorbeeld.nl"
                  className={fieldClass}
                />
              </div>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Vertel kort waar je aan denkt"
                rows={4}
                className={`${fieldClass} resize-none`}
              />
              {/* Naast elkaar, ook op mobiel. Op smalle schermen wat minder
                  binnenmarge zodat beide knoppen op één regel passen. */}
              <div className="flex flex-row items-center justify-center gap-2 sm:gap-3 mt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="group/btn organic-btn bg-cream px-5 sm:px-7 py-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-[#8a3f1e] whitespace-nowrap transition-colors hover:bg-cream/90 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <span className="transition-transform duration-300 ease-out group-hover/btn:translate-x-0.5">
                      {loading ? 'Versturen...' : 'Verstuur'}
                    </span>
                    <span className="transition-transform duration-300 ease-out group-hover/btn:translate-x-1">→</span>
                  </span>
                </button>
                <a
                  href="https://wa.me/31636162639"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="organic-btn-alt inline-flex items-center gap-2 px-5 sm:px-7 py-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-cream whitespace-nowrap transition-opacity hover:opacity-90"
                  style={{ backgroundColor: '#1d3b1c' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
              </div>
              {error && <p className="text-center text-[13px] text-red-200">{error}</p>}
            </form>
          </>
        )}
      </div>
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

  // Echte opdrachten + 2 placeholders voor toekomstige opdrachten
  const items: ({ kind: 'project'; project: Commission } | { kind: 'placeholder' })[] = [
    ...commissions.map((project) => ({ kind: 'project' as const, project })),
    { kind: 'placeholder' as const },
    { kind: 'placeholder' as const },
  ]
  const leftCol = items.filter((_, i) => i % 2 === 0)
  const rightCol = items.filter((_, i) => i % 2 === 1)

  return (
    <>
      {/* Groene achterlaag zodat het lichtere groen doorloopt tot in de footer-golf
          (de golf is transparant en toont anders de cream body-achtergrond) */}
      <div aria-hidden className="fixed inset-0 -z-10" style={{ backgroundColor: '#2b4a2a' }} />

      <main className="min-h-screen relative destinations-texture noise-overlay" style={{ backgroundColor: '#2b4a2a' }}>

      {/* Modal */}
      <AnimatePresence>
        {activeProject && (
          <ProjectModal project={activeProject} onClose={closeProject} />
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="relative z-10 overflow-hidden px-6 pt-36 pb-20 md:pt-48 md:pb-24 lg:px-10">
        <div className="relative z-10 max-w-[1400px] mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.06 }}
            className="font-display font-bold text-white! leading-[0.92] tracking-[-0.02em]"
            style={{ fontSize: 'clamp(52px, 9vw, 112px)' }}
          >
            Mooie
            <br />
            <span className="text-white">opdrachten</span>
          </motion.h1>
        </div>
      </section>

      {/* Projecten */}
      <section className="relative z-10 px-6 pb-24 md:pb-32 lg:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-x-24 lg:gap-x-32 items-start">
            <div className="flex flex-col gap-16 md:gap-28">
              {leftCol.map((item, i) =>
                item.kind === 'project' ? (
                  <ProjectCard key={item.project.cardTitle} project={item.project} index={i * 2} onOpen={openProject} />
                ) : (
                  <PlaceholderCard key={`ph-l-${i}`} index={i * 2} />
                ),
              )}
            </div>
            <div className="flex flex-col gap-16 md:gap-28 md:pt-[180px]">
              {rightCol.map((item, i) =>
                item.kind === 'project' ? (
                  <ProjectCard key={item.project.cardTitle} project={item.project} index={i * 2 + 1} onOpen={openProject} />
                ) : (
                  <PlaceholderCard key={`ph-r-${i}`} index={i * 2 + 1} />
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Scheidingslijn */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="border-t border-white/10" />
      </div>

      {/* Skills — wat ik voor reisbedrijven doe */}
      <SkillsBlock />

      {/* CTA — samenwerken + WhatsApp */}
      <section className="relative z-10 px-6 pt-16 pb-24 md:pt-20 md:pb-32 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
          className="max-w-[1400px] mx-auto"
        >
          <HireForm />
        </motion.div>
      </section>
      </main>
    </>
  )
}
