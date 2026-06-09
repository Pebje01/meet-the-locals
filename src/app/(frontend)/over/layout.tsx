import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Over mij',
  description:
    'Leer Daley Jansen kennen: fotograaf, designer en foodie achter Meet the Locals. Over reizen, fotografie, lokale adressen en plekken met een verhaal.',
  openGraph: {
    title: 'Over mij | Meet the Locals',
    description:
      'Leer Daley Jansen kennen: fotograaf, designer en foodie achter Meet the Locals.',
    images: [{ url: '/media/about-hero-img-1.webp', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: '/over',
  },
}

export default function OverLayout({ children }: { children: React.ReactNode }) {
  return children
}
