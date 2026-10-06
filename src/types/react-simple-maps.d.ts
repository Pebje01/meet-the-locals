declare module 'react-simple-maps' {
  import type { ReactNode, SVGProps, MouseEvent } from 'react'

  export interface ComposableMapProps {
    projection?: string | ((coordinates: [number, number]) => [number, number] | null)
    projectionConfig?: Record<string, unknown>
    width?: number
    height?: number
    style?: React.CSSProperties
    preserveAspectRatio?: string
    children?: ReactNode
  }
  export function ComposableMap(props: ComposableMapProps): JSX.Element

  export interface GeographiesProps {
    geography: string | object
    children: (args: {
      geographies: GeoFeature[]
      /** d3 geoPath voor de huidige projectie: centroid, area, bounds */
      path: {
        centroid: (feature: GeoFeature) => [number, number]
        area: (feature: GeoFeature) => number
      }
    }) => ReactNode
  }
  export function Geographies(props: GeographiesProps): JSX.Element

  export interface GeoFeature {
    rsmKey: string
    id: string | number
    [key: string]: unknown
  }

  export interface GeographyProps extends SVGProps<SVGPathElement> {
    geography: GeoFeature
    style?: {
      default?: React.CSSProperties
      hover?: React.CSSProperties
      pressed?: React.CSSProperties
    }
  }
  export function Geography(props: GeographyProps): JSX.Element

  export interface MarkerProps {
    coordinates: [number, number]
    children?: ReactNode
  }
  export function Marker(props: MarkerProps): JSX.Element

  export interface GraticuleProps extends SVGProps<SVGPathElement> {
    step?: [number, number]
  }
  export function Graticule(props: GraticuleProps): JSX.Element
}
