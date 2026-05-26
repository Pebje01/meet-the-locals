'use client'

import { ComposableMap, Geographies, Geography, Marker, type GeoFeature } from 'react-simple-maps'

const GEO_URL = '/countries-10m.json'

function normalizedId(geo: GeoFeature): string {
  return String(geo.id).padStart(3, '0')
}

/**
 * Versie A: de bestemmingskaart als volledige hero-achtergrond.
 * Alle landen worden subtiel getoond (zoals WorldMapBackground),
 * ingezoomd op de regio van de bestemming. Het bestemmingsland
 * licht iets meer op.
 */
export function DestinationHeroMapBackground({
  countryIds,
  marker,
  scale,
  center,
}: {
  countryIds: string[]
  marker: [number, number]
  scale: number
  center: [number, number]
}) {
  return (
    <div className="absolute inset-x-0 top-0 -bottom-20 md:-bottom-24 lg:-bottom-32 pointer-events-none select-none z-[1] overflow-hidden opacity-80">
      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{ scale: scale * 5, center }}
        style={{ width: '100%', height: '100%' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }: { geographies: GeoFeature[] }) =>
            geographies.map((geo) => {
              const isHighlighted = countryIds.includes(normalizedId(geo))
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: {
                      fill: isHighlighted ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
                      stroke: isHighlighted ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.08)',
                      strokeWidth: isHighlighted ? 0.6 : 0.25,
                      outline: 'none',
                    },
                    hover:   { outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                />
              )
            })
          }
        </Geographies>

        <Marker coordinates={marker}>
          <g>
            <circle r={18} fill="none" stroke="rgba(255,255,255,0.25)" strokeDasharray="3 3" strokeWidth={1} />
            <circle r={4} fill="#c87952" />
          </g>
        </Marker>
      </ComposableMap>
    </div>
  )
}
