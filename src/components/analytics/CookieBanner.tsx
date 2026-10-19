'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'

/** Event waarmee de link in de voet de banner opnieuw opent. */
export const OPEN_EVENT = 'mtl-cookiekeuze-open'

type Choice = 'ja' | 'nee'

declare global {
  interface Window {
    mtlStartAnalytics?: () => void
    gtag?: (...args: unknown[]) => void
  }
}

function readChoice(key: string): Choice | null {
  try {
    const value = localStorage.getItem(key)
    return value === 'ja' || value === 'nee' ? value : null
  } catch {
    return null
  }
}

function saveChoice(key: string, choice: Choice) {
  try {
    localStorage.setItem(key, choice)
  } catch {
    // Privémodus of geblokkeerde opslag: dan geldt de keuze alleen voor dit bezoek.
  }
}

/** Haalt de GA cookies weg (_ga en _ga_XXXX), op het domein en de host zelf. */
function clearGaCookies() {
  const domain = location.hostname.replace(/^www\./, '')
  for (const part of document.cookie.split(';')) {
    const name = part.split('=')[0].trim()
    if (!name.startsWith('_ga')) continue
    for (const d of ['', `; domain=.${domain}`, `; domain=${location.hostname}`]) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d}`
    }
  }
}

export function CookieBanner({ storageKey }: { storageKey: string }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!readChoice(storageKey)) setOpen(true)
    const reopen = () => setOpen(true)
    window.addEventListener(OPEN_EVENT, reopen)
    return () => window.removeEventListener(OPEN_EVENT, reopen)
  }, [storageKey])

  function accept() {
    saveChoice(storageKey, 'ja')
    window.mtlStartAnalytics?.()
    setOpen(false)
  }

  function decline() {
    const wasAccepted = readChoice(storageKey) === 'ja'
    saveChoice(storageKey, 'nee')
    setOpen(false)
    if (wasAccepted) {
      // gtag.js draait al. Zet hem op geweigerd, ruim de cookies op en laad
      // opnieuw, zodat hij er de rest van het bezoek niet meer is.
      window.gtag?.('consent', 'update', { analytics_storage: 'denied' })
      clearGaCookies()
      location.reload()
    }
  }

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookiekeuze"
      className="cookie-banner fixed inset-x-4 bottom-4 z-[60] rounded-2xl bg-forest-dark p-5 text-cream natural-shadow-box sm:inset-x-auto sm:left-6 sm:bottom-6 sm:max-w-sm"
    >
      <p className="text-[15px] leading-relaxed text-cream/85">
        Mag ik bijhouden hoe Meet the Locals gelezen wordt? Dat gaat via Google Analytics, met een
        paar cookies. Geen advertenties, geen profielen.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button variant="accent" size="sm" onClick={accept}>
          Prima
        </Button>
        <Button variant="glass" size="sm" onClick={decline}>
          Liever niet
        </Button>
      </div>
    </div>
  )
}

/** Link in de voet om de keuze later te wijzigen. */
export function CookieSettingsButton({ className = '' }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))} className={className}>
      Cookiekeuze
    </button>
  )
}
