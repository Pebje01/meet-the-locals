import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bestemmingen | Reisgidsen & Inspiratie',
  description:
    'Ontdek alle bestemmingen die ik heb bezocht: van Zuidoost-Azië tot Zuid-Amerika. Eerlijke reisgidsen, lokale tips en verhalen van de mensen die ik onderweg ontmoette.',
  openGraph: {
    title: 'Bestemmingen: Reisgidsen & Inspiratie | Meet the Locals',
    description:
      'Ontdek alle bestemmingen die ik heb bezocht: van Zuidoost-Azië tot Zuid-Amerika. Eerlijke reisgidsen en lokale tips.',
    images: [{ url: '/media/maleisie-7-scaled.webp', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: '/bestemmingen',
  },
}

export default function BestemmingenLayout({ children }: { children: React.ReactNode }) {
  return children
}
