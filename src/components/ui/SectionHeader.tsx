import type { ReactNode } from 'react'
import { Eyebrow } from './Eyebrow'
import { TextLink } from './TextLink'

/**
 * Kop van een sectie: eyebrow, titel, en optioneel een link rechts.
 * `align="center"` voor secties zonder link. `tone="light"` op donkergroen.
 */
export function SectionHeader({
  title,
  eyebrow,
  link,
  align = 'left',
  tone = 'dark',
  className = 'mb-12 md:mb-14',
  children,
}: {
  title: ReactNode
  eyebrow?: string
  link?: { href: string; label: string }
  align?: 'left' | 'center'
  tone?: 'dark' | 'light'
  className?: string
  /** Extra regel onder de titel, bijvoorbeeld een korte intro. */
  children?: ReactNode
}) {
  const titleColor = tone === 'light' ? 'text-cream' : 'text-forest'
  const centered = align === 'center'

  return (
    <div
      className={`flex flex-col gap-6 ${
        centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'
      } ${className}`}
    >
      <div className={centered ? 'max-w-3xl' : ''}>
        {eyebrow && (
          <Eyebrow tone={tone === 'light' ? 'light' : 'accent'} className="mb-3">
            {eyebrow}
          </Eyebrow>
        )}
        <h2 className={`t-h2 ${titleColor}`}>{title}</h2>
        {children && (
          <p className={`t-lead mt-4 max-w-2xl ${tone === 'light' ? 'text-cream/70' : 'text-text-muted'}`}>
            {children}
          </p>
        )}
      </div>
      {link && !centered && (
        <TextLink href={link.href} tone={tone === 'light' ? 'light' : 'forest'} className="shrink-0">
          {link.label}
        </TextLink>
      )}
    </div>
  )
}
