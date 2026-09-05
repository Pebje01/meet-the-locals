'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Doorlopend schuivende strip die stilstaat zodra hij uit beeld is.
 *
 * Een `animation: infinite` blijft draaien ook als niemand hem ziet. De
 * browser moet dan elke frame compositen, wat op telefoon en tablet merkbaar
 * is: de rest van de pagina scrollt er stroever door. Deze wrapper zet de
 * animatie stil zodra de strip het beeld verlaat en weer aan als hij
 * terugkomt.
 *
 * Het pauzeren gebeurt via een klasse in plaats van via inline stijl, zodat
 * de media query voor prefers-reduced-motion in globals.css leidend blijft.
 */
export function Marquee({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Zonder IntersectionObserver gewoon door laten draaien.
    if (typeof IntersectionObserver === 'undefined') return

    const obs = new IntersectionObserver(
      ([entry]) => el.classList.toggle('is-paused', !entry.isIntersecting),
      { rootMargin: '100px' },
    )
    obs.observe(el)

    // Ook stilzetten als het tabblad naar de achtergrond gaat.
    const onVisibility = () => {
      if (document.hidden) el.classList.add('is-paused')
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      obs.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <div ref={ref} className={`animate-marquee ${className}`}>
      {children}
    </div>
  )
}
