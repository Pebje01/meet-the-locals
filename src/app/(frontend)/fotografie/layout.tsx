import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fotografie | Galerijen, Artikelen & Gear',
  description:
    'Reisfotografie van over de hele wereld: galerijen per bestemming, artikelen over compositie en licht, en eerlijke reviews van camera\'s en accessoires.',
  openGraph: {
    title: 'Fotografie: Galerijen, Artikelen & Gear | Meet the Locals',
    description:
      'Reisfotografie van over de hele wereld: galerijen per bestemming, artikelen over compositie en licht, en gear reviews.',
    images: [{ url: '/media/DSC_3088-scaled.webp', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: '/fotografie',
  },
}

export default function FotografieLayout({ children }: { children: React.ReactNode }) {
  return children
}
