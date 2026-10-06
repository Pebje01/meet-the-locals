'use client'

import { useState } from 'react'
import { PageHero } from '@/components/PageHero'
import { HERO_IMAGES } from '@/lib/heroImages'
import { INSTAGRAM, SOCIAL_LINKS } from '@/lib/social'
import { SocialIcon } from '@/components/SocialIcon'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'

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

      <section className="mx-auto max-w-[1400px] py-12 md:px-6 md:py-24 lg:px-10">
        <div className="relative overflow-hidden bg-gradient-to-br from-forest-dark via-forest-dark to-forest-deep md:rounded-3xl">
        <div aria-hidden className="grain-layer" />

        <div className="relative z-10 px-6 py-14 md:px-16 md:py-20 lg:px-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

            {/* Links: tekst + contact info */}
            <div className="flex flex-col justify-between gap-12">
              <div>
                <Eyebrow className="mb-4">Get in touch</Eyebrow>
                <h2 className="t-h2 mb-6 max-w-md text-cream">
                  Samenwerken, connecten, of gewoon een vraag?
                </h2>
                <p className="t-body text-cream/65">
                  Neem contact met me op via het formulier, of bereik me direct via e-mail of social media.
                </p>
              </div>

              <div className="flex flex-col gap-6">
                {/* E-mail */}
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cream/12 bg-cream/8 text-accent">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M2 7l10 7 10-7" />
                    </svg>
                  </div>
                  <div>
                    <p className="t-meta mb-0.5 font-semibold text-cream/45">E-mail</p>
                    <a href="mailto:hello@meetthelocals.nl" className="text-cream/75 hover:text-accent transition-colors text-[15px]">
                      hello@meetthelocals.nl
                    </a>
                  </div>
                </div>

                {/* Socials */}
                {INSTAGRAM && (
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cream/12 bg-cream/8 text-accent">
                      <SocialIcon network="instagram" />
                    </div>
                    <div>
                      <p className="t-meta mb-0.5 font-semibold text-cream/45">Instagram</p>
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
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-radar/40 bg-radar/20 text-radar">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="t-h3 text-cream">Bericht verstuurd!</h3>
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
                    <label className="field-label">
                      Je naam
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Daley Jansen"
                      className="field"
                    />
                  </div>

                  <div>
                    <label className="field-label">
                      E-mailadres
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="naam@voorbeeld.nl"
                      className="field"
                    />
                  </div>

                  <div>
                    <label className="field-label">
                      Bericht
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      placeholder="Vertel me meer over je vraag of idee..."
                      className="field resize-none"
                    />
                  </div>

                  <Button type="submit" disabled={loading} arrow={loading ? false : 'right'} className="w-full">
                    {loading ? 'Even wachten...' : 'Verstuur bericht'}
                  </Button>

                  {error && (
                    <p className="text-red-400 text-[13px] text-center">{error}</p>
                  )}
                </form>
              )}
            </div>

          </div>
        </div>
        </div>
      </section>
    </main>
  )
}
