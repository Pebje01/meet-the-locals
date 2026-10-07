'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

export function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const form = e.currentTarget
    const email = (form.elements.namedItem('newsletter-email') as HTMLInputElement).value
    const name = (form.elements.namedItem('newsletter-name') as HTMLInputElement).value

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Er ging iets mis. Probeer het later opnieuw.')
        return
      }

      setSubmitted(true)
    } catch {
      setError('Geen verbinding. Controleer je internet en probeer opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-radar/40 bg-radar/20 text-radar">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="t-h3 mb-3 text-cream">Je staat op de lijst</h3>
        <p className="text-[15px] text-cream/50 max-w-sm">
          Je ontvangt de eerstvolgende editie zodra die verschijnt. Tot dan.
        </p>
      </div>
    )
  }

  return (
    <>
      <p className="t-eyebrow mb-2 text-cream/45">Eén keer per maand</p>
      <h3 className="t-h3 mb-2 text-cream">
        Schrijf je in
      </h3>
      <p className="mb-8 text-[15px] text-cream/60">
        Je ontvangt de eerstvolgende editie zodra die verschijnt. Uitschrijven kan altijd, met één klik.
      </p>

      <form className="flex flex-col gap-4 [--field-focus:var(--color-radar)]" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="newsletter-name" className="field-label">
            Voornaam
          </label>
          <input
            id="newsletter-name"
            type="text"
            placeholder="Jouw voornaam"
            className="field"
          />
        </div>
        <div>
          <label htmlFor="newsletter-email" className="field-label">
            E-mailadres
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            placeholder="jij@voorbeeld.nl"
            className="field"
          />
        </div>
        <Button type="submit" disabled={loading} arrow={loading ? false : 'right'} className="mt-2 w-full">
          {loading ? 'Aanmelden...' : 'Ja, ik schrijf me in'}
        </Button>
      </form>

      {error && (
        <p className="mt-4 text-center text-[13px] text-red-400 leading-relaxed">{error}</p>
      )}

      <p className="mt-6 text-center text-[12px] leading-relaxed text-cream/40">
        Geen spam. Geen doorverkoop van je gegevens. Uitschrijven kan altijd.
      </p>
    </>
  )
}
