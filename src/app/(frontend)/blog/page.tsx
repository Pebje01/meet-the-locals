import { getPayload } from 'payload'
import config from '@payload-config'
import { PageHero } from '@/components/PageHero'
import { BlogExplorer } from '@/components/blog/BlogExplorer'

type BlogPageProps = {
  searchParams?: Promise<{
    werelddeel?: string | string[]
    thema?: string | string[]
  }>
}

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '')
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = searchParams ? await searchParams : {}
  const werelddeel = firstParam(params.werelddeel)
  const thema = firstParam(params.thema)
  const initialFilter = werelddeel
    ? { type: 'werelddeel' as const, value: werelddeel }
    : thema
      ? { type: 'thema' as const, value: thema }
      : { type: '' as const, value: '' }

  const payload = await getPayload({ config })
  const { docs: posts } = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    sort: '-publishedDate',
    depth: 1,
    limit: 100,
  })

  return (
    <main className="min-h-screen bg-warm-white">
      <PageHero
        title="Reistips voor echte trips"
        subtitle="Voor normale mensen die ook maar proberen iets van de wereld te zien, tussen werk, afspraken en alle andere verplichtingen door."
        image="/media/maleisie-5-scaled.webp"
        imageAlt="Reizen door Maleisië"
      />
      <BlogExplorer posts={posts} initialFilter={initialFilter} />
    </main>
  )
}
