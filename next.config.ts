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
    ],
  },
}

export default withPayload(nextConfig)
