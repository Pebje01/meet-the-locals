import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

/**
 * De knop van Meet the Locals. Eén component voor alle knoppen op de site,
 * zodat afronding, maat, letter en hover overal gelijk zijn.
 *
 * - `accent`: oranje, de hoofdactie
 * - `forest`: bosgroen, tweede actie op lichte achtergrond
 * - `glass`: doorschijnend wit, voor op foto's en donkere vlakken
 * - `cream`: crème met donkeroranje tekst, voor in oranje kaarten
 * - `outline`: alleen een rand, voor rustige nevenacties
 */
export type ButtonVariant = 'accent' | 'forest' | 'glass' | 'cream' | 'outline'
export type ButtonSize = 'sm' | 'md'

const VARIANTS: Record<ButtonVariant, string> = {
  accent: 'bg-accent text-white hover:bg-accent-light',
  forest: 'bg-forest text-cream hover:bg-link-hover',
  glass: 'border border-white/25 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20',
  cream: 'bg-cream text-accent-deep hover:bg-cream/90',
  outline: 'border border-forest/20 text-forest hover:bg-forest hover:text-cream',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'px-5 py-2.5 text-[12px] tracking-[0.08em]',
  md: 'px-7 py-3.5 text-[13px] tracking-[0.1em] sm:px-8 sm:py-4 sm:text-sm',
}

export function buttonClasses({
  variant = 'accent',
  size = 'md',
  shape = 'organic-btn',
  className = '',
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  shape?: 'organic-btn' | 'organic-btn-alt'
  className?: string
}): string {
  return `group inline-flex items-center justify-center gap-2.5 whitespace-nowrap font-semibold uppercase transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${shape} ${VARIANTS[variant]} ${SIZES[size]} ${className}`
}

export function ButtonArrow({ direction = 'right' }: { direction?: 'right' | 'diagonal' | 'left' }) {
  const path =
    direction === 'diagonal'
      ? 'M7 17L17 7M17 7H7M17 7V17'
      : direction === 'left'
        ? 'M19 12H5M11 6l-6 6 6 6'
        : 'M5 12h14M13 6l6 6-6 6'
  return (
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
}

type Common = {
  variant?: ButtonVariant
  size?: ButtonSize
  shape?: 'organic-btn' | 'organic-btn-alt'
  arrow?: 'right' | 'diagonal' | 'left' | false
  className?: string
  children: ReactNode
}

type LinkProps = Common & { href: string } & Omit<ComponentProps<typeof Link>, 'href' | 'className' | 'children'>
type NativeProps = Common & { href?: undefined } & Omit<ComponentProps<'button'>, 'className' | 'children'>

export function Button(props: LinkProps | NativeProps) {
  const { variant, size, shape, arrow = false, className, children, ...rest } = props
  const classes = buttonClasses({ variant, size, shape, className })
  const content = (
    <>
      {arrow === 'left' && <ButtonArrow direction="left" />}
      <span>{children}</span>
      {arrow && arrow !== 'left' && <ButtonArrow direction={arrow} />}
    </>
  )

  if ('href' in rest && typeof rest.href === 'string') {
    const { href, ...linkRest } = rest as LinkProps
    const external = /^https?:\/\//.test(href)
    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
          {content}
        </a>
      )
    }
    return (
      <Link href={href} className={classes} {...linkRest}>
        {content}
      </Link>
    )
  }

  return (
    <button className={classes} {...(rest as NativeProps)}>
      {content}
    </button>
  )
}
