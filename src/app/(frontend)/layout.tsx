import type { Metadata } from 'next'
import '../globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { TravelPath } from '@/components/TravelPath'

export const metadata: Metadata = {
  title: {
    default: 'Meet the Locals — Reisblog & Fotografie',
    template: '%s | Meet the Locals',
  },
  description: 'Persoonlijke reisblog met verhalen, tips en fotografie van bestemmingen wereldwijd.',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=El+Messiri:wght@400;500;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <TravelPath />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
