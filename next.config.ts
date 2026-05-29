import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  devIndicators: false,
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
