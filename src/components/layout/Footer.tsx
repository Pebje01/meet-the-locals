import Link from 'next/link'
import Image from 'next/image'

const footerLinks = {
  ontdek: [
    { label: 'Reistips', href: '/blog' },
    { label: 'Bestemmingen', href: '/bestemmingen' },
    { label: 'Reisfotografie', href: '/fotografie' },
    { label: 'Interactieve Kaart', href: '/kaart' },
  ],
  info: [
    { label: 'Over MTL', href: '/over' },
    { label: 'Contact', href: '/contact' },
    { label: 'Samenwerken', href: '/contact' },
  ],
  extern: [
    { label: 'The Daley Edit', href: 'https://thedaleyedit.nl' },
    { label: 'Daley Photography', href: 'https://thedaleyedit.nl' },
  ],
}

export function Footer() {
  return (
    <>
    {/* Wave sits outside footer so it inherits no overlays */}
    <div className="relative -mb-1">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-[55px] md:h-[85px] block">
        <path d="M0,120 L0,50 C240,75 420,25 660,55 C900,85 1080,30 1260,50 C1380,65 1420,45 1440,50 L1440,120 Z" fill="var(--color-forest-dark)" />
      </svg>
    </div>
    <footer className="bg-forest-dark text-cream relative noise-overlay speckle-overlay">

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-20 md:pt-24 pb-16 md:pb-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-4">
            <Image
              src="/logo.png"
              alt="Meet the Locals"
              width={200}
              height={60}
              className="h-12 w-auto brightness-0 invert mb-5"
            />
            <p className="text-cream/80 text-[15px] leading-relaxed mb-6 max-w-xs">
              Persoonlijke reisverhalen, fotografie en tips van bestemmingen wereldwijd.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center text-cream/80 hover:bg-accent hover:text-white transition-all duration-300"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center text-cream/80 hover:bg-accent hover:text-white transition-all duration-300"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center text-cream/80 hover:bg-accent hover:text-white transition-all duration-300"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.15V11.7a4.84 4.84 0 01-3.58-1.43V6.69h3.58z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Ontdek */}
          <div className="md:col-span-2 md:col-start-6">
            <h4 className="font-display! text-lg uppercase tracking-[0.1em] text-white! mb-5">Ontdek</h4>
            <ul className="space-y-3">
              {footerLinks.ontdek.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="text-cream/80 hover:text-cream transition-colors text-[15px]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div className="md:col-span-2">
            <h4 className="font-display! text-lg uppercase tracking-[0.1em] text-white! mb-5">Informatie</h4>
            <ul className="space-y-3">
              {footerLinks.info.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="text-cream/80 hover:text-cream transition-colors text-[15px]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Extern */}
          <div className="md:col-span-2">
            <h4 className="font-display! text-lg uppercase tracking-[0.1em] text-white! mb-5">Bekijk ook eens</h4>
            <ul className="space-y-3">
              {footerLinks.extern.map((link) => (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="group text-cream/80 hover:text-cream transition-colors text-[15px] inline-flex items-center gap-1">
                    {link.label}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-cream/8 mt-14 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-cream/40 text-[13px]">
            &copy; {new Date().getFullYear()} Meet the Locals is onderdeel van <a href="https://thedaleyedit.nl" target="_blank" rel="noopener noreferrer" className="text-cream/60 hover:text-accent transition-colors">The Daley Edit</a>
          </p>
          <p className="text-cream/40 text-[13px]">
            Webdesign by <a href="https://wegrowbrands.online" target="_blank" rel="noopener noreferrer" className="text-cream/60 hover:text-accent transition-colors">We Grow Brands</a>
          </p>
        </div>
      </div>
    </footer>
    </>
  )
}
