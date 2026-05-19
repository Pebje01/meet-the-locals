'use client'

import { useState, useRef, useCallback } from 'react'
import { ComposableMap, Geographies, Geography, Marker, type GeoFeature } from 'react-simple-maps'
import Link from 'next/link'
import type { MapSpot } from './PhotoMap'

const GEO_URL = '/countries-110m.json'

// ISO 3166-1 numeric → string, matched against topojson geo.id
const COUNTRY_TO_ISO: Record<string, string> = {
  Afghanistan: '4',
  Albanië: '8',
  Algerije: '12',
  Angola: '24',
  Argentinië: '32',
  Australië: '36',
  Azerbeidzjan: '31',
  Bangladesh: '50',
  België: '56',
  Bolivia: '68',
  Bosnië: '70',
  Botswana: '72',
  Brazilië: '76',
  Cambodja: '116',
  Canada: '124',
  Chili: '152',
  China: '156',
  Colombia: '170',
  'Costa Rica': '188',
  Cuba: '192',
  Tsjechië: '203',
  Denemarken: '208',
  'Dominicaanse Republiek': '214',
  Ecuador: '218',
  Egypte: '818',
  Ethiopië: '231',
  Finland: '246',
  Frankrijk: '250',
  Georgië: '268',
  Duitsland: '276',
  Ghana: '288',
  Griekenland: '300',
  Guatemala: '320',
  Haïti: '332',
  Honduras: '340',
  Hongarije: '348',
  IJsland: '352',
  India: '356',
  Indonesië: '360',
  Ierland: '372',
  Israël: '376',
  Italië: '380',
  Jamaica: '388',
  Japan: '392',
  Jordanië: '400',
  Kenia: '404',
  Kroatië: '191',
  Laos: '418',
  Libanon: '422',
  Lesotho: '426',
  Madagascar: '450',
  Maleisië: '458',
  Mexico: '484',
  Mongolië: '496',
  Montenegro: '499',
  Marokko: '504',
  Mozambique: '508',
  Myanmar: '104',
  Namibië: '516',
  Nepal: '524',
  Nederland: '528',
  'Nieuw-Zeeland': '554',
  Nicaragua: '558',
  Nigeria: '566',
  Noorwegen: '578',
  Oman: '512',
  Panama: '591',
  Paraguay: '600',
  Peru: '604',
  Filipijnen: '608',
  Polen: '616',
  Portugal: '620',
  Rwanda: '646',
  Singapore: '702',
  Slowakije: '703',
  Slovenië: '705',
  'Zuid-Afrika': '710',
  Spanje: '724',
  'Sri Lanka': '144',
  Zweden: '752',
  Zwitserland: '756',
  Tanzania: '834',
  Thailand: '764',
  Tunesië: '788',
  Turkije: '792',
  Oeganda: '800',
  VAE: '784',
  'Verenigd Koninkrijk': '826',
  VS: '840',
  Uruguay: '858',
  Vietnam: '704',
  Zambia: '894',
  Zimbabwe: '716',
}

type PopupState = { spot: MapSpot; x: number; y: number }

function PopupCard({
  spot,
  x,
  y,
  containerWidth,
  onEnter,
  onLeave,
}: {
  spot: MapSpot
  x: number
  y: number
  containerWidth: number
  onEnter: () => void
  onLeave: () => void
}) {
  const cardWidth = 280
  const left = x + 20 + cardWidth > containerWidth ? x - cardWidth - 12 : x + 20
  const top = Math.max(y - 60, 12)

  const exif = [
    spot.aperture,
    spot.shutterSpeed,
    spot.iso ? `ISO ${spot.iso}` : null,
    spot.focalLength,
  ].filter(Boolean) as string[]

  return (
    <div
      className="absolute z-20 w-[280px] bg-white rounded-2xl shadow-xl overflow-hidden"
      style={{ left, top }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="relative h-36">
        <img src={spot.photoUrl} alt={spot.alt} className="w-full h-full object-cover" />
        {spot.country && (
          <span className="absolute top-3 left-3 bg-black/50 text-white text-[11px] uppercase tracking-[0.1em] px-2 py-0.5 rounded-full">
            {spot.country}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display text-forest text-base leading-snug mb-1">{spot.title}</h3>
        {spot.story && (
          <p className="text-text-muted text-[13px] leading-relaxed line-clamp-2 mb-3">
            {spot.story}
          </p>
        )}
        {exif.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {exif.map((v) => (
              <span key={v} className="text-[11px] bg-cream px-1.5 py-0.5 rounded text-forest/70">
                {v}
              </span>
            ))}
          </div>
        )}
        {spot.postSlug && (
          <Link
            href={`/blog/${spot.postSlug}`}
            className="inline-flex items-center gap-1.5 text-accent text-[12px] font-semibold uppercase tracking-wide hover:underline"
          >
            Lees het verhaal
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M7 17L17 7M9 7h8v8"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        )}
      </div>
    </div>
  )
}

export function PhotoMapSVG({ spots }: { spots: MapSpot[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [popup, setPopup] = useState<PopupState | null>(null)
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const clearHide = useCallback(() => clearTimeout(hideTimer.current), [])

  const scheduleHide = useCallback(() => {
    clearHide()
    hideTimer.current = setTimeout(() => setPopup(null), 150)
  }, [clearHide])

  const showSpot = useCallback(
    (spot: MapSpot, e: React.MouseEvent) => {
      clearHide()
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      setPopup({ spot, x: e.clientX - rect.left, y: e.clientY - rect.top })
    },
    [clearHide],
  )

  const visitedISO = new Set(spots.map((s) => COUNTRY_TO_ISO[s.country]).filter(Boolean))

  return (
    <div
      ref={containerRef}
      className="relative h-[90vh] min-h-[600px] w-full rounded-[1.75rem] overflow-hidden"
      style={{ background: '#f5efe6' }}
    >
      <ComposableMap
        projection="geoNaturalEarth1"
        style={{ width: '100%', height: '100%' }}
        projectionConfig={{ scale: 165, center: [14, 10] }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }: { geographies: GeoFeature[] }) =>
            geographies.map((geo: GeoFeature) => {
              const isVisited = visitedISO.has(String(geo.id))
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isVisited ? '#1a2e1a' : '#dcc9b2'}
                  stroke="rgba(255,255,255,0.7)"
                  strokeWidth={0.4}
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none', fill: isVisited ? '#2a3f2a' : '#c8b49a' },
                    pressed: { outline: 'none' },
                  }}
                />
              )
            })
          }
        </Geographies>

        {spots.map((spot) => (
          <Marker key={spot.id} coordinates={[spot.lng, spot.lat]}>
            <g
              role="button"
              aria-label={spot.title}
              onMouseEnter={(e) => showSpot(spot, e as unknown as React.MouseEvent)}
              onMouseLeave={scheduleHide}
              onClick={(e) => showSpot(spot, e as unknown as React.MouseEvent)}
              style={{ cursor: 'pointer' }}
            >
              <defs>
                <clipPath id={`clip-${spot.id}`}>
                  <circle cx="0" cy="-22" r="12" />
                </clipPath>
              </defs>
              {/* Pin tip */}
              <path d="M0 0 L-6 -12 L6 -12 Z" fill="#1a2e1a" />
              {/* Circle */}
              <circle cx="0" cy="-22" r="14" fill="#1a2e1a" />
              {/* Photo */}
              <image
                href={spot.thumbUrl}
                x="-12"
                y="-34"
                width="24"
                height="24"
                clipPath={`url(#clip-${spot.id})`}
                preserveAspectRatio="xMidYMid slice"
              />
              {/* White ring */}
              <circle cx="0" cy="-22" r="14" fill="none" stroke="white" strokeWidth="1.5" />
            </g>
          </Marker>
        ))}
      </ComposableMap>

      {popup && (
        <PopupCard
          spot={popup.spot}
          x={popup.x}
          y={popup.y}
          containerWidth={containerRef.current?.clientWidth ?? 800}
          onEnter={clearHide}
          onLeave={scheduleHide}
        />
      )}
    </div>
  )
}
