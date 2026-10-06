'use client'

import { useEffect, useMemo, useState } from 'react'
import { geoCentroid, geoDistance, geoNaturalEarth1 } from 'd3-geo'
import { feature } from 'topojson-client'
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson'
import type { GeometryCollection, Topology } from 'topojson-specification'
import { ComposableMap, Geographies, Geography, Graticule, Marker, type GeoFeature } from 'react-simple-maps'
import { COUNTRY_NAMES_NL } from '@/lib/countryNamesNl'

// 50m: de hero zoomt ver in, en op die schaal werd de 110m-kaart een
// verzameling hoekige vlakken waarin je geen kust meer herkende. Deze kaart
// laadt alleen op desktop en pas als de browser tijd heeft (DecorMapGate).
const GEO_URL = '/countries-50m.json'

// Tekenvlak in de verhouding van een brede hero. Met `slice` vult de kaart
// altijd het hele vlak, ook op schermen die breder of hoger zijn.
const WIDTH = 1440
const HEIGHT = 900

// Waar een land in beeld komt: rechts van de tekst, met wat lucht eromheen.
const FIT_BOX: [[number, number], [number, number]] = [
  [WIDTH * 0.5, HEIGHT * 0.16],
  [WIDTH * 0.94, HEIGHT * 0.84],
]

// Verder inzoomen dan dit heeft geen zin: de kustlijnen in de 50m-kaart
// worden dan weer hoekig. Een klein land (Singapore) krijgt zo zijn omgeving mee.
const MAX_FIT_SCALE = 5200

// Voor regio's en steden: de schaal uit het CMS, afgesteld op een kleiner tekenvlak.
const CMS_ZOOM = 7

// Eilanden of gebiedsdelen verder dan dit van de pin (in radialen, ongeveer
// 34 graden) tellen niet mee bij het passend maken. Anders zou Alaska de
// Verenigde Staten wegzoomen en Frans-Guyana Frankrijk.
const MAX_PART_DISTANCE = 0.6

// Landen kleiner dan dit (in vierkante pixels op de kaart) krijgen geen naam.
const MIN_LABEL_AREA = 2500

const CREAM = '245, 239, 232'
const ACCENT = '189, 106, 58'
// Zacht zand voor het land van de bestemming: oranje was te fel achter de tekst.
const SAND = '212, 190, 154'

type CountryTopology = Topology<{ countries: GeometryCollection }>
type CountryFeature = Feature<Polygon | MultiPolygon>

function normalizedId(id: string | number | undefined): string {
  return String(id ?? '').padStart(3, '0')
}

/** De delen van een land die bij de pin horen, als losse polygonen. */
function nearbyParts(country: CountryFeature, marker: [number, number]): CountryFeature[] {
  const polygons =
    country.geometry.type === 'MultiPolygon'
      ? country.geometry.coordinates.map((coordinates) => ({ type: 'Polygon' as const, coordinates }))
      : [country.geometry]
  const parts = polygons.map((geometry) => ({ type: 'Feature' as const, properties: {}, geometry }))
  const near = parts.filter((part) => geoDistance(geoCentroid(part), marker) <= MAX_PART_DISTANCE)
  return near.length > 0 ? near : parts
}

/** Lijnen elke 1, 2, 5 of 10 graden, zodat ze ongeveer 120 tot 300px uit elkaar liggen. */
function graticuleStep(projectionScale: number): [number, number] {
  const pxPerDegree = (projectionScale * Math.PI) / 180
  const step = [1, 2, 5, 10].find((s) => s * pxPerDegree >= 120) ?? 10
  return [step, step]
}

/**
 * De bestemmingskaart als achtergrond van de hero: landen met hun grenzen,
 * een gradennet, Nederlandse landnamen en een pin op de bestemming. Het land
 * van de bestemming licht zacht op in zandkleur, de pin is oranje.
 *
 * Bij een land zoomt de kaart zelf zo ver in dat het hele land rechts naast
 * de tekst past. Regio's en steden gebruiken de uitsnede uit het CMS.
 */
export function DestinationHeroMapBackground({
  countryIds,
  marker,
  scale,
  center,
  fitToCountry = false,
}: {
  countryIds: string[]
  marker: [number, number]
  scale: number
  center: [number, number]
  fitToCountry?: boolean
}) {
  const [topology, setTopology] = useState<CountryTopology | null>(null)

  useEffect(() => {
    let active = true
    fetch(GEO_URL)
      .then((res) => res.json())
      .then((data: CountryTopology) => {
        if (active) setTopology(data)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  const projection = useMemo(() => {
    const cmsProjection = () =>
      geoNaturalEarth1()
        .translate([WIDTH / 2, HEIGHT / 2])
        .scale(scale * CMS_ZOOM)
        .center(center)

    if (!fitToCountry || !topology) return cmsProjection()

    const countries = feature(topology, topology.objects.countries) as FeatureCollection<Polygon | MultiPolygon>
    const parts = countries.features
      .filter((country) => countryIds.includes(normalizedId(country.id)))
      .flatMap((country) => nearbyParts(country, marker))
    if (parts.length === 0) return cmsProjection()

    const target: FeatureCollection = { type: 'FeatureCollection', features: parts }
    const fitted = geoNaturalEarth1().fitExtent(FIT_BOX, target)

    if (fitted.scale() > MAX_FIT_SCALE) {
      // Te klein land: begrenzen, en het land weer midden in het vak zetten
      fitted.scale(MAX_FIT_SCALE)
      const projected = fitted(geoCentroid(target))
      if (projected) {
        const [tx, ty] = fitted.translate()
        const boxX = (FIT_BOX[0][0] + FIT_BOX[1][0]) / 2
        const boxY = (FIT_BOX[0][1] + FIT_BOX[1][1]) / 2
        fitted.translate([tx + boxX - projected[0], ty + boxY - projected[1]])
      }
    }
    return fitted
  }, [topology, fitToCountry, countryIds, marker, scale, center])

  // Pas tekenen als de kaartdata er is, anders verspringt de uitsnede
  if (!topology) return null

  return (
    <div className="pointer-events-none absolute inset-x-0 -bottom-20 top-16 z-[1] select-none overflow-hidden md:-bottom-24 md:top-0 lg:-bottom-32">
      <ComposableMap
        projection={projection}
        width={WIDTH}
        height={HEIGHT}
        preserveAspectRatio="xMidYMid slice"
        style={{ width: '100%', height: '100%' }}
      >
        <Graticule
          step={graticuleStep(projection.scale())}
          stroke={`rgba(${CREAM}, 0.07)`}
          strokeWidth={0.6}
          strokeDasharray="2 6"
        />

        <Geographies geography={topology}>
          {({ geographies, path }) => (
            <>
              {geographies.map((geo) => {
                const isHighlighted = countryIds.includes(normalizedId(geo.id))
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: {
                        fill: isHighlighted ? `rgba(${SAND}, 0.1)` : `rgba(${CREAM}, 0.06)`,
                        stroke: isHighlighted ? `rgba(${SAND}, 0.38)` : `rgba(${CREAM}, 0.2)`,
                        strokeWidth: isHighlighted ? 0.9 : 0.6,
                        strokeLinejoin: 'round',
                        outline: 'none',
                      },
                      hover: { outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                )
              })}

              {/* Landnamen, alleen voor landen die groot genoeg in beeld zijn */}
              {geographies.map((geo: GeoFeature) => {
                const name = COUNTRY_NAMES_NL[normalizedId(geo.id)]
                if (!name || path.area(geo) < MIN_LABEL_AREA) return null
                const [x, y] = path.centroid(geo)
                if (!Number.isFinite(x) || x < 40 || x > WIDTH - 40 || y < 40 || y > HEIGHT - 40) return null
                const isHighlighted = countryIds.includes(normalizedId(geo.id))
                return (
                  <text
                    key={`label-${geo.rsmKey}`}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: isHighlighted ? 15 : 12,
                      fontWeight: 600,
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      fill: isHighlighted ? `rgba(${SAND}, 0.5)` : `rgba(${CREAM}, 0.28)`,
                    }}
                  >
                    {name}
                  </text>
                )
              })}
            </>
          )}
        </Geographies>

        <Marker coordinates={marker}>
          <g>
            <circle r={34} fill={`rgba(${ACCENT}, 0.08)`} />
            <circle r={22} fill="none" stroke={`rgba(${CREAM}, 0.45)`} strokeDasharray="4 3" strokeWidth={1.2} />
            <circle r={6} fill={`rgb(${ACCENT})`} stroke={`rgba(${CREAM}, 0.9)`} strokeWidth={1.5} />
          </g>
        </Marker>
      </ComposableMap>
    </div>
  )
}
