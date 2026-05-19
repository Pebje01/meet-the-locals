import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reistips voor echte trips | Meet the Locals',
  description:
    'Reistips voor normale mensen die ook maar proberen iets van de wereld te zien, tussen werk, afspraken en andere verplichtingen door.',
  openGraph: {
    title: 'Reistips voor echte trips | Meet the Locals',
    description:
      'Voor normale mensen die iets van de wereld willen zien, ook met werk, afspraken en verplichtingen.',
    images: [{ url: '/media/maleisie-7-scaled.webp', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: '/blog',
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
