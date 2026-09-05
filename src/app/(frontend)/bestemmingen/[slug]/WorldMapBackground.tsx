'use client'

import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

// 110m in plaats van 50m: 105 kB tegenover 739 kB. Deze kaart staat op
// hooguit 12 procent dekking achter een foto, dus het detailverschil is niet
// te zien maar de winst op een telefoon wel.
const GEO_URL = '/countries-110m.json'

export function WorldMapBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-[1] flex items-center justify-center overflow-hidden">
      <ComposableMap
        projection="geoNaturalEarth1"
        projectionConfig={{ scale: 165, center: [10, 5] }}
        style={{ width: '100%', height: '100%' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: { fill: 'rgba(255,255,255,0.06)', stroke: 'rgba(255,255,255,0.10)', strokeWidth: 0.4, outline: 'none' },
                  hover:   { fill: 'rgba(255,255,255,0.06)', stroke: 'rgba(255,255,255,0.10)', strokeWidth: 0.4, outline: 'none' },
                  pressed: { fill: 'rgba(255,255,255,0.06)', stroke: 'rgba(255,255,255,0.10)', strokeWidth: 0.4, outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  )
}
