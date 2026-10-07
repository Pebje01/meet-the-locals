'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { SOCIAL_LINKS } from '@/lib/social'
import { SocialIcon } from '@/components/SocialIcon'

const navItems = [
  // Twee soorten verhalen, onderscheiden op diepte. 'Reportages' in plaats van
  // 'Verhalen' voorkomt de botsing met de korte verhalen op /blog, die tot nu
  // toe helemaal niet in het menu stonden.
  { label: 'Reportages', href: '/verhalen' },
  { label: 'Korte verhalen', href: '/blog' },
  { label: 'Bestemmingen', href: '/bestemmingen' },
  { label: 'Reisnieuws', href: '/reisnieuws' },
  { label: 'Fotografie', href: '/fotografie' },
  { label: 'Over', href: '/over' },
  { label: 'Contact', href: '/contact' },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  // Elke pagina opent met een donkere hero, dus de header begint overal
  // transparant met witte tekst en wordt bosgroen zodra je scrolt.
  const hasDarkHero = true
  const hasAlwaysDarkBg = pathname === '/werk-in-opdracht'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isTransparent = hasDarkHero && !scrolled && !isOpen
  const isDark = isOpen || isTransparent || hasAlwaysDarkBg || scrolled

  return (
    <header
      className={`fixed z-50 transition-all duration-500 ${
        isOpen
          ? 'top-0 left-0 right-0 bg-forest-dark noise-overlay overflow-hidden'
          : scrolled
            ? 'top-0 left-0 right-0 bg-forest-dark border-b border-white/10'
            : isTransparent || hasAlwaysDarkBg
              ? 'top-0 left-0 right-0 bg-transparent'
              : 'top-0 left-0 right-0 bg-[#e8f2e8]/95 backdrop-blur-xl border-b border-forest/15'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex items-center justify-between h-16 md:h-20 py-2">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 group">
          <Image
            src="/media/logo.webp"
            alt="Meet the Locals"
            width={320}
            height={96}
            className={`h-14 md:h-16 w-auto transition-all duration-500 group-hover:scale-[1.02] ${
              isOpen ? 'logo-light-green' : isDark ? 'brightness-0 invert' : 'logo-forest'
            }`}
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-2">
          {navItems.map((item, i) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const wobble = i % 2 === 0 ? 'organic-btn' : 'organic-btn-alt'
            const hoverColor = i % 2 === 0 ? 'hover:bg-accent' : 'hover:bg-link-hover'
            const activeColor = i % 2 === 0 ? 'bg-accent' : 'bg-link-hover'
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative whitespace-nowrap px-2 xl:px-3 py-1 ${wobble} nav-font text-[14px] xl:text-[17px] font-extralight tracking-[0.03em] xl:tracking-[0.04em] uppercase transition-all duration-300 ${
                  isActive
                    ? `${activeColor} text-white`
                    : isDark
                      ? `text-white ${hoverColor} hover:text-white`
                      : `text-forest ${hoverColor} hover:text-white`
                }`}
              >
                {item.label}
              </Link>
            )
          })}
          <Link
            href="/kaart"
            className={`ml-2 xl:ml-3 flex items-center gap-2 px-4 xl:px-5 py-2.5 organic-btn text-[12px] font-semibold tracking-[0.08em] uppercase transition-all duration-300 ${
              isDark
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
            isDark ? 'bg-white/15 backdrop-blur-sm' : 'bg-forest/10'
          }`}
          aria-label="Menu"
        >
          <div className="flex flex-col gap-[5px]">
            <span
              className={`block w-6 h-[1.5px] transition-all duration-300 origin-center ${
                isDark ? 'bg-white' : 'bg-forest'
              } ${isOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`}
            />
            <span
              className={`block w-4 h-[1.5px] transition-all duration-300 ${
                isDark ? 'bg-white' : 'bg-forest'
              } ${isOpen ? 'opacity-0 translate-x-2' : ''}`}
            />
            <span
              className={`block w-6 h-[1.5px] transition-all duration-300 origin-center ${
                isDark ? 'bg-white' : 'bg-forest'
              } ${isOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Navigation: Full screen overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed inset-0 top-16 md:top-20 bg-forest-dark noise-overlay overflow-hidden z-40"
          >
            <div className="relative z-10 px-8 py-12 flex flex-col gap-1">
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
                      className="block py-3 text-3xl font-light text-cream hover:text-accent transition-colors nav-font"
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
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.network}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-11 h-11 rounded-full bg-cream/10 flex items-center justify-center text-cream/60 hover:bg-accent hover:text-white transition-all duration-300"
                  >
                    <SocialIcon network={social.network} size={20} />
                  </a>
                ))}
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
