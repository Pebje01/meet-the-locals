import { getPayload } from 'payload'
import config from '@payload-config'
import type { Category, Destination, Post, Story } from '@/payload-types'
import { HomePageClient, type HomeRecentPost } from './HomePageClient'
import { publishedPostsWhere } from '@/lib/queries'
import { WERELDDEEL_OPTIONS, labelFor } from '@/lib/taxonomy'

export const revalidate = 300

function mediaUrl(media: Post['heroImage']): string {
  if (!media || typeof media !== 'object') return ''

  return media.url ?? media.sizes?.medium?.url ?? ''
}

function firstRelationName<T extends Category | Destination>(items?: (number | T)[] | null): string {
  const relation = items?.find((item): item is T => typeof item === 'object')
  return relation?.name ?? ''
}

function postCategory(post: Post): string {
  return (
    firstRelationName(post.categories) ||
    firstRelationName(post.destinations) ||
    labelFor(WERELDDEEL_OPTIONS, post.werelddeel) ||
    'Reisverhaal'
  )
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
    .format(new Date(date))
    .replace(/\./g, '')
}

type MetDatum = HomeRecentPost & { publishedDate: string }

function toHomeRecentPost(post: Post): MetDatum {
  return {
    title: post.title,
    href: `/blog/${post.slug}`,
    image: mediaUrl(post.heroImage),
    excerpt: post.excerpt,
    category: postCategory(post),
    date: formatDate(post.publishedDate),
    publishedDate: post.publishedDate,
  }
}

function toHomeRecentStory(story: Story): MetDatum {
  return {
    title: story.title,
    href: `/verhalen/${story.slug}`,
    image: mediaUrl(story.heroImage as Post['heroImage']),
    excerpt: story.intro,
    category: story.eyebrow || 'Reportage',
    date: formatDate(story.publishedDate),
    publishedDate: story.publishedDate,
  }
}

/**
 * Laatste verhalen mengt de twee soorten: korte blogposts en lange reportages.
 * Ze staan in aparte collecties, dus ze worden hier apart opgehaald en daarna
 * op publicatiedatum door elkaar gezet. Elke kaart draagt haar eigen pad mee,
 * want /blog en /verhalen zijn verschillende routes.
 */
async function getRecentPosts(): Promise<HomeRecentPost[]> {
  const payload = await getPayload({ config })
  const [posts, stories] = await Promise.all([
    payload.find({ collection: 'posts', where: publishedPostsWhere(), sort: '-publishedDate', depth: 1, limit: 3 }),
    payload.find({ collection: 'stories', where: { status: { equals: 'published' } }, sort: '-publishedDate', depth: 1, limit: 3 }),
  ])

  return [...posts.docs.map(toHomeRecentPost), ...stories.docs.map(toHomeRecentStory)]
    .filter((item) => item.image)
    .sort((a, b) => Date.parse(b.publishedDate) - Date.parse(a.publishedDate))
    .slice(0, 3)
    .map(({ publishedDate: _publishedDate, ...kaart }) => kaart)
}

export default async function HomePage() {
  const recentPosts = await getRecentPosts()

  return <HomePageClient recentPosts={recentPosts} />
}
