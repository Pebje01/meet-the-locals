import Link from 'next/link'
import { BreadcrumbJsonLd } from '@/components/JsonLd'

export type Crumb = { name: string; href: string }

/**
 * Kruimelpad voor elke pagina behalve de homepage. Levert tegelijk de
 * BreadcrumbList voor zoekmachines, zodat het zichtbare pad en de structured
 * data nooit uit elkaar lopen. Home staat er altijd vooraan; geef alleen de
 * stappen daarna mee, de laatste is de huidige pagina.
 *
 * `tone="light"` op foto's en donkere vlakken, `align="center"` in gecentreerde heroes.
 */
export function Breadcrumbs({
  items,
  tone = 'light',
  align = 'left',
  className = '',
}: {
  items: Crumb[]
  tone?: 'light' | 'dark'
  align?: 'left' | 'center'
  className?: string
}) {
  const all: Crumb[] = [{ name: 'Home', href: '/' }, ...items]
  const link = tone === 'light' ? 'text-cream/65 hover:text-cream' : 'text-forest/55 hover:text-accent'
  const current = tone === 'light' ? 'text-cream' : 'text-forest'
  const separator = tone === 'light' ? 'text-cream/35' : 'text-forest/30'

  return (
    <>
      <BreadcrumbJsonLd items={all.map((c) => ({ name: c.name, url: c.href }))} />
      <nav aria-label="Kruimelpad" className={className}>
        <ol
          className={`t-meta flex flex-wrap items-center gap-x-2 gap-y-1 font-semibold ${
            align === 'center' ? 'justify-center' : ''
          }`}
        >
          {all.map((crumb, i) => {
            const isLast = i === all.length - 1
            return (
              <li key={crumb.href} className={`flex min-w-0 items-center gap-2 ${isLast ? 'max-w-full' : ''}`}>
                {i > 0 && (
                  <span aria-hidden className={separator}>
                    /
                  </span>
                )}
                {isLast ? (
                  <span aria-current="page" className={`truncate ${current}`}>
                    {crumb.name}
                  </span>
                ) : (
                  <Link href={crumb.href} className={`whitespace-nowrap transition-colors ${link}`}>
                    {crumb.name}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
