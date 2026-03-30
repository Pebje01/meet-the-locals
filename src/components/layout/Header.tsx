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
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isTransparent = isHome && !scrolled && !isOpen

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isTransparent
          ? 'bg-transparent'
          : 'bg-warm-white/95 backdrop-blur-xl shadow-[0_1px_0_0_rgba(26,46,26,0.06)]'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center justify-between h-24 mt-2">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 group">
          <Image
            src="/logo.png"
            alt="Meet the Locals"
            width={320}
            height={96}
            className={`h-16 w-auto transition-all duration-500 group-hover:scale-[1.02] ${
              isTransparent ? 'brightness-0 invert' : ''
            }`}
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 text-[13px] font-medium tracking-[0.08em] uppercase transition-colors duration-300 ${
                  isTransparent
                    ? 'text-white/90 hover:text-white'
                    : 'text-forest/70 hover:text-forest'
                } ${isActive && !isTransparent ? 'text-forest' : ''}`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-indicator"
                    className={`absolute bottom-0 left-4 right-4 h-[2px] ${
                      isTransparent ? 'bg-accent' : 'bg-accent'
                    }`}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
          <Link
            href="/kaart"
            className={`ml-3 flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] font-semibold tracking-[0.08em] uppercase transition-all duration-300 ${
              isTransparent
                ? 'bg-white/15 text-white backdrop-blur-sm hover:bg-white/25'
                : 'bg-accent text-white hover:bg-accent-dark'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Kaart
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden relative w-10 h-10 flex items-center justify-center"
          aria-label="Menu"
        >
          <div className="flex flex-col gap-[5px]">
            <span
              className={`block w-6 h-[1.5px] transition-all duration-300 origin-center ${
                isTransparent ? 'bg-white' : 'bg-forest'
              } ${isOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`}
            />
            <span
              className={`block w-4 h-[1.5px] transition-all duration-300 ${
                isTransparent ? 'bg-white' : 'bg-forest'
              } ${isOpen ? 'opacity-0 translate-x-2' : ''}`}
            />
            <span
              className={`block w-6 h-[1.5px] transition-all duration-300 origin-center ${
                isTransparent ? 'bg-white' : 'bg-forest'
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
            className="lg:hidden fixed inset-0 top-20 bg-forest z-40"
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
                className="mt-12 flex gap-6"
              >
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-accent transition-colors text-sm uppercase tracking-widest">
                  Instagram
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-cream/50 hover:text-accent transition-colors text-sm uppercase tracking-widest">
                  LinkedIn
                </a>
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
