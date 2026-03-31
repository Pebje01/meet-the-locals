import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — Meet the Locals',
  description:
    'Heb je een vraag, samenwerking in gedachten of wil je gewoon even hallo zeggen? Stuur me een bericht — ik reageer altijd.',
  openGraph: {
    title: 'Contact — Meet the Locals',
    description:
      'Heb je een vraag of samenwerking in gedachten? Stuur me een bericht — ik reageer altijd.',
    images: [{ url: '/media/portretje.png', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: '/contact',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
