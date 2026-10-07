import type { ReactNode } from 'react'
import { TextLink } from './TextLink'

/** Lege staat voor overzichten zonder inhoud. Zelfde toon en opmaak overal. */
export function EmptyState({
  title,
  text,
  link,
  children,
}: {
  title: string
  text?: string
  link?: { href: string; label: string }
  children?: ReactNode
}) {
  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-forest/10 bg-cream-dark/40 px-8 py-14 text-center md:py-16">
      <h3 className="t-h3 mb-3 text-forest">{title}</h3>
      {text && <p className="t-body text-text-muted">{text}</p>}
      {link && (
        <div className="mt-6">
          <TextLink href={link.href}>{link.label}</TextLink>
        </div>
      )}
      {children}
    </div>
  )
}
