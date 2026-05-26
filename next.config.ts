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
    ],
  },
}

export default withPayload(nextConfig)
