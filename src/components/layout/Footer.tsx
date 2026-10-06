import Link from 'next/link'
import Image from 'next/image'
import { OrganicEdge } from '@/components/OrganicEdge'
import { SOCIAL_LINKS } from '@/lib/social'
import { SocialIcon } from '@/components/SocialIcon'

const footerLinks = {
  ontdek: [
    { label: 'Korte verhalen', href: '/blog' },
    { label: 'Bestemmingen', href: '/bestemmingen' },
    { label: 'Reisfotografie', href: '/fotografie' },
    { label: 'Interactieve Kaart', href: '/kaart' },
  ],
  info: [
    { label: 'Samenwerken', href: '/werk-in-opdracht#samenwerken' },
    { label: 'Portfolio', href: '/werk-in-opdracht' },
    { label: 'Over MTL', href: '/over' },
    { label: 'Reisnieuws', href: '/reisnieuws' },
    { label: 'Contact', href: '/contact' },
  ],
  extern: [
    { label: 'The Daley Edit', href: 'https://thedaleyedit.nl' },
    { label: 'Daley Photography', href: 'https://thedaleyedit.nl' },
    { label: 'Jose Bakkenes | Travel Counsellors', href: 'https://www.travelcounsellors.nl/jose.bakkenes/' },
    { label: 'We Grow Brands', href: 'https://wegrowbrands.online' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-forest-dark text-cream relative noise-overlay speckle-overlay">
      {/*
        De golf stond eerst als los blok bóven de voet en nam daar zelf hoogte
        in. Daardoor bleef er een leeg strookje tussen de laatste sectie en de
        voet staan. Nu ligt hij over de laatste sectie heen, net als de andere
        randen op de site, en loopt die sectie dus door tot in de voet.

        Hoogte blijft onder 80px. Dat is waar de korrel- en spikkellagen van de
        voet tot boven de rand uit komen, dus krijgt de golf dezelfde textuur
        als de voet zelf en zie je geen toonverschil op de naad. Het laat ook
        genoeg lucht onder de laatste sectie: de nieuwsbriefkaart eindigt 64px
        boven de rand, en daar moet de golf onder blijven.
      */}
      <div className="pointer-events-none absolute inset-x-0 -top-[50px] z-[1] h-[50px] md:-top-[70px] md:h-[70px]">
        <OrganicEdge fill="var(--color-forest-dark)" className="h-full" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-20 md:pt-24 pb-16 md:pb-20 relative z-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 md:gap-x-8 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-4">
            <Image
              src="/media/logo.webp"
              alt="Meet the Locals"
              width={200}
              height={60}
              className="h-24 w-auto brightness-0 invert mb-5"
            />
            <p className="text-cream/80 text-[15px] leading-relaxed mb-6 max-w-xs">
              Persoonlijke reisverhalen, fotografie en tips van bestemmingen wereldwijd.
            </p>
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.network}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center text-cream/80 hover:bg-accent hover:text-white transition-all duration-300"
                >
                  <SocialIcon network={social.network} />
                </a>
              ))}
            </div>
          </div>

          {/* Ontdek */}
          <div className="col-span-1 lg:col-span-2 lg:col-start-6">
            <h4 className="mb-5 font-display text-lg uppercase tracking-[0.1em] text-white">Ontdek</h4>
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
          <div className="col-span-1 lg:col-span-2">
            <h4 className="mb-5 font-display text-lg uppercase tracking-[0.1em] text-white">Informatie</h4>
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
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <h4 className="mb-5 font-display text-lg uppercase tracking-[0.1em] text-white">Bekijk ook eens</h4>
            <ul className="space-y-3">
              {footerLinks.extern.map((link) => (
                <li key={link.label}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="group text-cream/80 hover:text-cream transition-colors text-[15px] inline-flex items-center gap-1">
                    {link.label}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="opacity-60 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
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
  )
}
