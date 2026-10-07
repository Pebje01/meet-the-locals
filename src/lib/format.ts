/**
 * Datumweergave voor de hele site.
 *
 * Overzichten (kaarten, lijsten) gebruiken 'short': "23 mei 2026".
 * Detailpagina's gebruiken 'long': "23 mei 2026" voluit, dus "23 mei 2026"
 * wordt "23 mei 2026" en "5 sep 2026" wordt "5 september 2026".
 */
export function formatDate(date: string | null | undefined, style: 'short' | 'long' = 'short'): string {
  if (!date) return ''
  const parsed = new Date(date)
  if (Number.isNaN(parsed.getTime())) return ''
  return new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    year: 'numeric',
  })
    .format(parsed)
    .replace(/\./g, '')
}
