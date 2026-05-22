import { getPayload } from 'payload'
import config from '@payload-config'
import type { Category, Destination, Post } from '@/payload-types'
import { HomePageClient, type HomeRecentPost } from './HomePageClient'

export const revalidate = 300

const WERELDDEEL_LABELS: Record<NonNullable<Post['werelddeel']>, string> = {
  europe: 'Europa',
  asia: 'Azië',
  'north-america': 'Noord-Amerika',
  'south-america': 'Zuid-Amerika',
  africa: 'Afrika',
  oceania: 'Oceanië',
  'middle-east': 'Midden-Oosten',
}

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
    (post.werelddeel ? WERELDDEEL_LABELS[post.werelddeel] : '') ||
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

function toHomeRecentPost(post: Post): HomeRecentPost {
  return {
    title: post.title,
    slug: post.slug,
    image: mediaUrl(post.heroImage),
    excerpt: post.excerpt,
    category: postCategory(post),
    date: formatDate(post.publishedDate),
  }
}

async function getRecentPosts(): Promise<HomeRecentPost[]> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    sort: '-publishedDate',
    depth: 1,
    limit: 3,
  })

  return docs.map(toHomeRecentPost).filter((post) => post.image)
}

export default async function HomePage() {
  const recentPosts = await getRecentPosts()

  return <HomePageClient recentPosts={recentPosts} />
}
