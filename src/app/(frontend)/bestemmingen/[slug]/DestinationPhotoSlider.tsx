'use client'

import Image from 'next/image'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type SliderImage = {
  url: string
  caption?: string | null
  objectPosition?: string | null
  exif?: {
    camera?: string | null
    lens?: string | null
    aperture?: string | null
    shutterSpeed?: string | null
    iso?: string | null
    focalLength?: string | null
    takenAt?: string | null
  } | null
}

function MetaBar({ image }: { image: SliderImage }) {
  const exif = image.exif

  const leftParts = [
    exif?.camera,
    exif?.lens,
    exif?.focalLength,
    exif?.aperture,
    exif?.shutterSpeed,
    exif?.iso ? `ISO ${exif.iso}` : null,
  ].filter(Boolean) as string[]

  const hasLeft = leftParts.length > 0
  const hasRight = !!image.caption

  if (!hasLeft && !hasRight) return null

  return (
    <div className="absolute bottom-0 inset-x-0 z-20 flex items-end justify-between gap-4 px-5 pb-8 md:px-8 md:pb-10 pointer-events-none opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300">
      {/* Links: camera metadata */}
      {hasLeft && (
        <p className="font-mono text-[11px] md:text-[12px] tracking-wide text-white leading-none rounded-lg bg-white/20 backdrop-blur-md px-3 py-2">
          {leftParts.join(' · ')}
        </p>
      )}

      {/* Rechts: locatie */}
      {hasRight && (
        <p className="text-right italic text-[11px] md:text-[12px] tracking-wide text-white leading-none rounded-lg bg-white/20 backdrop-blur-md px-3 py-2 ml-auto">
          {image.caption}
        </p>
      )}
    </div>
  )
}

export function DestinationPhotoSlider({
  images,
  name,
}: {
  images: SliderImage[]
  name: string
}) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1)
    setCurrent(index)
  }

  const prev = () => goTo((current - 1 + images.length) % images.length)
  const next = () => goTo((current + 1) % images.length)

  return (
    <section className="group/slider relative h-[55vh] md:h-[72vh] lg:h-[88vh] min-h-[400px] md:min-h-[560px] overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ x: direction * 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction * -60, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <Image
            src={images[current].url}
            alt={`${name} foto ${current + 1}`}
            fill
            className="object-cover"
            style={{ objectPosition: images[current].objectPosition ?? 'center' }}
            sizes="100vw"
            priority={current === 0}
          />
        </motion.div>
      </AnimatePresence>


      {/* Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-14 md:h-14 rounded-full bg-black/25 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/45 transition-all duration-200"
            aria-label="Vorige foto"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-14 md:h-14 rounded-full bg-black/25 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/45 transition-all duration-200"
            aria-label="Volgende foto"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Foto ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Metadata balk */}
      <MetaBar image={images[current]} />
    </section>
  )
}
