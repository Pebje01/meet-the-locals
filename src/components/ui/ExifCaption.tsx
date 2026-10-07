import type { Media } from '@/payload-types'
import { CREDIT } from '@/lib/credit'

type Exif = NonNullable<Media['exif']>

/**
 * EXIF-regel over een foto: naamsvermelding, camera, lens, instellingen en
 * locatie. Zet hem in een `group` met `position: relative`.
 *
 * Op apparaten met een muis verschijnt hij bij hover, zoals de huisregel voor
 * fotosliders wil. Op touch is er geen hover, daar staat hij altijd klein in beeld.
 */
export function ExifCaption({ exif, location }: { exif?: Exif | null; location?: string | null }) {
  const parts = [
    `© ${CREDIT.creator}`,
    exif?.camera,
    exif?.lens,
    exif?.focalLength,
    exif?.aperture,
    exif?.shutterSpeed,
    exif?.iso ? `ISO ${exif.iso}` : null,
  ].filter(Boolean) as string[]

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-start gap-1 bg-gradient-to-t from-black/55 to-transparent p-3 pt-10 transition-opacity duration-300 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100">
      {location && <p className="text-[11px] font-semibold leading-snug text-white">{location}</p>}
      <p className="font-mono text-[10px] leading-snug tracking-wide text-white/80">{parts.join(' · ')}</p>
    </div>
  )
}
