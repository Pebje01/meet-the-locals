'use client'

import { useEffect, useState, type ReactNode } from 'react'

/**
 * Poortje voor decoratieve kaarten.
 *
 * De wereldkaarten achter de hero zijn sfeer, geen inhoud: ze staan op 4 tot
 * 12 procent dekking achter een foto. Toch tekent react-simple-maps er elk
 * land ter wereld voor als losse SVG-paden, en dat kost op een telefoon
 * merkbaar veel: eerst een TopoJSON downloaden en omzetten, daarna duizenden
 * paden layouten.
 *
 * Daarom rendert dit poortje de kaart alleen wanneer hij iets toevoegt:
 *  - niet onder `minWidth`, want op een telefoon zie je hem toch niet
 *  - pas wanneer de browser niets beters te doen heeft, zodat hij nooit
 *    concurreert met de hero-foto en de eerste interactie
 *  - nooit bij prefers-reduced-motion
 */
export function DecorMapGate({
  children,
  minWidth = 768,
}: {
  children: ReactNode
  minWidth?: number
}) {
  const [toon, setToon] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.innerWidth < minWidth) return

    let idleId: number | undefined
    let timerId: number | undefined

    const ric = window.requestIdleCallback
    if (typeof ric === 'function') {
      idleId = ric(() => setToon(true), { timeout: 2000 })
    } else {
      timerId = window.setTimeout(() => setToon(true), 300)
    }

    return () => {
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId)
      if (timerId !== undefined) window.clearTimeout(timerId)
    }
  }, [minWidth])

  if (!toon) return null
  return <>{children}</>
}
