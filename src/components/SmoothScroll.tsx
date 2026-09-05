'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'

export function SmoothScroll() {
  const pathname = usePathname()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // Stond op 2, wat de scrollsnelheid op touch verdubbelde. Daardoor
      // moesten de reveal-animaties twee keer zo snel bijhouden en liep het
      // op telefoon en tablet achter.
      touchMultiplier: 1,
    })
    lenisRef.current = lenis

    let rafId = 0
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  useEffect(() => {
    if (window.location.hash) return

    const timeoutId = window.setTimeout(() => {
      lenisRef.current?.scrollTo(0, { immediate: true })
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [pathname])

  return null
}
