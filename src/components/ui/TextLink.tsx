import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * Tekstlink met pijl: "Lees verhaal", "Alle reportages", "Bekijk bestemming".
 * Eén stijl voor de hele site. `tone="light"` op donkere vlakken.
 */
export function TextLink({
  href,
  children,
  tone = 'accent',
  direction = 'right',
  className = '',
}: {
  href: string
  children: ReactNode
  tone?: 'accent' | 'forest' | 'light'
  direction?: 'right' | 'left' | 'diagonal'
  className?: string
}) {
  const color =
    tone === 'light'
      ? 'text-cream/80 hover:text-cream'
      : tone === 'forest'
        ? 'text-forest hover:text-accent'
        : 'text-accent hover:text-accent-dark'
  const path =
    direction === 'diagonal'
      ? 'M7 17L17 7M17 7H7M17 7V17'
      : direction === 'left'
        ? 'M19 12H5M11 6l-6 6 6 6'
        : 'M5 12h14M13 6l6 6-6 6'

  const arrow = (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 transition-transform duration-300 ${
        direction === 'left' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'
      }`}
    >
      <path d={path} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

  return (
    <Link
      href={href}
      className={`group font-btn inline-flex items-center gap-2 whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.1em] transition-colors ${color} ${className}`}
    >
      {direction === 'left' && arrow}
      <span>{children}</span>
      {direction !== 'left' && arrow}
    </Link>
  )
}
