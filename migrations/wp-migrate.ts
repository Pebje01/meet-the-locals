import { getPayload } from 'payload'
import config from '../src/payload.config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import https from 'https'
import http from 'http'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const WP_URL = 'https://meetthelocals.nl/wp-json/wp/v2'
const MEDIA_DIR = path.resolve(__dirname, '../public/media')

// --- Helpers ---

async function wpFetch<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${WP_URL}/${endpoint}`)
  if (!res.ok) throw new Error(`WP API error: ${res.status} ${endpoint}`)
  return res.json() as T
}

async function downloadFile(url: string, dest: string): Promise<void> {
  if (fs.existsSync(dest)) return

  const dir = path.dirname(dest)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http
    client.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        downloadFile(res.headers.location!, dest).then(resolve).catch(reject)
        return
      }
      const stream = fs.createWriteStream(dest)
      res.pipe(stream)
      stream.on('finish', () => { stream.close(); resolve() })
      stream.on('error', reject)
    }).on('error', reject)
  })
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/g, ' ').trim()
}

function htmlToLexical(html: string): object {
  // Convert HTML to Lexical rich text JSON format
  const plainText = stripHtml(html)
  const paragraphs = plainText.split(/\n\n+/).filter(p => p.trim())

  return {
    root: {
      type: 'root',
      children: paragraphs.length > 0
        ? paragraphs.map(p => ({
            type: 'paragraph',
            children: [{ type: 'text', text: p.trim(), format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          }))
        : [{
            type: 'paragraph',
            children: [{ type: 'text', text: '', format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          }],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

// --- WP Types ---

interface WPPost {
  id: number
  title: { rendered: string }
  slug: string
  date: string
  content: { rendered: string }
  excerpt: { rendered: string }
  featured_media: number
  categories: number[]
  tags: number[]
  status: string
}

interface WPPage {
  id: number
  title: { rendered: string }
  slug: string
  content: { rendered: string }
  featured_media: number
  status: string
}

interface WPMedia {
  id: number
  title: { rendered: string }
  source_url: string
  alt_text: string
  caption: { rendered: string }
  media_type: string
  mime_type: string
}

interface WPTerm {
  id: number
  name: string
  slug: string
}

// --- Migration ---

async function migrate() {
  console.log('🚀 Starting WordPress → Payload migration...\n')

  const payload = await getPayload({ config })

  // 1. Fetch all WP data
  console.log('📥 Fetching WordPress data...')
  const [wpPosts, wpPages, wpMedia, wpCategories, wpTags] = await Promise.all([
    wpFetch<WPPost[]>('posts?per_page=100'),
    wpFetch<WPPage[]>('pages?per_page=100'),
    wpFetch<WPMedia[]>('media?per_page=100'),
    wpFetch<WPTerm[]>('categories?per_page=100'),
    wpFetch<WPTerm[]>('tags?per_page=100'),
  ])

  console.log(`  Posts: ${wpPosts.length}`)
  console.log(`  Pages: ${wpPages.length}`)
  console.log(`  Media: ${wpMedia.length}`)
  console.log(`  Categories: ${wpCategories.length}`)
  console.log(`  Tags: ${wpTags.length}\n`)

  // 2. Migrate Categories
  console.log('📁 Migrating categories...')
  const categoryMap = new Map<number, number>() // WP id → Payload id

  for (const cat of wpCategories) {
    if (cat.slug === 'uncategorized' || cat.slug === 'uncategorized-nl' || cat.slug === 'uncategorized-en-us') continue
    try {
      const existing = await payload.find({ collection: 'categories', where: { slug: { equals: cat.slug } } })
      if (existing.docs.length > 0) {
        categoryMap.set(cat.id, existing.docs[0].id as number)
        console.log(`  ✓ Category exists: ${cat.name}`)
        continue
      }
      const created = await payload.create({
        collection: 'categories',
        data: { name: cat.name, slug: cat.slug },
      })
      categoryMap.set(cat.id, created.id as number)
      console.log(`  ✓ ${cat.name}`)
    } catch (e: any) {
      console.error(`  ✗ Category "${cat.name}": ${e.message}`)
    }
  }

  // 3. Migrate Tags
  console.log('\n🏷️  Migrating tags...')
  const tagMap = new Map<number, number>()

  for (const tag of wpTags) {
    try {
      const existing = await payload.find({ collection: 'tags', where: { slug: { equals: tag.slug } } })
      if (existing.docs.length > 0) {
        tagMap.set(tag.id, existing.docs[0].id as number)
        console.log(`  ✓ Tag exists: ${tag.name}`)
        continue
      }
      const created = await payload.create({
        collection: 'tags',
        data: { name: tag.name, slug: tag.slug },
      })
      tagMap.set(tag.id, created.id as number)
      console.log(`  ✓ ${tag.name}`)
    } catch (e: any) {
      console.error(`  ✗ Tag "${tag.name}": ${e.message}`)
    }
  }

  // 4. Download & Migrate Media
  console.log('\n📸 Migrating media...')
  const mediaMap = new Map<number, number>() // WP id → Payload id

  const imageMedia = wpMedia.filter(m => m.media_type === 'image')

  for (const media of imageMedia) {
    try {
      const filename = path.basename(new URL(media.source_url).pathname)
      const localPath = path.join(MEDIA_DIR, filename)

      console.log(`  ⬇ Downloading: ${filename}`)
      await downloadFile(media.source_url, localPath)

      const existing = await payload.find({
        collection: 'media',
        where: { alt: { equals: media.alt_text || media.title.rendered || filename } },
      })
      if (existing.docs.length > 0) {
        mediaMap.set(media.id, existing.docs[0].id as number)
        console.log(`  ✓ Media exists: ${filename}`)
        continue
      }

      const fileBuffer = fs.readFileSync(localPath)
      const created = await payload.create({
        collection: 'media',
        data: {
          alt: media.alt_text || media.title.rendered || filename,
          caption: stripHtml(media.caption?.rendered || ''),
        },
        file: {
          data: fileBuffer,
          name: filename,
          mimetype: media.mime_type || 'image/jpeg',
          size: fileBuffer.length,
        },
      })
      mediaMap.set(media.id, created.id as number)
      console.log(`  ✓ ${filename}`)
    } catch (e: any) {
      console.error(`  ✗ Media "${media.title.rendered}": ${e.message}`)
    }
  }

  // Also download videos to public/media (not imported to Payload media collection)
  const videoMedia = wpMedia.filter(m => m.media_type !== 'image')
  for (const media of videoMedia) {
    try {
      const filename = path.basename(new URL(media.source_url).pathname)
      const localPath = path.join(MEDIA_DIR, filename)
      console.log(`  ⬇ Downloading video: ${filename}`)
      await downloadFile(media.source_url, localPath)
      console.log(`  ✓ ${filename}`)
    } catch (e: any) {
      console.error(`  ✗ Video "${media.title.rendered}": ${e.message}`)
    }
  }

  // 5. Migrate Posts
  console.log('\n📝 Migrating posts...')

  for (const post of wpPosts) {
    try {
      const existing = await payload.find({ collection: 'posts', where: { slug: { equals: post.slug } } })
      if (existing.docs.length > 0) {
        console.log(`  ✓ Post exists: ${post.title.rendered}`)
        continue
      }

      const categoryIds = post.categories
        .map(id => categoryMap.get(id))
        .filter(Boolean) as number[]

      const tagIds = post.tags
        .map(id => tagMap.get(id))
        .filter(Boolean) as number[]

      const heroImageId = mediaMap.get(post.featured_media)
      // If no featured_media match, use first available media
      const fallbackImageId = heroImageId || mediaMap.values().next().value

      const data: Record<string, any> = {
        title: post.title.rendered,
        slug: post.slug,
        publishedDate: post.date,
        content: htmlToLexical(post.content.rendered),
        excerpt: stripHtml(post.excerpt.rendered),
        status: 'published',
        heroImage: fallbackImageId,
        categories: categoryIds.length > 0 ? categoryIds : undefined,
        tags: tagIds.length > 0 ? tagIds : undefined,
      }

      const created = await payload.create({
        collection: 'posts',
        data,
        draft: false,
      })
      console.log(`  ✓ ${post.title.rendered}`)
    } catch (e: any) {
      console.error(`  ✗ Post "${post.title.rendered}": ${e.message}`)
    }
  }

  // 6. Migrate destination pages (Bangkok, Italie)
  console.log('\n🌍 Migrating destinations...')
  const destinationPages = wpPages.filter(p =>
    ['bangkok', 'italie'].includes(p.slug)
  )

  const regionMap: Record<string, string> = {
    bangkok: 'asia',
    italie: 'europe',
  }

  const coordsMap: Record<string, { latitude: number; longitude: number }> = {
    bangkok: { latitude: 13.7563, longitude: 100.5018 },
    italie: { latitude: 41.8719, longitude: 12.5674 },
  }

  for (const page of destinationPages) {
    try {
      const existing = await payload.find({ collection: 'destinations', where: { slug: { equals: page.slug } } })
      if (existing.docs.length > 0) {
        console.log(`  ✓ Destination exists: ${page.title.rendered}`)
        continue
      }

      // Use first available media as hero
      const firstMediaId = mediaMap.values().next().value!

      await payload.create({
        collection: 'destinations',
        data: {
          name: page.title.rendered,
          slug: page.slug,
          region: regionMap[page.slug] || 'europe',
          heroImage: firstMediaId,
          coordinates: coordsMap[page.slug],
        },
      })
      console.log(`  ✓ ${page.title.rendered}`)
    } catch (e: any) {
      console.error(`  ✗ Destination "${page.title.rendered}": ${e.message}`)
    }
  }

  // 7. Summary
  console.log('\n✅ Migration complete!')
  console.log(`  Categories: ${categoryMap.size}`)
  console.log(`  Tags: ${tagMap.size}`)
  console.log(`  Media: ${mediaMap.size} images + ${videoMedia.length} videos`)
  console.log(`  Posts: ${wpPosts.length}`)
  console.log(`  Destinations: ${destinationPages.length}`)
  console.log('\n💡 Open http://localhost:3000/admin to see your content!')

  process.exit(0)
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
