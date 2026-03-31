'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <main className="pt-32 md:pt-40 pb-24">
      {/* Header */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          <h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.1]">
            Samenwerken,
            <br />
            connecten, of gewoon
            <br />
            een vraag?
          </h1>
          <p className="text-text-muted text-lg leading-relaxed lg:pt-2">
            Neem contact met me op via het formulier hieronder, of connect met me op LinkedIn of Instagram.
          </p>
        </div>
      </section>

      {/* Form card */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="bg-forest-dark rounded-[2rem] md:rounded-[3rem] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left — socials */}
            <div className="flex flex-col justify-end p-8 md:p-12 lg:p-16">
              <h2 className="text-cream text-xl md:text-2xl mb-6">Volg me op de socials!</h2>
              <div className="flex gap-4">
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
            </div>

            {/* Right — form */}
            <div className="p-8 md:p-12 lg:p-16">
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
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
                    <span className="text-accent text-sm mb-1 block">*</span>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Wat is je naam?"
                      className="w-full bg-cream/10 text-cream placeholder-cream/40 px-5 py-4 rounded-xl border border-cream/10 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30 transition-all"
                    />
                  </div>
                  <div>
                    <span className="text-accent text-sm mb-1 block">*</span>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Je e-mailadres"
                      className="w-full bg-cream/10 text-cream placeholder-cream/40 px-5 py-4 rounded-xl border border-cream/10 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30 transition-all"
                    />
                  </div>
                  <div>
                    <span className="text-accent text-sm mb-1 block">*</span>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      placeholder="Opmerkingen of vragen?"
                      className="w-full bg-cream/10 text-cream placeholder-cream/40 px-5 py-4 rounded-xl border border-cream/10 focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30 transition-all resize-y"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-cream/15 text-cream px-8 py-3.5 rounded-full text-sm uppercase tracking-[0.1em] font-semibold hover:bg-accent hover:text-white transition-all duration-300"
                  >
                    Verstuur
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
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
