'use client'

import { ComposableMap, Geographies, Geography, type GeoFeature } from 'react-simple-maps'

const GEO_URL = '/countries-110m.json'

function isAntarcticGeo(geo: GeoFeature): boolean {
  const properties = geo.properties as { name?: string } | undefined
  return String(geo.id).padStart(3, '0') === '010' || /antarctic/i.test(properties?.name ?? '')
}

/** Stille wereldkaart achter de werelddeelpillen op de homepage. */
export function ContinentMap() {
  return (
    <ComposableMap
      projection="geoNaturalEarth1"
      projectionConfig={{ scale: 155, center: [12, 8] }}
      style={{ width: '100%', height: '100%' }}
    >
      <Geographies geography={GEO_URL}>
        {({ geographies }: { geographies: GeoFeature[] }) =>
          geographies.map((geo) =>
            isAntarcticGeo(geo) ? null : (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#d8d3cb"
                stroke="rgba(250,248,244,0.78)"
                strokeWidth={0.35}
                style={{
                  default: { outline: 'none' },
                  hover: { outline: 'none' },
                  pressed: { outline: 'none' },
                }}
              />
            ),
          )
        }
      </Geographies>
    </ComposableMap>
  )
}
