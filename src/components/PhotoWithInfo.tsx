'use client'

import Image from 'next/image'

export interface PhotoMeta {
  location: string
  camera: string
  iso: number
  shutter: string
  aperture: number
  focalLength: string
  year: string
}

interface PhotoWithInfoProps {
  src: string
  alt: string
  meta?: PhotoMeta
  fill?: boolean
  className?: string
  sizes?: string
  priority?: boolean
  objectPosition?: string
}

export function PhotoWithInfo({
  src,
  alt,
  meta,
  fill = true,
  className = 'object-cover',
  sizes,
  priority,
  objectPosition,
}: PhotoWithInfoProps) {
  if (!meta) {
    return (
      <Image
        src={src}
        alt={alt}
        fill={fill}
        className={className}
        sizes={sizes}
        priority={priority}
      />
    )
  }

  return (
    <div className="group absolute inset-0">
      <Image
        src={src}
        alt={alt}
        fill={fill}
        className={`${className} transition-transform duration-500 group-hover:scale-[1.03]`}
        style={objectPosition ? { objectPosition } : undefined}
        sizes={sizes}
        priority={priority}
      />

      {/* Hover overlay */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {/* Gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Info panel */}
        <div className="relative z-10 translate-y-2 p-3 transition-transform duration-300 group-hover:translate-y-0 md:p-4">
          {/* Location */}
          <div className="mb-2 flex items-center gap-1.5">
            <svg
              className="h-3 w-3 flex-shrink-0 text-white/80"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white">
              {meta.location}
            </span>
          </div>

          {/* EXIF row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <ExifChip icon="aperture" value={`f/${meta.aperture}`} />
            <ExifChip icon="shutter" value={`${meta.shutter}s`} />
            <ExifChip icon="iso" value={`ISO ${meta.iso}`} />
            <ExifChip icon="focal" value={meta.focalLength} />
            <span className="ml-auto text-[10px] text-white/50">{meta.camera} &middot; {meta.year}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ExifChip({ icon, value }: { icon: string; value: string }) {
  return (
    <span className="flex items-center gap-1 rounded bg-white/15 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
      {icon === 'aperture' && (
        <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="14.31" y1="8" x2="20.05" y2="17.94" />
          <line x1="9.69" y1="8" x2="21.17" y2="8" />
          <line x1="7.38" y1="12" x2="13.12" y2="2.06" />
          <line x1="9.69" y1="16" x2="3.95" y2="6.06" />
          <line x1="14.31" y1="16" x2="2.83" y2="16" />
          <line x1="16.62" y1="12" x2="10.88" y2="21.94" />
        </svg>
      )}
      {icon === 'shutter' && (
        <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )}
      {icon === 'iso' && (
        <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M7 17V7m4 10V7l5 10V7" />
        </svg>
      )}
      {icon === 'focal' && (
        <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
        </svg>
      )}
      {value}
    </span>
  )
}
