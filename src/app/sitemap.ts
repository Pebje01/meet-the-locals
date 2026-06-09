import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://meetthelocals.nl'
  const now = new Date().toISOString()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/verhalen`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bestemmingen`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/fotografie`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/werk-in-opdracht`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/kaart`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/over`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/reisnieuws`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  try {
    const payload = await getPayload({ config })

    // Published blog posts
    const { docs: posts } = await payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      limit: 1000,
      depth: 0,
    })

    const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

    // Published stories (verhalen)
    const { docs: stories } = await payload.find({
      collection: 'stories',
      where: { status: { equals: 'published' } },
      limit: 1000,
      depth: 0,
    })

    const storyUrls: MetadataRoute.Sitemap = stories.map((story) => ({
      url: `${baseUrl}/verhalen/${story.slug}`,
      lastModified: story.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    }))

    // All destinations
    const { docs: destinations } = await payload.find({
      collection: 'destinations',
      limit: 1000,
      depth: 0,
    })

    const destinationUrls: MetadataRoute.Sitemap = destinations.map((dest) => ({
      url: `${baseUrl}/bestemmingen/${dest.slug}`,
      lastModified: dest.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }))

    return [...staticPages, ...postUrls, ...storyUrls, ...destinationUrls]
  } catch {
    // Fallback to static-only if Payload is unavailable (e.g. during static export)
    return staticPages
  }
}
