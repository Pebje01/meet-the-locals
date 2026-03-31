'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <main className="pt-32 md:pt-40 pb-24">
      {/* Header */}
      <section className="max-w-[900px] mx-auto px-6 lg:px-10 mb-16 text-center">
        <h1 className="mb-6">Contact</h1>
        <h2 className="text-3xl md:text-4xl lg:text-5xl leading-[1.1] font-serif! mb-6">
          Samenwerken,
          <br />
          connecten, of gewoon
          <br />
          een vraag?
        </h2>
        <p className="text-text-muted text-lg leading-relaxed max-w-lg mx-auto">
          Neem contact met me op via het formulier hieronder, of connect met me op LinkedIn of Instagram.
        </p>
      </section>

      {/* Form card */}
      <section className="max-w-[700px] mx-auto px-6 lg:px-10">
        <div className="bg-forest-dark rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 lg:p-16">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
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
              className="space-y-6"
            >
              <input type="hidden" name="access_key" value="ba9a4c0f-8525-4f64-9ed9-ab4c7cb2c125" />

              <div>
                <label className="text-cream/60 text-sm mb-2 block">Je volledige naam</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Daley Jansen"
                  className="w-full bg-cream/10 text-cream placeholder-cream/30 px-5 py-4 rounded-2xl border border-cream/10 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                />
              </div>

              <div>
                <label className="text-cream/60 text-sm mb-2 block">E-mailadres</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="naam@voorbeeld.nl"
                  className="w-full bg-cream/10 text-cream placeholder-cream/30 px-5 py-4 rounded-2xl border border-cream/10 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                />
              </div>

              <div>
                <label className="text-cream/60 text-sm mb-2 block">Telefoonnummer</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+31 6 12345678"
                  className="w-full bg-cream/10 text-cream placeholder-cream/30 px-5 py-4 rounded-2xl border border-cream/10 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                />
              </div>

              <div>
                <label className="text-cream/60 text-sm mb-2 block">Bericht</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Vertel me meer over je vraag of idee..."
                  className="w-full bg-cream/10 text-cream placeholder-cream/30 px-5 py-4 rounded-2xl border border-cream/10 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all resize-y"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-accent text-white py-4 rounded-2xl text-sm uppercase tracking-[0.1em] font-semibold hover:bg-accent-dark transition-all duration-300 hover:shadow-[0_8px_30px_-6px_rgba(212,132,90,0.4)]"
              >
                Verstuur bericht
              </button>
            </form>
          )}
        </div>

        {/* Socials */}
        <div className="mt-12 text-center">
          <div className="flex justify-center gap-4 mb-6">
            <a
              href="https://instagram.com/meetthelocals.nl"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-forest/5 flex items-center justify-center text-forest/50 hover:bg-accent hover:text-white transition-all duration-300"
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
              className="w-12 h-12 rounded-full bg-forest/5 flex items-center justify-center text-forest/50 hover:bg-accent hover:text-white transition-all duration-300"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.17V11.7a4.83 4.83 0 01-3.58-1.43V6.69h3.58z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-forest/5 flex items-center justify-center text-forest/50 hover:bg-accent hover:text-white transition-all duration-300"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
          <a href="mailto:hello@meetthelocals.nl" className="text-text-muted hover:text-accent transition-colors text-[15px]">
            hello@meetthelocals.nl
          </a>
        </div>
      </section>
    </main>
  )
}
