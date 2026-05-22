'use client'

import Image from 'next/image'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export function DestinationPhotoSlider({
  images,
  name,
}: {
  images: string[]
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
    <section className="relative h-[55vh] md:h-[72vh] lg:h-[88vh] min-h-[400px] md:min-h-[560px] overflow-hidden">
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
            src={images[current]}
            alt={`${name} foto ${current + 1}`}
            fill
            className="object-cover"
            sizes="100vw"
            priority={current === 0}
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient top — blends hero into slider, no hard edge */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest-dark/60 via-transparent to-transparent pointer-events-none z-10" />

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

    </section>
  )
}
