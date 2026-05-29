'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ComposableMap, Geographies, Geography, type GeoFeature } from 'react-simple-maps'

const GEO_URL = '/countries-50m.json'

type DestEntry = {
  slug: string
  name: string
  countryCode: string
}

function normalizedId(geo: GeoFeature): string {
  return String(geo.id).padStart(3, '0')
}

export function DestinationsWorldMap({ destinations }: { destinations: DestEntry[] }) {
  const router = useRouter()
  const [tooltip, setTooltip] = useState<{ name: string; x: number; y: number } | null>(null)

  const codeMap = new Map(destinations.map(d => [d.countryCode.padStart(3, '0'), d]))

  return (
    <div className="relative">
      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 rounded-xl bg-forest px-4 py-2 text-sm font-semibold text-cream shadow-lg"
          style={{ left: tooltip.x + 14, top: tooltip.y, transform: 'translateY(-120%)' }}
        >
          {tooltip.name}
        </div>
      )}

      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{ scale: 160, center: [10, 5] }}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }: { geographies: GeoFeature[] }) =>
            geographies.map((geo) => {
              const dest = codeMap.get(normalizedId(geo))
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => dest && router.push(`/bestemmingen/${dest.slug}`)}
                  onMouseEnter={(e: React.MouseEvent) =>
                    dest && setTooltip({ name: dest.name, x: e.clientX, y: e.clientY })
                  }
                  onMouseMove={(e: React.MouseEvent) =>
                    dest && setTooltip((t) => (t ? { ...t, x: e.clientX, y: e.clientY } : null))
                  }
                  onMouseLeave={() => setTooltip(null)}
                  style={{
                    default: {
                      fill: dest ? '#4a7c4a' : 'rgba(255,255,255,0.05)',
                      stroke: dest ? '#6a9f6a' : 'rgba(255,255,255,0.08)',
                      strokeWidth: 0.5,
                      outline: 'none',
                      cursor: dest ? 'pointer' : 'default',
                    },
                    hover: {
                      fill: dest ? '#c87952' : 'rgba(255,255,255,0.05)',
                      stroke: dest ? '#d4895f' : 'rgba(255,255,255,0.08)',
                      strokeWidth: 0.5,
                      outline: 'none',
                      cursor: dest ? 'pointer' : 'default',
                    },
                    pressed: {
                      fill: dest ? '#a8603c' : 'rgba(255,255,255,0.05)',
                      outline: 'none',
                    },
                  }}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  )
}
