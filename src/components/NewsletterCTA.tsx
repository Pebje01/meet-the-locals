'use client'

import { useState } from 'react'

export function NewsletterCTA() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
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

  return (
    <section className="bg-cream py-12 md:py-16">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="max-w-4xl mx-auto rounded-3xl px-10 py-12 md:px-16 md:py-14 overflow-hidden relative text-center">
          {/* Oranje achtergrond */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#bd6a3a] via-[#bd6a3a] to-[#8a3f1e] rounded-3xl" />

          {/* Noise overlay */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              backgroundImage: "url('/textures/grain.webp')",
              backgroundSize: '800px 533px',
              backgroundRepeat: 'repeat',
              opacity: 0.65,
              mixBlendMode: 'overlay',
            }}
          />

          <div className="relative z-10">
            {submitted ? (
              <div className="flex flex-col items-center justify-center gap-3 py-4">
                <div className="w-12 h-12 rounded-full bg-cream/20 border border-cream/40 flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-cream">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="text-cream font-display text-2xl">Je staat op de lijst.</p>
                <p className="text-cream/60 text-[15px]">Je ontvangt de eerstvolgende editie zodra die verschijnt.</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6">
                <div>
                  <h2 className="font-display text-cream! text-3xl md:text-4xl leading-tight mb-3">
                    Schrijf je in voor de nieuwsbrief
                  </h2>
                  <p className="text-cream/65 text-[15px] leading-relaxed max-w-xl mx-auto">
                    Blijf elke maand op de hoogte van alle ins en outs van reizen, bestemmingen, fotografie en de reisbranche.
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="w-full max-w-lg flex items-center bg-cream/12 rounded-full border border-cream/25 p-1.5 gap-2"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jij@voorbeeld.nl"
                    className="flex-1 bg-transparent pl-5 pr-2 py-2 text-[15px] text-cream placeholder-cream/40 outline-none min-w-0"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="group/btn flex-shrink-0 rounded-full bg-cream px-6 py-2.5 text-[13px] font-semibold uppercase tracking-[0.1em] text-[#8a3f1e] whitespace-nowrap transition-colors duration-300 hover:bg-cream/90 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <span className="transition-transform duration-300 ease-out group-hover/btn:translate-x-0.5">
                        Schrijf me in
                      </span>
                      <span className="transition-transform duration-300 ease-out group-hover/btn:translate-x-1">
                        →
                      </span>
                    </span>
                  </button>
                </form>

                {error && (
                  <p className="text-[13px] text-red-300">{error}</p>
                )}

                <p className="text-[12px] text-cream/40 leading-relaxed max-w-sm mx-auto">
                  Door je in te schrijven geef je toestemming om één keer per maand een nieuwsbrief te ontvangen. Uitschrijven kan altijd via de link in elke e-mail.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
