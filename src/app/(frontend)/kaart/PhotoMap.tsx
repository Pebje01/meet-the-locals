'use client'

import { useEffect, useRef, useState } from 'react'
import Supercluster from 'supercluster'
import type {
  LayerGroup as LeafletLayerGroup,
  Map as LeafletMap,
  Marker as LeafletMarker,
  Popup as LeafletPopup,
} from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { SpotGrid } from './SpotGrid'

export type MapSpot = {
  id: number
  slug: string | null
  title: string
  country: string
  lat: number
  lng: number
  story: string | null
  thumbUrl: string
  photoUrl: string
  alt: string
  camera: string | null
  lens: string | null
  aperture: string | null
  shutterSpeed: string | null
  iso: string | null
  focalLength: string | null
  postSlug: string | null
}

const MAP_COUNTRY_COLOR = '#a8be98'
const COUNTRY_LABEL_MIN_ZOOM = 4
const US_STATE_BOUNDARY_MIN_ZOOM = 4
const US_STATE_LABEL_MIN_ZOOM = 5

type GeoFeatureCollection = {
  type: 'FeatureCollection'
  features: Array<{
    id?: string | number
    properties?: Record<string, unknown>
  }>
}

type MapLabel = {
  name: string
  lat: number
  lng: number
}

const US_STATE_LABELS: MapLabel[] = [
  { name: 'Alabama', lat: 32.8067, lng: -86.7911 },
  { name: 'Alaska', lat: 61.3707, lng: -152.4044 },
  { name: 'Arizona', lat: 33.7298, lng: -111.4312 },
  { name: 'Arkansas', lat: 34.9697, lng: -92.3731 },
  { name: 'California', lat: 36.1162, lng: -119.6816 },
  { name: 'Colorado', lat: 39.0598, lng: -105.3111 },
  { name: 'Connecticut', lat: 41.5978, lng: -72.7554 },
  { name: 'Delaware', lat: 39.3185, lng: -75.5071 },
  { name: 'Florida', lat: 27.7663, lng: -81.6868 },
  { name: 'Georgia', lat: 33.0406, lng: -83.6431 },
  { name: 'Hawaii', lat: 21.0943, lng: -157.4983 },
  { name: 'Idaho', lat: 44.2405, lng: -114.4788 },
  { name: 'Illinois', lat: 40.3495, lng: -88.9861 },
  { name: 'Indiana', lat: 39.8494, lng: -86.2583 },
  { name: 'Iowa', lat: 42.0115, lng: -93.2105 },
  { name: 'Kansas', lat: 38.5266, lng: -96.7265 },
  { name: 'Kentucky', lat: 37.6681, lng: -84.6701 },
  { name: 'Louisiana', lat: 31.1695, lng: -91.8678 },
  { name: 'Maine', lat: 44.6939, lng: -69.3819 },
  { name: 'Maryland', lat: 39.0639, lng: -76.8021 },
  { name: 'Massachusetts', lat: 42.2302, lng: -71.5301 },
  { name: 'Michigan', lat: 43.3266, lng: -84.5361 },
  { name: 'Minnesota', lat: 45.6945, lng: -93.9002 },
  { name: 'Mississippi', lat: 32.7416, lng: -89.6787 },
  { name: 'Missouri', lat: 38.4561, lng: -92.2884 },
  { name: 'Montana', lat: 46.9219, lng: -110.4544 },
  { name: 'Nebraska', lat: 41.1254, lng: -98.2681 },
  { name: 'Nevada', lat: 38.3135, lng: -117.0554 },
  { name: 'New Hampshire', lat: 43.4525, lng: -71.5639 },
  { name: 'New Jersey', lat: 40.2989, lng: -74.521 },
  { name: 'New Mexico', lat: 34.8405, lng: -106.2485 },
  { name: 'New York', lat: 42.1657, lng: -74.9481 },
  { name: 'North Carolina', lat: 35.6301, lng: -79.8064 },
  { name: 'North Dakota', lat: 47.5289, lng: -99.784 },
  { name: 'Ohio', lat: 40.3888, lng: -82.7649 },
  { name: 'Oklahoma', lat: 35.5653, lng: -96.9289 },
  { name: 'Oregon', lat: 44.572, lng: -122.0709 },
  { name: 'Pennsylvania', lat: 40.5908, lng: -77.2098 },
  { name: 'Rhode Island', lat: 41.6809, lng: -71.5118 },
  { name: 'South Carolina', lat: 33.8569, lng: -80.945 },
  { name: 'South Dakota', lat: 44.2998, lng: -99.4388 },
  { name: 'Tennessee', lat: 35.7478, lng: -86.6923 },
  { name: 'Texas', lat: 31.0545, lng: -97.5635 },
  { name: 'Utah', lat: 40.15, lng: -111.8624 },
  { name: 'Vermont', lat: 44.0459, lng: -72.7107 },
  { name: 'Virginia', lat: 37.7693, lng: -78.17 },
  { name: 'Washington', lat: 47.4009, lng: -121.4905 },
  { name: 'West Virginia', lat: 38.4912, lng: -80.9545 },
  { name: 'Wisconsin', lat: 44.2685, lng: -89.6165 },
  { name: 'Wyoming', lat: 42.756, lng: -107.3025 },
]

type VisitedPlace = {
  title: string
  detail: string
  lat: number
  lng: number
  photoUrl?: string
}

const VISITED_PLACES: VisitedPlace[] = [
  // Europa
  { title: 'Antwerpen', detail: 'België', lat: 51.2194, lng: 4.4025 },
  { title: 'Parijs', detail: 'Frankrijk', lat: 48.8566, lng: 2.3522 },
  { title: 'Hunsrück', detail: 'Duitsland', lat: 49.9833, lng: 7.3333 },
  { title: 'Esslingen am Neckar', detail: 'Duitsland', lat: 48.7395, lng: 9.3059 },
  { title: 'Emilia-Romagna', detail: 'Italië', lat: 44.2175, lng: 11.7703 },
  { title: 'Italië roadtrip', detail: 'Marche, Calabria, Toscane', lat: 41.8719, lng: 15.2 },
  { title: 'Como & Lombardia', detail: 'Italië', lat: 45.808, lng: 9.0851 },
  { title: 'Puglia', detail: 'Italië', lat: 40.7928, lng: 17.1011 },
  { title: 'Marrakesh', detail: 'Marokko', lat: 31.6295, lng: -7.9811 },
  { title: 'Bergen & Fjorden', detail: 'Noorwegen', lat: 60.3913, lng: 5.3221 },
  { title: 'Lissabon', detail: 'Portugal', lat: 38.7169, lng: -9.1399 },
  { title: 'Sevilla', detail: 'Spanje', lat: 37.3891, lng: -5.9845 },
  { title: 'Stockholm', detail: 'Zweden', lat: 59.3293, lng: 18.0686 },
  { title: 'Istanbul', detail: 'Turkije', lat: 41.0082, lng: 28.9784 },
  // Azië
  { title: 'Bangkok', detail: 'Thailand', lat: 13.7563, lng: 100.5018 },
  { title: 'Vietnam', detail: 'Land bezocht', lat: 16.1667, lng: 107.8333 },
  { title: 'Japan', detail: 'Land bezocht', lat: 36.2048, lng: 138.2529 },
  { title: 'Singapore', detail: 'Stadsstaat', lat: 1.3521, lng: 103.8198 },
  { title: 'Maleisië', detail: 'Land bezocht', lat: 4.2105, lng: 101.9758 },
  { title: 'Langkawi', detail: 'Maleisië', lat: 6.35, lng: 99.8 },
  { title: 'Java', detail: 'Indonesië', lat: -7.6145, lng: 110.7122 },
  { title: 'Bali', detail: 'Indonesië', lat: -8.3405, lng: 115.092 },
  { title: 'Lombok', detail: 'Indonesië', lat: -8.65, lng: 116.3249 },
  // Amerika
  { title: 'Westkust roadtrip', detail: 'Verenigde Staten', lat: 37.7749, lng: -119.4194 },
  { title: 'Route 66', detail: 'Verenigde Staten', lat: 35.0844, lng: -106.6504 },
  { title: 'New York', detail: 'Verenigde Staten', lat: 40.7128, lng: -74.006 },
  { title: 'Florida', detail: 'Verenigde Staten', lat: 27.6648, lng: -81.5158 },
  { title: 'Peru', detail: 'Land bezocht', lat: -9.19, lng: -75.0152 },
]

// Split polygon rings that jump >180° in longitude (antimeridian crossers like Russia, Fiji, Antarctica)
// Leaflet draws a straight line across the canvas for those jumps, causing visible stripes.
function splitRingAtJumps(ring: number[][]): number[][][] {
  const parts: number[][][] = [[ring[0]]]
  for (let i = 1; i < ring.length; i++) {
    if (Math.abs(ring[i][0] - ring[i - 1][0]) > 180) {
      parts.push([ring[i]])
    } else {
      parts[parts.length - 1].push(ring[i])
    }
  }
  return parts
    .filter((r) => r.length >= 3)
    .map((r) => (r[r.length - 1][0] === r[0][0] && r[r.length - 1][1] === r[0][1] ? r : [...r, r[0]]))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fixAntimeridian(geoData: any): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { ...geoData, features: geoData.features.map((f: any) => {
    const geom = f.geometry
    if (geom.type === 'Polygon') {
      const rings = geom.coordinates.flatMap(splitRingAtJumps)
      if (rings.length === geom.coordinates.length) return f
      return { ...f, geometry: { type: 'MultiPolygon', coordinates: rings.map((r: number[][]) => [r]) } }
    }
    if (geom.type === 'MultiPolygon') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const polys = geom.coordinates.flatMap((poly: any) =>
        splitRingAtJumps(poly[0]).map((r: number[][]) => [r]),
      )
      return { ...f, geometry: { ...geom, coordinates: polys } }
    }
    return f
  })}
}

// Cache GeoJSON on window so it survives Fast Refresh cycles in dev
function fetchGeoData(): Promise<unknown> {
  if (typeof window === 'undefined') return Promise.resolve(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  if (!w.__mtlGeoPromise) {
    w.__mtlGeoPromise = fetch('/countries.geojson').then((r) => r.json())
  }
  return w.__mtlGeoPromise as Promise<unknown>
}

function fetchUsStateGeoData(): Promise<unknown> {
  if (typeof window === 'undefined') return Promise.resolve(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  if (!w.__mtlUsStateGeoPromise) {
    w.__mtlUsStateGeoPromise = fetch('/us-states.geojson').then((r) => r.json())
  }
  return w.__mtlUsStateGeoPromise as Promise<unknown>
}

const ICON_PIN =
  '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11z" fill="currentColor"/><circle cx="12" cy="10" r="2.6" fill="#fff"/></svg>'
const ICON_CAMERA =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 8.5a2 2 0 0 1 2-2H7L8.5 4h7L17 6.5h1.5a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-8z"/><circle cx="12" cy="12" r="3.4"/></svg>'
const ICON_ARROW =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M7 17 17 7M9 7h8v8"/></svg>'

type PointProps = { spotId: number; country: string }
type ClusterProps = { countries: Record<string, number> }

function makeEl(tag: string, className?: string): HTMLElement {
  const node = document.createElement(tag)
  if (className) node.className = className
  return node
}

function iconSpan(svg: string): HTMLElement {
  const span = makeEl('span')
  span.innerHTML = svg
  return span
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildSpotMarker(spot: MapSpot): HTMLElement {
  const pin = makeEl('div', 'mtl-pin')
  pin.setAttribute('role', 'button')
  pin.setAttribute('aria-label', spot.title)
  pin.title = spot.title

  const photo = makeEl('div', 'mtl-pin__photo')
  const img = document.createElement('img')
  img.src = spot.thumbUrl
  img.alt = spot.alt
  img.loading = 'lazy'
  img.decoding = 'async'
  photo.appendChild(img)
  pin.appendChild(photo)
  return pin
}

function buildVisitedMarker(place: VisitedPlace): HTMLElement {
  const pin = makeEl('div', 'mtl-pin mtl-visited-photo-pin')
  pin.setAttribute('role', 'button')
  pin.setAttribute('aria-label', `Bezocht: ${place.title}`)
  pin.title = `${place.title} - ${place.detail}`

  const photo = makeEl('div', 'mtl-pin__photo')
  if (place.photoUrl) {
    const img = document.createElement('img')
    img.src = place.photoUrl
    img.alt = place.title
    img.loading = 'lazy'
    img.decoding = 'async'
    photo.appendChild(img)
  } else {
    const placeholder = makeEl('span', 'mtl-visited-photo-pin__placeholder')
    placeholder.appendChild(iconSpan(ICON_CAMERA))
    photo.appendChild(placeholder)
  }

  pin.appendChild(photo)
  return pin
}

function buildClusterMarker(count: number, countries: Record<string, number>): HTMLElement {
  const size = count < 12 ? 'is-sm' : count < 45 ? 'is-md' : 'is-lg'
  const node = makeEl('div', `mtl-cluster ${size}`)
  node.setAttribute('role', 'button')
  node.setAttribute('aria-label', `${count} fotospots, klik om in te zoomen`)

  const countEl = makeEl('span', 'mtl-cluster__count')
  countEl.textContent = String(count)
  node.appendChild(countEl)

  const top = Object.entries(countries).sort((a, b) => b[1] - a[1])[0]
  if (top) {
    const label = makeEl('span', 'mtl-cluster__label')
    label.textContent = top[0]
    node.appendChild(label)
  }
  return node
}

function buildCard(spot: MapSpot): HTMLElement {
  const card = makeEl('div', 'mtl-card')

  const media = makeEl('div', 'mtl-card__media')
  const img = document.createElement('img')
  img.src = spot.photoUrl
  img.alt = spot.alt
  media.appendChild(img)

  if (spot.country) {
    const country = makeEl('span', 'mtl-card__country')
    country.appendChild(iconSpan(ICON_PIN))
    const label = makeEl('span')
    label.textContent = spot.country
    country.appendChild(label)
    media.appendChild(country)
  }

  const chips: string[] = []
  if (spot.aperture) chips.push(spot.aperture)
  if (spot.shutterSpeed) chips.push(spot.shutterSpeed)
  if (spot.iso) chips.push(`ISO ${spot.iso}`)
  if (spot.focalLength) chips.push(spot.focalLength)

  const gearText = [spot.camera, spot.lens].filter(Boolean).join('  |  ')
  if (chips.length > 0 || gearText) {
    const meta = makeEl('div', 'mtl-card__photo-meta')
    for (const value of chips) {
      const chip = makeEl('span', 'mtl-card__chip')
      chip.textContent = value
      meta.appendChild(chip)
    }
    if (gearText) {
      const gear = makeEl('span', 'mtl-card__gear-chip')
      gear.appendChild(iconSpan(ICON_CAMERA))
      const label = makeEl('span')
      label.textContent = gearText
      gear.appendChild(label)
      meta.appendChild(gear)
    }
    media.appendChild(meta)
  }
  card.appendChild(media)

  const body = makeEl('div', 'mtl-card__body')

  const title = makeEl('h3', 'mtl-card__title')
  title.textContent = spot.title
  body.appendChild(title)

  if (spot.story) {
    const story = makeEl('p', 'mtl-card__story')
    story.textContent = spot.story
    body.appendChild(story)
  }

  if (spot.postSlug) {
    const link = document.createElement('a')
    link.className = 'mtl-card__link'
    link.href = `/blog/${spot.postSlug}`
    const label = makeEl('span')
    label.textContent = 'Lees het verhaal'
    link.appendChild(label)
    link.appendChild(iconSpan(ICON_ARROW))
    body.appendChild(link)
  }

  card.appendChild(body)
  return card
}

export function PhotoMap({ spots }: { spots: MapSpot[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let cancelled = false
    let mapInstance: LeafletMap | undefined
    let markers: Record<string, LeafletMarker> = {}
    let visitedMarkers: LeafletMarker[] = []
    let countryLabelLayer: LeafletLayerGroup | undefined
    let stateBoundaryLayer: LeafletLayerGroup | undefined
    let stateLabelLayer: LeafletLayerGroup | undefined
    let hideTimer: ReturnType<typeof setTimeout> | undefined
    let resizeObserver: ResizeObserver | undefined
    let popupEl: LeafletPopup | undefined

    const init = async () => {
      const L = (await import('leaflet')).default
      if (cancelled || !containerRef.current) return

      const [rawGeo, rawUsStateGeo] = await Promise.all([
        fetchGeoData() as Promise<GeoFeatureCollection>,
        fetchUsStateGeoData() as Promise<GeoFeatureCollection>,
      ])
      if (cancelled) return

      const geoData = {
        type: 'FeatureCollection' as const,
        features: rawGeo.features.map((f) => ({
          ...f,
          properties: { ...(f.properties ?? {}) },
        })),
      }

      mapInstance = L.map(container, {
        center: [24, 14],
        zoom: 2,
        minZoom: 2,
        maxZoom: 16,
        zoomControl: false,
        attributionControl: false,
        preferCanvas: true,
        maxBounds: [[-90, -200], [90, 200]],
        maxBoundsViscosity: 0.6,
      })

      const countryLayer = L.geoJSON(fixAntimeridian(geoData) as Parameters<typeof L.geoJSON>[0], {
        style: (feature) => ({
          fillColor: MAP_COUNTRY_COLOR,
          fillOpacity: 1,
          color: 'rgba(255,255,255,0.5)',
          weight: 0.5,
        }),
      }).addTo(mapInstance)

      stateBoundaryLayer = L.geoJSON(rawUsStateGeo as Parameters<typeof L.geoJSON>[0], {
        interactive: false,
        style: {
          className: 'mtl-state-boundary',
          renderer: L.svg({ padding: 0.5 }),
          fillOpacity: 0,
          color: 'rgba(255,255,255,0.62)',
          opacity: 1,
          weight: 0.55,
        },
      })

      const updateStateBoundaries = () => {
        if (!stateBoundaryLayer || !mapInstance) return
        const shouldShowBoundaries = mapInstance.getZoom() >= US_STATE_BOUNDARY_MIN_ZOOM
        const boundariesVisible = mapInstance.hasLayer(stateBoundaryLayer)

        if (shouldShowBoundaries && !boundariesVisible) {
          stateBoundaryLayer.addTo(mapInstance)
        } else if (!shouldShowBoundaries && boundariesVisible) {
          stateBoundaryLayer.remove()
        }
      }

      const countryLabelMarkers: LeafletMarker[] = []
      countryLayer.eachLayer((layer) => {
        const countryLayerFeature = (layer as { feature?: { properties?: { name?: string } } }).feature
        const name = countryLayerFeature?.properties?.name
        if (!name || /antarctic/i.test(name)) return

        const bounds = (layer as { getBounds?: () => { isValid: () => boolean; getCenter: () => { lat: number; lng: number } } }).getBounds?.()
        if (!bounds?.isValid()) return

        countryLabelMarkers.push(
          L.marker(bounds.getCenter(), {
            icon: L.divIcon({
              html: `<span>${escapeHtml(name)}</span>`,
              className: 'mtl-country-label',
              iconSize: [0, 0],
              iconAnchor: [0, 0],
            }),
            interactive: false,
            keyboard: false,
            zIndexOffset: 20,
          }),
        )
      })
      countryLabelLayer = L.layerGroup(countryLabelMarkers)

      const updateCountryLabels = () => {
        if (!countryLabelLayer || !mapInstance) return
        const shouldShowLabels = mapInstance.getZoom() >= COUNTRY_LABEL_MIN_ZOOM
        const labelsVisible = mapInstance.hasLayer(countryLabelLayer)

        if (shouldShowLabels && !labelsVisible) {
          countryLabelLayer.addTo(mapInstance)
        } else if (!shouldShowLabels && labelsVisible) {
          countryLabelLayer.remove()
        }
      }

      L.control.zoom({ position: 'bottomright' }).addTo(mapInstance)

      const stateLabelMarkers = US_STATE_LABELS.map((state) =>
        L.marker([state.lat, state.lng], {
          icon: L.divIcon({
            html: `<span>${escapeHtml(state.name)}</span>`,
            className: 'mtl-state-label',
            iconSize: [0, 0],
            iconAnchor: [0, 0],
          }),
          interactive: false,
          keyboard: false,
          zIndexOffset: 25,
        }),
      )
      stateLabelLayer = L.layerGroup(stateLabelMarkers)

      const updateStateLabels = () => {
        if (!stateLabelLayer || !mapInstance) return
        const shouldShowLabels = mapInstance.getZoom() >= US_STATE_LABEL_MIN_ZOOM
        const labelsVisible = mapInstance.hasLayer(stateLabelLayer)

        if (shouldShowLabels && !labelsVisible) {
          stateLabelLayer.addTo(mapInstance)
        } else if (!shouldShowLabels && labelsVisible) {
          stateLabelLayer.remove()
        }
      }

      resizeObserver = new ResizeObserver(() => mapInstance!.invalidateSize())
      resizeObserver.observe(container)

      popupEl = L.popup({
        className: 'mtl-popup',
        closeButton: false,
        autoPan: false,
        offset: [0, -60],
      })

      visitedMarkers = VISITED_PLACES.map((place) => {
        const node = buildVisitedMarker(place)
        const icon = L.divIcon({
          html: '',
          className: 'mtl-lmarker mtl-visited-lmarker',
          iconSize: [50, 60],
          iconAnchor: [25, 60],
        })
        const marker = L.marker([place.lat, place.lng], { icon, zIndexOffset: 80 }).addTo(mapInstance!)
        const el = marker.getElement()
        if (el) {
          el.style.overflow = 'visible'
          el.appendChild(node)
        }
        return marker
      })

      const index = new Supercluster<PointProps, ClusterProps>({
        radius: 64,
        maxZoom: 15,
        map: (p) => ({ countries: { [p.country]: 1 } }),
        reduce: (acc, p) => {
          for (const name of Object.keys(p.countries)) {
            acc.countries[name] = (acc.countries[name] || 0) + p.countries[name]
          }
        },
      })
      index.load(
        spots.map(
          (s): Supercluster.PointFeature<PointProps> => ({
            type: 'Feature',
            properties: { spotId: s.id, country: s.country },
            geometry: { type: 'Point', coordinates: [s.lng, s.lat] },
          }),
        ),
      )
      const spotById = new Map(spots.map((s) => [s.id, s]))

      const clearHide = () => {
        if (hideTimer) {
          clearTimeout(hideTimer)
          hideTimer = undefined
        }
      }
      const scheduleHide = () => {
        clearHide()
        hideTimer = setTimeout(() => popupEl?.remove(), 150)
      }
      const showCard = (spot: MapSpot) => {
        clearHide()
        const card = buildCard(spot)
        card.addEventListener('mouseenter', clearHide)
        card.addEventListener('mouseleave', scheduleHide)
        popupEl!.setLatLng([spot.lat, spot.lng]).setContent(card).openOn(mapInstance!)
      }

      const updateMarkers = () => {
        const zoom = Math.round(mapInstance!.getZoom())
        const clusters = index.getClusters([-180, -85, 180, 85], zoom)
        const next: Record<string, LeafletMarker> = {}

        for (const feature of clusters) {
          const [lng, lat] = feature.geometry.coordinates
          const props = feature.properties

          if ('cluster' in props && props.cluster) {
            const id = `cluster-${props.cluster_id}-${props.point_count}`
            if (!markers[id]) {
              const node = buildClusterMarker(props.point_count, props.countries)
              node.addEventListener('click', (ev) => {
                ev.stopPropagation()
                const expansion = Math.min(index.getClusterExpansionZoom(props.cluster_id), 16)
                mapInstance!.flyTo([lat, lng], expansion, { animate: true, duration: 0.6 })
              })
              const clusterPx = props.point_count < 12 ? 46 : props.point_count < 45 ? 58 : 72
              const icon = L.divIcon({
                html: '',
                className: 'mtl-lmarker',
                iconSize: [clusterPx, clusterPx],
                iconAnchor: [clusterPx / 2, clusterPx / 2],
              })
              const marker = L.marker([lat, lng], { icon }).addTo(mapInstance!)
              const el = marker.getElement()
              if (el) {
                el.style.overflow = 'visible'
                el.appendChild(node)
              }
              markers[id] = marker
            }
            next[id] = markers[id]
          } else {
            const spot = spotById.get((props as PointProps).spotId)
            if (!spot) continue
            const id = `spot-${spot.id}`
            if (!markers[id]) {
              const node = buildSpotMarker(spot)
              node.addEventListener('mouseenter', () => showCard(spot))
              node.addEventListener('mouseleave', scheduleHide)
              node.addEventListener('click', (ev) => {
                ev.stopPropagation()
                showCard(spot)
              })
              const icon = L.divIcon({
                html: '',
                className: 'mtl-lmarker',
                iconSize: [50, 60],
                iconAnchor: [25, 60],
              })
              const marker = L.marker([lat, lng], { icon, zIndexOffset: 100 }).addTo(mapInstance!)
              const el = marker.getElement()
              if (el) {
                el.style.overflow = 'visible'
                el.appendChild(node)
              }
              markers[id] = marker
            }
            next[id] = markers[id]
          }
        }

        for (const [id, marker] of Object.entries(markers)) {
          if (!next[id]) marker.remove()
        }
        markers = next
      }

      mapInstance.on('moveend', updateMarkers)
      mapInstance.on('zoomend', updateMarkers)
      mapInstance.on('zoomend', updateCountryLabels)
      mapInstance.on('zoomend', updateStateBoundaries)
      mapInstance.on('zoomend', updateStateLabels)
      mapInstance.on('click', () => {
        clearHide()
        popupEl?.remove()
      })

      // Initial view
      const mapPoints = [
        ...spots.map((s) => ({ lat: s.lat, lng: s.lng })),
        ...VISITED_PLACES.map((place) => ({ lat: place.lat, lng: place.lng })),
      ]
      if (mapPoints.length === 1) {
        mapInstance.setView([mapPoints[0].lat, mapPoints[0].lng], 8)
      } else {
        let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity
        for (const point of mapPoints) {
          minLng = Math.min(minLng, point.lng)
          minLat = Math.min(minLat, point.lat)
          maxLng = Math.max(maxLng, point.lng)
          maxLat = Math.max(maxLat, point.lat)
        }
        const lngBuffer = Math.max((maxLng - minLng) * 0.16, 4)
        const latBuffer = Math.max((maxLat - minLat) * 0.16, 4)
        const fitPadding = container.clientWidth < 640 ? 16 : 52
        mapInstance.fitBounds(
          [
            [minLat - latBuffer, minLng - lngBuffer],
            [maxLat + latBuffer, maxLng + lngBuffer],
          ],
          { padding: [fitPadding, fitPadding], maxZoom: 8, animate: false },
        )
      }

      updateMarkers()
      updateCountryLabels()
      updateStateBoundaries()
      updateStateLabels()
      setReady(true)

      const slug = new URLSearchParams(window.location.search).get('spot')
      if (slug) {
        const target = spots.find((s) => s.slug === slug)
        if (target) {
          mapInstance.flyTo([target.lat, target.lng], 11, { animate: true, duration: 0.9 })
          window.setTimeout(() => {
            if (!cancelled) showCard(target)
          }, 1000)
        }
      }
    }

    init().catch((err) => {
      if (!cancelled) {
        console.error('[PhotoMap] init failed:', err)
        setFailed(true)
      }
    })

    return () => {
      cancelled = true
      if (hideTimer) clearTimeout(hideTimer)
      resizeObserver?.disconnect()
      Object.values(markers).forEach((m) => m.remove())
      visitedMarkers.forEach((m) => m.remove())
      countryLabelLayer?.remove()
      stateBoundaryLayer?.remove()
      stateLabelLayer?.remove()
      mapInstance?.remove()
    }
  }, [spots])

  return (
    <>
      <div className={failed ? 'hidden' : 'relative'}>
        <div
          ref={containerRef}
          data-lenis-prevent
          className="mtl-map h-[90vh] min-h-[600px] w-full"
        />
        {!ready && (
          <div
            className="absolute inset-0 z-[1] flex items-center justify-center rounded-[1.75rem]"
            style={{ background: '#ede8e0' }}
          >
            <p className="text-sm text-text-muted">Kaart laden...</p>
          </div>
        )}
      </div>
      {failed && <SpotGrid spots={spots} />}
    </>
  )
}
