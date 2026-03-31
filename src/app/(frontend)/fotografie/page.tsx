import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fotografie — Galerijen, Artikelen & Gear',
  description:
    'Reisfotografie van over de hele wereld: galerijen per bestemming, artikelen over compositie en licht, en eerlijke reviews van camera\'s en accessoires.',
  openGraph: {
    title: 'Fotografie — Galerijen, Artikelen & Gear | Meet the Locals',
    description:
      'Reisfotografie van over de hele wereld: galerijen per bestemming, artikelen over compositie en licht, en gear reviews.',
    images: [{ url: '/media/DSC_3088-scaled.jpg', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: '/fotografie',
  },
}

export default function FotografiePage() {
  return (
    <main className="min-h-screen px-6 py-24 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold">Fotografie</h1>
      <p className="mt-4 text-gray-600">Artikelen, galerijen en gear.</p>
    </main>
  )
}
