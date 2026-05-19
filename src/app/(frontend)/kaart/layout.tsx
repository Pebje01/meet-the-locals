import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Interactieve Reiskaart | Meet the Locals',
  description:
    'Bekijk alle bestemmingen op een interactieve kaart. Van Zuidoost-Azië tot Zuid-Amerika, zoom in en ontdek de plekken die ik heb bezocht en de verhalen die erbij horen.',
  openGraph: {
    title: 'Interactieve Reiskaart | Meet the Locals',
    description:
      'Bekijk alle bestemmingen op een interactieve kaart. Zoom in en ontdek de plekken die ik heb bezocht en de verhalen die erbij horen.',
    images: [{ url: '/media/1920x540.webp', width: 1600, height: 450 }],
  },
  alternates: {
    canonical: '/kaart',
  },
}

export default function KaartLayout({ children }: { children: React.ReactNode }) {
  return children
}
