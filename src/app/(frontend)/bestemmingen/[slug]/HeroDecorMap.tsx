'use client'

import dynamic from 'next/dynamic'
import { DecorMapGate } from '@/components/DecorMapGate'

/**
 * De decoratieve kaart achter de hero.
 *
 * Staat apart omdat `ssr: false` alleen in een client component mag, en
 * DestinationHeroClient is er ondanks zijn naam geen. Hier gebeuren twee
 * dingen die de bestemmingspagina op mobiel merkbaar lichter maken:
 *
 *  1. react-simple-maps en de TopoJSON zitten achter een dynamische import,
 *     dus ze staan niet in de eerste bundel van de pagina.
 *  2. DecorMapGate rendert ze alleen op een scherm waar je ze ziet, en pas
 *     wanneer de browser niets belangrijkers te doen heeft.
 */

const DestinationHeroMapBackground = dynamic(
  () => import('./DestinationHeroMapBackground').then((m) => m.DestinationHeroMapBackground),
  { ssr: false },
)

const WorldMapBackground = dynamic(
  () => import('./WorldMapBackground').then((m) => m.WorldMapBackground),
  { ssr: false },
)

export type HeroMapProps = {
  countryIds: string[]
  marker: [number, number]
  scale: number
  center: [number, number]
  fitToCountry?: boolean
}

export function HeroDecorMap({ mapProps }: { mapProps: HeroMapProps | null }) {
  return (
    <DecorMapGate>
      {mapProps ? <DestinationHeroMapBackground {...mapProps} /> : <WorldMapBackground />}
    </DecorMapGate>
  )
}
