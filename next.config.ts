import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  devIndicators: false,
  async redirects() {
    // 301 redirects van oude WordPress URLs naar de nieuwe Next.js routes.
    // De volledige geharveste URL-lijst staat in migrations/wp-redirect-map.json.
    // Bewust expliciete slugs op root (geen catch-all), zodat bestaande routes
    // zoals /blog, /verhalen, /bestemmingen en /api nooit overschaduwd worden.
    return [
      // Blogposts: WP had /:slug op root, nu /blog/:slug (slugs zijn 1 op 1 gemigreerd)
      { source: '/3-weken-rondreizen-door-peru', destination: '/blog/3-weken-rondreizen-door-peru', permanent: true },
      { source: '/machu-picchu-zonder-kaartje-gekocht', destination: '/blog/machu-picchu-zonder-kaartje-gekocht', permanent: true },
      { source: '/route-maleisie-twee-weken', destination: '/blog/route-maleisie-twee-weken', permanent: true },
      // Posts die niet opnieuw gepubliceerd zijn: naar het blogoverzicht
      { source: '/highlights-maleisie', destination: '/blog', permanent: true },
      { source: '/testie-mc-testy-face', destination: '/blog', permanent: true },
      // Bestemmingspagina's: WP pages op root, nu /bestemmingen/:slug
      { source: '/bangkok', destination: '/bestemmingen/bangkok', permanent: true },
      { source: '/italie', destination: '/bestemmingen/italie', permanent: true },
      { source: '/marokko', destination: '/bestemmingen/marokko', permanent: true },
      { source: '/vietnam', destination: '/bestemmingen/vietnam', permanent: true },
      { source: '/newyork', destination: '/bestemmingen', permanent: true },
      // Overige oude WP pagina's
      { source: '/reisfotografie', destination: '/fotografie', permanent: true },
      { source: '/gear', destination: '/fotografie', permanent: true },
      { source: '/home-nederlands', destination: '/', permanent: true },
      { source: '/en-us', destination: '/', permanent: true },
      { source: '/en-us/:path*', destination: '/', permanent: true },
      { source: '/1542-2', destination: '/', permanent: true },
      { source: '/footer', destination: '/', permanent: true },
      { source: '/header', destination: '/', permanent: true },
      { source: '/metform-form/contact', destination: '/contact', permanent: true },
      // WP datumarchieven (/:jaar/:maand/:dag)
      { source: '/2023/:path*', destination: '/blog', permanent: true },
      { source: '/2024/:path*', destination: '/blog', permanent: true },
      // WP taxonomie-archieven en feeds
      { source: '/category/:slug*', destination: '/blog', permanent: true },
      { source: '/tag/:slug*', destination: '/blog', permanent: true },
      { source: '/feed', destination: '/', permanent: true },
      { source: '/comments/feed', destination: '/', permanent: true },
      // Fotografie-subpagina's zonder inhoud: tijdelijk naar de hub, tot er
      // echte content staat. Tijdelijk (307), zodat zoekmachines niets vastleggen.
      // /fotografie/blog/:slug blijft gewoon werken.
      { source: '/fotografie/gear', destination: '/fotografie', permanent: false },
      { source: '/fotografie/galerij', destination: '/fotografie', permanent: false },
      { source: '/fotografie/galerij/:slug', destination: '/fotografie', permanent: false },
      { source: '/fotografie/blog', destination: '/fotografie', permanent: false },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3007',
        pathname: '/api/media/file/**',
      },
      {
        protocol: 'https',
        hostname: 'meetthelocals.nl',
        pathname: '/api/media/file/**',
      },
      {
        // Hetzner Object Storage — media files served directly from S3
        protocol: 'https',
        hostname: 'fsn1.your-objectstorage.com',
        pathname: '/meetthelocals-media/**',
      },
      {
        // Behance CDN — voor project afbeeldingen in popups
        protocol: 'https',
        hostname: 'mir-s3-cdn-cf.behance.net',
        pathname: '/project_modules/**',
      },
    ],
  },
}

export default withPayload(nextConfig)
