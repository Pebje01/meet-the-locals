import type { ReactNode } from 'react'
import { Marquee } from '@/components/Marquee'
import type { Destination } from '@/payload-types'

type TravelInfo = NonNullable<Destination['travelInfo']>

const SAFETY_LABELS: Record<string, string> = {
  green: 'Groen',
  yellow: 'Geel',
  orange: 'Oranje',
  red: 'Rood',
}

// Tailwind classes for the safety dot — must be spelled out in full so Tailwind includes them
const SAFETY_DOT: Record<string, string> = {
  green: 'bg-green-400',
  yellow: 'bg-yellow-300',
  orange: 'bg-orange-400',
  red: 'bg-red-400',
}

type StripItem = {
  label: string
  icon: ReactNode
  value: string
  dotClass?: string
}

function IconLanguage() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10A15.3 15.3 0 0 1 8 12a15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}
function IconCurrency() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M14.5 7.5A2.5 2.5 0 0 0 9.5 9v6a2.5 2.5 0 0 0 5 1.5M8 12h8" />
    </svg>
  )
}
function IconClimate() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}
function IconTimezone() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
function IconPlug() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22v-5M9 7V3M15 7V3M9 12H5a7 7 0 0 0 14 0h-4M9 7h6v5H9z" />
    </svg>
  )
}
function IconShield() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}
function IconPassport() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <circle cx="12" cy="11" r="3" />
      <path d="M8 7h.01M16 7h.01M8 17h8" />
    </svg>
  )
}
function IconInfo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  )
}
function IconPlane() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
    </svg>
  )
}
function IconCar() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 17H3v-5l2-5h14l2 5v5h-2" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  )
}

/**
 * Dezelfde golf als de onderrand van de bestemmingshero (heroWaveClip in
 * DestinationHeroClient), omgerekend naar een strook van 1440 x 100. Het
 * gevulde deel ligt boven de lijn, zodat de balk de foto in golft.
 */
const HERO_WAVE =
  'M0,0 L1440,0 L1440,29 C1267,29 1181,71 1037,57 C893,50 778,14 634,29 C490,43 389,71 245,57 C101,50 43,21 0,29 Z'

export function DestinationInfoStrip({
  info,
  flightHours,
}: {
  info: TravelInfo | null | undefined
  flightHours?: string | null
}) {
  const items: StripItem[] = []

  if (info) {
    if (info.language) items.push({ label: 'Taal', icon: <IconLanguage />, value: info.language })
    if (info.currency) items.push({ label: 'Valuta', icon: <IconCurrency />, value: info.currency })
    if (info.climate) items.push({ label: 'Klimaat', icon: <IconClimate />, value: info.climate })
    if (info.timezone) items.push({ label: 'Tijdzone', icon: <IconTimezone />, value: info.timezone })
    if (info.plugType) items.push({ label: 'Stroom', icon: <IconPlug />, value: info.plugType })
    if (info.safetyLevel) {
      items.push({
        label: 'Reisadvies',
        icon: <IconShield />,
        value: SAFETY_LABELS[info.safetyLevel] ?? info.safetyLevel,
        dotClass: SAFETY_DOT[info.safetyLevel],
      })
    }
    if (info.safetyNote) items.push({ label: 'Advies', icon: <IconInfo />, value: info.safetyNote })
    if (info.visaNote) items.push({ label: 'Visum', icon: <IconPassport />, value: info.visaNote })
  }

  // Reistijd / vliegtijd — icon depends on content
  if (flightHours) {
    const isRoad = flightHours.toLowerCase().includes('rijden')
    items.push({ label: isRoad ? 'Reistijd' : 'Vliegtijd', icon: isRoad ? <IconCar /> : <IconPlane />, value: flightHours })
  }

  // Zonder ingevulde reisinfo geen strook: een rij streepjes zegt niets.
  if (items.length === 0) return null
  const displayItems = items

  return (
    // Ligt direct onder de hero. De wrapper eromheen schuift onder de golf
    // van de hero, dus de bovenkant van deze balk volgt die golf vanzelf; de
    // ruimte bovenin compenseert die overlap. Onderaan dezelfde golf, over de foto heen.
    <div className="relative z-[2] bg-accent pt-20 md:pt-28 lg:pt-36">
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 top-full -mt-px block h-[56px] w-full md:h-[52px]"
        aria-hidden="true"
      >
        <path d={HERO_WAVE} fill="var(--color-accent)" />
      </svg>

      {/* Scrolling strip */}
      <div className="relative overflow-hidden py-5">
        {/* Soft fade on left and right so items scroll smoothly out of view */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-accent to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-accent to-transparent" />

        <Marquee className="flex whitespace-nowrap">
          {[0, 1].map((copy) => (
            <span key={copy} className="flex items-center">
              {displayItems.map((item, i) => (
                <span
                  key={`${item.label}-${i}-${copy}`}
                  className="mr-14 flex items-center gap-14"
                >
                  <span className="flex items-center gap-3">
                    {/* Icon */}
                    <span className="text-white/80 flex-shrink-0" aria-label={item.label}>
                      {item.icon}
                    </span>
                    {/* Safety colour dot */}
                    {item.dotClass && (
                      <span className={`inline-block h-2 w-2 flex-shrink-0 rounded-full ${item.dotClass}`} />
                    )}
                    {/* Value: athletics sans, larger and more prominent */}
                    <span className="font-sans text-[22px] font-medium tracking-[0.01em] text-white">
                      {item.value}
                    </span>
                  </span>
                  <span className="text-[11px] text-white/25">✦</span>
                </span>
              ))}
            </span>
          ))}
        </Marquee>
      </div>
    </div>
  )
}

