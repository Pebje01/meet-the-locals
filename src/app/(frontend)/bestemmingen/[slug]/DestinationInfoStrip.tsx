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
  value: string
  dotClass?: string
  placeholder?: boolean
}

// Shown while no travel info has been added in the CMS yet
const PLACEHOLDER_ITEMS: StripItem[] = [
  { label: 'Taal', value: '—', placeholder: true },
  { label: 'Valuta', value: '—', placeholder: true },
  { label: 'Klimaat', value: '—', placeholder: true },
  { label: 'Tijdzone', value: '—', placeholder: true },
  { label: 'Stroom', value: '—', placeholder: true },
  { label: 'Reisadvies', value: '—', placeholder: true },
  { label: 'Visum', value: '—', placeholder: true },
]

export function DestinationInfoStrip({
  info,
  flightHours,
}: {
  info: TravelInfo | null | undefined
  flightHours?: string | null
}) {
  const items: StripItem[] = []

  if (info) {
    if (info.language) items.push({ label: 'Taal', value: info.language })
    if (info.currency) items.push({ label: 'Valuta', value: info.currency })
    if (info.climate) items.push({ label: 'Klimaat', value: info.climate })
    if (info.timezone) items.push({ label: 'Tijdzone', value: info.timezone })
    if (info.plugType) items.push({ label: 'Stroom', value: info.plugType })
    if (info.safetyLevel) {
      items.push({
        label: 'Reisadvies',
        value: SAFETY_LABELS[info.safetyLevel] ?? info.safetyLevel,
        dotClass: SAFETY_DOT[info.safetyLevel],
      })
    }
    if (info.safetyNote) items.push({ label: 'Advies', value: info.safetyNote })
    if (info.visaNote) items.push({ label: 'Visum', value: info.visaNote })
  }

  // Reistijd / vliegtijd — label depends on content
  if (flightHours) {
    const label = flightHours.toLowerCase().includes('rijden') ? 'Reistijd' : 'Vliegtijd'
    items.push({ label, value: flightHours })
  }

  const displayItems = items.length > 0 ? items : PLACEHOLDER_ITEMS

  return (
    <div className="-mt-[40px] relative z-20">
      {/*
        Wave SVG: transparent above the curve, orange below.
        This gives the orange bar an organic top edge that overlaps the photo.
      */}
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className="block w-full"
        style={{ height: '40px' }}
        aria-hidden="true"
      >
        <path
          d="M0,38 C360,28 720,48 1080,34 C1260,27 1380,38 1440,36 L1440,60 L0,60 Z"
          fill="var(--color-accent)"
        />
      </svg>

      {/* Scrolling strip */}
      <div className="bg-accent relative -mt-px overflow-hidden py-5">
        {/* Soft fade on left and right so items scroll smoothly out of view */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-accent to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-accent to-transparent" />

        <div className="animate-marquee flex whitespace-nowrap">
          {[0, 1].map((copy) => (
            <span key={copy} className="flex items-center">
              {displayItems.map((item, i) => (
                <span
                  key={`${item.label}-${i}-${copy}`}
                  className="mr-14 flex items-center gap-14"
                >
                  <span className={`flex items-center gap-3 transition-opacity ${item.placeholder ? 'opacity-30' : ''}`}>
                    {/* Label: oslla editorial font */}
                    <span className="font-editorial text-[13px] tracking-[0.06em] text-white/60">
                      {item.label}
                    </span>
                    <span className="text-white/30">·</span>
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
        </div>
      </div>
    </div>
  )
}

