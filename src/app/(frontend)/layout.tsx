import type { Metadata, Viewport } from 'next'
import '../globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { TravelPath } from '@/components/TravelPath'
import { SmoothScroll } from '@/components/SmoothScroll'
import { GlobalJsonLd } from '@/components/JsonLd'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://meetthelocals.nl'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Meet the Locals — Reisblog & Fotografie',
    template: '%s | Meet the Locals',
  },
  description:
    'Persoonlijke reisblog met reisverhalen, budgettips en professionele fotografie van bestemmingen wereldwijd. Ontdek lokale culturen door de ogen van locals.',
  keywords: [
    'reisblog',
    'reisfotografie',
    'reisverhalen',
    'reistips',
    'budgettips',
    'bestemmingen',
    'backpacken',
    'Zuidoost-Azië',
    'Zuid-Amerika',
    'meet the locals',
  ],
  authors: [{ name: 'Daley Jansen', url: `${SITE_URL}/over` }],
  creator: 'Daley Jansen',
  publisher: 'Meet the Locals',

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: SITE_URL,
    siteName: 'Meet the Locals',
    title: 'Meet the Locals — Reisblog & Fotografie',
    description:
      'Persoonlijke reisblog met reisverhalen, budgettips en professionele fotografie van bestemmingen wereldwijd.',
    images: [
      {
        url: '/media/Shirakawago-3.jpg',
        width: 1200,
        height: 630,
        alt: 'Meet the Locals — Reisblog & Fotografie',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Meet the Locals — Reisblog & Fotografie',
    description:
      'Persoonlijke reisblog met reisverhalen, budgettips en professionele fotografie van bestemmingen wereldwijd.',
    images: ['/media/Shirakawago-3.jpg'],
    creator: '@meetthelocals',
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Alternates
  alternates: {
    canonical: SITE_URL,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a2e1a',
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
        <link rel="stylesheet" href="https://use.typekit.net/pio7rwo.css" />
        <GlobalJsonLd />
      </head>
      <body className="antialiased relative">
        <SmoothScroll />
        {/* <TravelPath /> */}
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
