import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog — Reisverhalen & Tips',
  description:
    'Persoonlijke reisverhalen, praktische budgettips en reisfotografie van bestemmingen wereldwijd. Van Zuidoost-Azië tot Zuid-Amerika.',
  openGraph: {
    title: 'Blog — Reisverhalen & Tips | Meet the Locals',
    description:
      'Persoonlijke reisverhalen, praktische budgettips en reisfotografie van bestemmingen wereldwijd.',
    images: [{ url: '/media/maleisie-7-scaled.jpg', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: '/blog',
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
