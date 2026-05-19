'use client'

import { useState } from 'react'
import { PageHero } from '@/components/PageHero'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <main>
      <PageHero
        title="Contact"
        subtitle="Samenwerken, connecten, of gewoon een vraag?"
        image="/media/langkawi-scaled.webp"
        imageAlt="Langkawi strand"
      />

      {/* Groene sectie, 90% breedte, gecentreerd, afgeronde hoeken */}
      <section className="max-w-[90%] mx-auto bg-forest-dark text-cream rounded-[2rem] md:rounded-[3rem] my-16 md:my-24">
        <div className="px-8 md:px-16 lg:px-20 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Links: tekst + socials */}
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl text-cream! leading-[1.15] mb-8 font-serif!">
                  Samenwerken,
                  <br />
                  connecten, of gewoon
                  <br />
                  een vraag?
                </h2>
                <p className="text-cream/60 text-lg leading-relaxed max-w-5xl mb-10">
                  Neem contact met me op via het formulier, of connect met me op LinkedIn of Instagram.
                </p>
              </div>

              {/* Socials */}
              <div>
                <p className="text-cream/40 text-sm uppercase tracking-[0.15em] mb-4">Volg me</p>
                <div className="flex gap-4 mb-6">
                  <a
                    href="https://instagram.com/meetthelocals.nl"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-cream/10 flex items-center justify-center text-cream/60 hover:bg-accent hover:text-white transition-all duration-300"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <circle cx="12" cy="12" r="5" />
                      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                    </svg>
                  </a>
                  <a
                    href="https://tiktok.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-cream/10 flex items-center justify-center text-cream/60 hover:bg-accent hover:text-white transition-all duration-300"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.17V11.7a4.83 4.83 0 01-3.58-1.43V6.69h3.58z" />
                    </svg>
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-cream/10 flex items-center justify-center text-cream/60 hover:bg-accent hover:text-white transition-all duration-300"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                </div>
                <a href="mailto:hello@meetthelocals.nl" className="text-cream/50 hover:text-accent transition-colors text-[15px]">
                  hello@meetthelocals.nl
                </a>
              </div>
            </div>

            {/* Rechts: formulier */}
            <div>
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-cream/20 flex items-center justify-center mb-6">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f5f2eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <h3 className="text-cream text-2xl mb-2">Bericht verstuurd!</h3>
                  <p className="text-cream/60">Ik neem zo snel mogelijk contact met je op.</p>
                </div>
              ) : (
                <form
                  action="https://api.web3forms.com/submit"
                  method="POST"
                  onSubmit={() => setSubmitted(true)}
                  className="space-y-5"
                >
                  <input type="hidden" name="access_key" value="ba9a4c0f-8525-4f64-9ed9-ab4c7cb2c125" />

                  <div>
                    <label className="text-cream/50 text-sm mb-2 block">Je volledige naam</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Daley Jansen"
                      className="w-full bg-cream/8 text-cream placeholder-cream/25 px-5 py-4 rounded-2xl border border-cream/10 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-cream/50 text-sm mb-2 block">E-mailadres</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="naam@voorbeeld.nl"
                      className="w-full bg-cream/8 text-cream placeholder-cream/25 px-5 py-4 rounded-2xl border border-cream/10 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-cream/50 text-sm mb-2 block">Bericht</label>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      placeholder="Vertel me meer over je vraag of idee..."
                      className="w-full bg-cream/8 text-cream placeholder-cream/25 px-5 py-4 rounded-2xl border border-cream/10 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-accent text-white py-4 rounded-2xl text-sm uppercase tracking-[0.1em] font-semibold hover:bg-accent-dark transition-all duration-300"
                  >
                    Verstuur bericht
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
