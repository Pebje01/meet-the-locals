import Image from 'next/image'
import Link from 'next/link'
import type { MapSpot } from './PhotoMap'

function ExifChip({ label }: { label: string }) {
  return (
    <span className="rounded bg-black/40 px-1.5 py-0.5 text-[10px] tracking-wide text-white/90 backdrop-blur-sm">
      {label}
    </span>
  )
}

function SpotCard({ spot }: { spot: MapSpot }) {
  const hasExif = spot.camera || spot.lens || spot.aperture || spot.shutterSpeed || spot.iso || spot.focalLength

  const inner = (
    <>
      <div className="organic-img img-zoom group/photo relative mb-5 aspect-[4/3] overflow-hidden">
        <Image
          src={spot.photoUrl}
          alt={spot.alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* EXIF hover overlay */}
        {hasExif && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-1 opacity-0 transition-all duration-300 group-hover/photo:translate-y-0 group-hover/photo:opacity-100">
            <div className="bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-6">
              {spot.camera && (
                <p className="mb-1.5 truncate text-[11px] font-medium text-white/90">
                  {spot.camera}{spot.lens ? ` · ${spot.lens}` : ''}
                </p>
              )}
              <div className="flex flex-wrap gap-1">
                {spot.focalLength && <ExifChip label={spot.focalLength} />}
                {spot.aperture && <ExifChip label={`f/${spot.aperture}`} />}
                {spot.shutterSpeed && <ExifChip label={spot.shutterSpeed} />}
                {spot.iso && <ExifChip label={`ISO ${spot.iso}`} />}
              </div>
            </div>
          </div>
        )}

        {spot.country && (
          <span className="absolute bottom-3 left-3 rounded-full bg-forest-dark/65 px-3 py-1 text-[11px] uppercase tracking-[0.07em] text-warm-white backdrop-blur-sm">
            {spot.country}
          </span>
        )}
      </div>
      <h3 className="font-serif text-xl font-bold text-forest transition-colors group-hover:text-accent">
        {spot.title}
      </h3>
      {spot.story && (
        <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-text-muted">
          {spot.story}
        </p>
      )}
    </>
  )

  if (spot.postSlug) {
    return (
      <Link href={`/blog/${spot.postSlug}`} className="group card-lift block">
        {inner}
      </Link>
    )
  }

  return <article className="block">{inner}</article>
}

export function SpotGrid({ spots }: { spots: MapSpot[] }) {
  return (
    <div>
      <p className="mb-8 text-text-muted">
        De kaart kon niet geladen worden. Hieronder staan alle fotospots op een rij.
      </p>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {spots.map((spot) => (
          <SpotCard key={spot.id} spot={spot} />
        ))}
      </div>
    </div>
  )
}
