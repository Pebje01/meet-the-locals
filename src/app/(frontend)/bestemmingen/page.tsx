import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Bestemmingen — Reisgidsen & Inspiratie',
  description:
    'Ontdek alle bestemmingen die ik heb bezocht: van Zuidoost-Azië tot Zuid-Amerika. Eerlijke reisgidsen, lokale tips en verhalen van de mensen die ik onderweg ontmoette.',
  openGraph: {
    title: 'Bestemmingen — Reisgidsen & Inspiratie | Meet the Locals',
    description:
      'Ontdek alle bestemmingen die ik heb bezocht: van Zuidoost-Azië tot Zuid-Amerika. Eerlijke reisgidsen en lokale tips.',
    images: [{ url: '/media/maleisie-7-scaled.webp', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: '/bestemmingen',
  },
}

export default function DestinatiesPage() {
  return (
    <main className="min-h-screen px-6 py-24 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold">Bestemmingen</h1>
      <p className="mt-4 text-gray-600">Alle bestemmingen die ik heb bezocht.</p>
    </main>
  )
}
