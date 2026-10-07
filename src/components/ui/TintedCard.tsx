import type { ReactNode } from 'react'

/** Zacht gekleurd kaartje met icoon, titel en korte tekst. */
export type TintedCardTone = 'water' | 'sand' | 'accent' | 'mint'

const TONES: Record<TintedCardTone, { card: string; icon: string }> = {
  water: { card: 'bg-water-muted border-water-light/50', icon: 'bg-white/55 text-water' },
  sand: { card: 'bg-sand-pale border-sand/30', icon: 'bg-white/55 text-link-hover' },
  accent: { card: 'bg-accent-muted border-accent/15', icon: 'bg-white/60 text-accent' },
  mint: { card: 'bg-mint border-forest/10', icon: 'bg-white/55 text-forest' },
}

export function TintedCard({
  icon,
  title,
  text,
  tone = 'water',
  className = '',
}: {
  icon?: ReactNode
  title: ReactNode
  text?: ReactNode
  tone?: TintedCardTone
  className?: string
}) {
  const t = TONES[tone]
  return (
    <div className={`group organic-card card-lift border p-7 transition-colors md:p-6 lg:p-10 ${t.card} ${className}`}>
      {icon && (
        <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300 group-hover:bg-white/80 ${t.icon}`}>
          {icon}
        </div>
      )}
      <h3 className="t-card mb-3 text-forest">{title}</h3>
      {text && <p className="t-body text-text-muted">{text}</p>}
    </div>
  )
}
