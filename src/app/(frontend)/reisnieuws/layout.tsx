import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Travel Radar | Meet the Locals',
  description:
    'Reisnieuws, trending bestemmingen en nieuwe ontdekkingen. De radar voor alles wat beweegt in de reiswereld, gefilterd door een fotograaf met een oog voor het bijzondere.',
  alternates: {
    canonical: '/reisnieuws',
  },
}

export default function ReisnieuwsLayout({ children }: { children: React.ReactNode }) {
  return children
}
