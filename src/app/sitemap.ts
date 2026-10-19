import type { MetadataRoute } from 'next'
import { getPayload, type Where } from 'payload'
import config from '@payload-config'
import { publishedPostsWhere } from '@/lib/queries'

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

  const payload = await getPayload({ config }).catch(() => null)
  // Fallback naar alleen de vaste pagina's als Payload niet bereikbaar is (bijv. bij een statische build)
  if (!payload) return staticPages

  /**
   * Elke collectie apart ophalen. Eerder zat alles in één try: ontbrak één
   * tabel in de productiedatabase, dan viel de hele sitemap terug op de
   * vaste pagina's en verdwenen alle verhalen en bestemmingen eruit.
   */
  async function urlsFor(
    collection: 'posts' | 'stories' | 'destinations' | 'photography-posts',
    where: Where | undefined,
    toUrl: (slug: string) => string,
    changeFrequency: 'weekly' | 'monthly',
    priority: number,
  ): Promise<MetadataRoute.Sitemap> {
    try {
      const { docs } = await payload!.find({ collection, where, limit: 1000, depth: 0 })
      return docs.map((doc) => ({
        url: toUrl(doc.slug as string),
        lastModified: doc.updatedAt,
        changeFrequency,
        priority,
      }))
    } catch (error) {
      console.error(`[sitemap] ${collection} overgeslagen:`, error instanceof Error ? error.message : error)
      return []
    }
  }

  const published: Where = { status: { equals: 'published' } }
  const groups = await Promise.all([
    urlsFor('posts', publishedPostsWhere(), (slug) => `${baseUrl}/blog/${slug}`, 'monthly', 0.8),
    urlsFor('stories', published, (slug) => `${baseUrl}/verhalen/${slug}`, 'monthly', 0.85),
    urlsFor('destinations', undefined, (slug) => `${baseUrl}/bestemmingen/${slug}`, 'weekly', 0.85),
    urlsFor('photography-posts', published, (slug) => `${baseUrl}/fotografie/blog/${slug}`, 'monthly', 0.7),
  ])

  return [...staticPages, ...groups.flat()]
}
