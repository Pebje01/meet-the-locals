'use client'

import { useState } from 'react'

export function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: koppel aan Brevo of andere e-maildienst
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12">
        <div className="w-16 h-16 rounded-full bg-[#5aab6a]/20 border border-[#5aab6a]/40 flex items-center justify-center mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5aab6a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="text-2xl font-display text-cream! mb-3">Je staat op de lijst</h3>
        <p className="text-[15px] text-cream/50 max-w-sm">
          Je ontvangt de eerstvolgende editie zodra die verschijnt. Tot dan.
        </p>
      </div>
    )
  }

  return (
    <>
      <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-cream/40 mb-2">
        Gratis, één keer per maand
      </p>
      <h3 className="text-2xl md:text-3xl font-display text-cream! mb-2">
        Schrijf je in
      </h3>
      <p className="text-[15px] text-cream/50 mb-8">
        Je ontvangt de eerstvolgende editie zodra die verschijnt. Uitschrijven kan altijd, met één klik.
      </p>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="newsletter-name" className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-cream/40 mb-2">
            Voornaam
          </label>
          <input
            id="newsletter-name"
            type="text"
            placeholder="Jouw voornaam"
            className="w-full rounded-xl border border-cream/15 bg-cream/8 px-4 py-3 text-[15px] text-cream placeholder-cream/30 focus:border-[#5aab6a]/60 focus:outline-none focus:ring-1 focus:ring-[#5aab6a]/30 transition-all"
          />
        </div>
        <div>
          <label htmlFor="newsletter-email" className="block text-[12px] font-semibold uppercase tracking-[0.12em] text-cream/40 mb-2">
            E-mailadres
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            placeholder="jij@voorbeeld.nl"
            className="w-full rounded-xl border border-cream/15 bg-cream/8 px-4 py-3 text-[15px] text-cream placeholder-cream/30 focus:border-[#5aab6a]/60 focus:outline-none focus:ring-1 focus:ring-[#5aab6a]/30 transition-all"
          />
        </div>
        <button
          type="submit"
          className="mt-2 w-full rounded-xl bg-[#5aab6a] px-6 py-4 text-[14px] font-semibold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:bg-[#4d9a5d] hover:shadow-[0_8px_30px_-6px_rgba(90,171,106,0.45)]"
        >
          Ja, ik schrijf me in
        </button>
      </form>

      <p className="mt-6 text-center text-[12px] text-cream/25 leading-relaxed">
        Geen spam. Geen doorverkoop van je gegevens. Uitschrijven kan altijd.
      </p>
    </>
  )
}
