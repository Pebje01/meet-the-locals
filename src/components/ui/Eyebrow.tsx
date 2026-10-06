import type { ReactNode } from 'react'

/** Kleine bovenkop boven een titel. `tone="light"` op donkere vlakken of foto's. */
export function Eyebrow({
  children,
  tone = 'accent',
  as: Tag = 'span',
  className = '',
}: {
  children: ReactNode
  tone?: 'accent' | 'light' | 'muted'
  as?: 'span' | 'p'
  className?: string
}) {
  const color = tone === 'light' ? 'text-cream/70' : tone === 'muted' ? 'text-text-muted/70' : 'text-accent'
  return <Tag className={`t-eyebrow block ${color} ${className}`}>{children}</Tag>
}
