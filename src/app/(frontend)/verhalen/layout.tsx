import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reisverhalen',
  description:
    'Persoonlijke reisverhalen van over de hele wereld. Geen oppervlakkige reisgidsen, maar echte ervaringen, ontmoetingen met locals en de plekken die je niet in elke gids vindt.',
  openGraph: {
    title: 'Reisverhalen | Meet the Locals',
    description:
      'Persoonlijke reisverhalen van over de hele wereld: echte ervaringen, ontmoetingen met locals en plekken die je niet in elke gids vindt.',
    images: [{ url: '/media/maleisie-5-scaled.webp', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: '/verhalen',
  },
}

export default function VerhalenLayout({ children }: { children: React.ReactNode }) {
  return children
}
