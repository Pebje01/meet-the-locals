import Image from 'next/image'
import Link from 'next/link'
import { CREDIT, DEFINING_SENTENCE } from '@/lib/credit'

/**
 * Zichtbare naamsvermelding onder een artikel.
 *
 * Schema alleen is niet genoeg: taalmodellen lezen de gerenderde tekst.
 * Staat de naam nergens leesbaar op de pagina, dan is het signaal half.
 * De omschrijving komt uit credit.json, zodat die woordelijk gelijk blijft
 * aan wat er in het schema en op je profielen staat.
 */
export function AuthorByline({ className = '' }: { className?: string }) {
  return (
    <div
      className={`mt-16 flex flex-col gap-5 border-t border-forest/10 pt-8 sm:flex-row sm:items-start sm:gap-6 ${className}`}
    >
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-accent/20">
        <Image
          src="/media/daley-jansen.webp"
          alt={CREDIT.creator}
          width={64}
          height={64}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div>
        <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-text-muted/60">
          Geschreven en gefotografeerd door
        </p>
        <p className="font-display text-xl leading-tight text-forest">{CREDIT.creator}</p>
        <p className="mt-2 max-w-[52ch] text-[14px] leading-relaxed text-text-muted">
          {DEFINING_SENTENCE}
        </p>
        <Link
          href="/over"
          className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-accent transition-all hover:gap-2.5"
        >
          Lees mijn verhaal
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </div>
  )
}
