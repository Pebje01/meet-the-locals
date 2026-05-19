'use client'

import { ComposableMap, Geographies, Geography, Marker, type GeoFeature } from 'react-simple-maps'

const GEO_URL = '/countries-110m.json'

function normalizedId(geo: GeoFeature): string {
  return String(geo.id).padStart(3, '0')
}

export function DestinationOverviewMap({
  countryIds,
  marker,
  label,
  scale,
  center,
}: {
  countryIds: string[]
  marker: [number, number]
  label: string
  scale: number
  center: [number, number]
}) {
  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-forest-dark">
      <div className="absolute inset-0 opacity-90">
        <ComposableMap
          projection="geoNaturalEarth1"
          projectionConfig={{ scale, center }}
          style={{ width: '100%', height: '100%' }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: GeoFeature[] }) =>
              geographies.map((geo) => {
                const isActive = countryIds.includes(normalizedId(geo))

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isActive ? '#526f52' : '#142514'}
                    opacity={isActive ? 1 : 0.35}
                    stroke={isActive ? '#789178' : '#0a130a'}
                    strokeWidth={0.45}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                )
              })
            }
          </Geographies>

          <Marker coordinates={marker}>
            <g>
              <circle r={22} fill="none" stroke="#f5f2eb" strokeDasharray="4 4" strokeWidth={1.2} />
              <circle r={5} fill="#c87952" />
            </g>
          </Marker>
        </ComposableMap>
      </div>

      <div className="absolute inset-x-8 bottom-8">
        <p className="text-right font-serif text-2xl uppercase tracking-[0.08em] text-cream/85">
          {label}
        </p>
      </div>
    </div>
  )
}
