'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { label: 'Blog', href: '/blog' },
  { label: 'Bestemmingen', href: '/bestemmingen' },
  { label: 'Fotografie', href: '/fotografie' },
  { label: 'Over', href: '/over' },
  { label: 'Contact', href: '/contact' },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const darkHeroPages = ['/', '/blog']
  const hasDarkHero = darkHeroPages.includes(pathname)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isTransparent = hasDarkHero && !scrolled && !isOpen

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isTransparent
          ? 'bg-transparent'
          : isOpen
            ? 'bg-forest'
            : 'bg-warm-white/95 backdrop-blur-xl shadow-[0_1px_0_0_rgba(26,46,26,0.06)]'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-10 flex items-center justify-between h-16 md:h-24 mt-2">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 group">
          <Image
            src="/logo.png"
            alt="Meet the Locals"
            width={320}
            height={96}
            className={`h-14 md:h-16 w-auto transition-all duration-500 group-hover:scale-[1.02] ${
              isTransparent || isOpen ? 'brightness-0 invert' : 'logo-rust'
            }`}
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item, i) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const wobble = i % 2 === 0 ? 'organic-btn' : 'organic-btn-alt'
            const hoverColor = i % 2 === 0 ? 'hover:bg-accent' : 'hover:bg-link-hover'
            const activeColor = i % 2 === 0 ? 'bg-accent' : 'bg-link-hover'
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-1 ${wobble} font-display text-[22px] font-extralight tracking-[0.02em] uppercase transition-all duration-300 ${
                  isTransparent
                    ? `text-white/90 ${hoverColor} hover:text-white`
                    : isActive
                      ? `${activeColor} text-white`
                      : `text-forest ${hoverColor} hover:text-white`
                }`}
              >
                {item.label}
              </Link>
            )
          })}
          <Link
            href="/kaart"
            className={`ml-3 flex items-center gap-2 px-5 py-2.5 organic-btn text-[12px] font-semibold tracking-[0.08em] uppercase transition-all duration-300 ${
              isTransparent
                ? 'bg-white/15 text-white backdrop-blur-sm hover:bg-white/25'
                : 'bg-forest/10 text-forest hover:bg-forest hover:text-white'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            Kaart
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`lg:hidden relative w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 ${
            isTransparent || isOpen ? 'bg-white/15 backdrop-blur-sm' : 'bg-forest/10'
          }`}
          aria-label="Menu"
        >
          <div className="flex flex-col gap-[5px]">
            <span
              className={`block w-6 h-[1.5px] transition-all duration-300 origin-center ${
                isTransparent || isOpen ? 'bg-white' : 'bg-forest'
              } ${isOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`}
            />
            <span
              className={`block w-4 h-[1.5px] transition-all duration-300 ${
                isTransparent || isOpen ? 'bg-white' : 'bg-forest'
              } ${isOpen ? 'opacity-0 translate-x-2' : ''}`}
            />
            <span
              className={`block w-6 h-[1.5px] transition-all duration-300 origin-center ${
                isTransparent || isOpen ? 'bg-white' : 'bg-forest'
              } ${isOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Navigation — Full screen overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 top-16 md:top-20 bg-forest z-40"
          >
            <div className="px-8 py-12 flex flex-col gap-1">
              {[{ label: 'Home', href: '/' }, ...navItems, { label: 'Kaart', href: '/kaart' }].map(
                (item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block py-3 text-3xl font-serif text-cream hover:text-accent transition-colors"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ),
              )}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-12 flex gap-5"
              >
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-cream/10 flex items-center justify-center text-cream/60 hover:bg-accent hover:text-white transition-all duration-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-cream/10 flex items-center justify-center text-cream/60 hover:bg-accent hover:text-white transition-all duration-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-cream/10 flex items-center justify-center text-cream/60 hover:bg-accent hover:text-white transition-all duration-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.17V11.7a4.83 4.83 0 01-3.58-1.43V6.69h3.58z" />
                  </svg>
                </a>
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
