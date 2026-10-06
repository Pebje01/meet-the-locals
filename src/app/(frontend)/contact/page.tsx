'use client'

import { useState } from 'react'
import { PageHero } from '@/components/PageHero'
import { HERO_IMAGES } from '@/lib/heroImages'
import { INSTAGRAM, SOCIAL_LINKS } from '@/lib/social'
import { SocialIcon } from '@/components/SocialIcon'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <main>
      <PageHero
        title="Contact"
        subtitle="Samenwerken, connecten, of gewoon een vraag?"
        image={HERO_IMAGES.contact}
      />

      <section className="max-w-[90%] mx-auto my-16 md:my-24 overflow-hidden rounded-[2rem] md:rounded-[3rem] relative noise-overlay">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-dark via-forest-dark to-[#0f2a14]" />

        <div className="relative z-10 px-8 md:px-16 lg:px-20 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

            {/* Links: tekst + contact info */}
            <div className="flex flex-col justify-between gap-12">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent mb-4 block">
                  Get in touch
                </span>
                <h2 className="text-cream! text-3xl md:text-4xl lg:text-5xl leading-[1.1] mb-6">
                  Samenwerken,
                  <br />connecten, of gewoon
                  <br />een vraag?
                </h2>
                <p className="text-cream/55 text-[17px] leading-relaxed">
                  Neem contact met me op via het formulier, of bereik me direct via e-mail of social media.
                </p>
              </div>

              <div className="flex flex-col gap-6">
                {/* E-mail */}
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-cream/8 border border-cream/12 flex items-center justify-center text-accent flex-shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M2 7l10 7 10-7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cream/35 mb-0.5">E-mail</p>
                    <a href="mailto:hello@meetthelocals.nl" className="text-cream/75 hover:text-accent transition-colors text-[15px]">
                      hello@meetthelocals.nl
                    </a>
                  </div>
                </div>

                {/* Socials */}
                {INSTAGRAM && (
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-cream/8 border border-cream/12 flex items-center justify-center text-accent flex-shrink-0">
                      <SocialIcon network="instagram" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cream/35 mb-0.5">Instagram</p>
                      <a href={INSTAGRAM.url} target="_blank" rel="noopener noreferrer" className="text-cream/75 hover:text-accent transition-colors text-[15px]">
                        @{INSTAGRAM.handle}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  {SOCIAL_LINKS.map((social) => (
                    <a
                      key={social.network}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-10 h-10 rounded-full bg-cream/8 border border-cream/12 flex items-center justify-center text-cream/50 hover:bg-accent hover:text-white hover:border-accent transition-all duration-300"
                    >
                      <SocialIcon network={social.network} size={16} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Rechts: formulier */}
            <div>
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#5aab6a]/20 border border-[#5aab6a]/40 flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5aab6a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="text-cream! text-2xl">Bericht verstuurd!</h3>
                  <p className="text-cream/55 text-[15px]">Ik neem zo snel mogelijk contact met je op.</p>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault()
                    setError(null)
                    setLoading(true)
                    const form = e.currentTarget
                    const name = (form.elements.namedItem('name') as HTMLInputElement).value
                    const email = (form.elements.namedItem('email') as HTMLInputElement).value
                    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value
                    try {
                      const res = await fetch('/api/contact', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, email, message }),
                      })
                      if (!res.ok) {
                        const data = await res.json().catch(() => ({}))
                        setError(data.error ?? 'Er ging iets mis. Probeer het later opnieuw.')
                      } else {
                        setSubmitted(true)
                      }
                    } catch {
                      setError('Geen verbinding. Probeer het later opnieuw.')
                    } finally {
                      setLoading(false)
                    }
                  }}
                  className="flex flex-col gap-5"
                >
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cream/40 mb-2 block">
                      Je naam
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Daley Jansen"
                      className="w-full bg-cream/8 text-cream placeholder-cream/25 px-5 py-3.5 rounded-xl border border-cream/12 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20 transition-all text-[15px]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cream/40 mb-2 block">
                      E-mailadres
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="naam@voorbeeld.nl"
                      className="w-full bg-cream/8 text-cream placeholder-cream/25 px-5 py-3.5 rounded-xl border border-cream/12 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20 transition-all text-[15px]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cream/40 mb-2 block">
                      Bericht
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      placeholder="Vertel me meer over je vraag of idee..."
                      className="w-full bg-cream/8 text-cream placeholder-cream/25 px-5 py-3.5 rounded-xl border border-cream/12 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/20 transition-all text-[15px] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="organic-btn w-full bg-accent text-white py-4 text-[13px] font-semibold uppercase tracking-[0.1em] hover:bg-accent-dark transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Even wachten...' : 'Verstuur bericht'}
                  </button>

                  {error && (
                    <p className="text-red-400 text-[13px] text-center">{error}</p>
                  )}
                </form>
              )}
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}
