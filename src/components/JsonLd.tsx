/**
 * JSON-LD Schema components for GEO (Generative Engine Optimization).
 *
 * Triple-stack approach per page:
 * 1. Organization + Person (global, on every page)
 * 2. Article + author (on blog posts)
 * 3. FAQPage (on posts with FAQ sections)
 * 4. ItemList (on list/ranking pages)
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://meetthelocals.nl'

// ─── Person (Daley) ───
const personSchema = {
  '@type': 'Person',
  '@id': `${SITE_URL}/#author`,
  name: 'Daley Jansen',
  url: `${SITE_URL}/over`,
  image: `${SITE_URL}/media/portretje.webp`,
  jobTitle: 'Reisfotograaf & Blogger',
  sameAs: [
    'https://instagram.com/meetthelocals.nl',
    'https://linkedin.com/in/daleyjansen',
    'https://thedaleyedit.nl',
  ],
}

// ─── Organization (Meet the Locals) ───
const organizationSchema = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Meet the Locals',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/media/logo.webp`,
  },
  founder: { '@id': `${SITE_URL}/#author` },
  sameAs: [
    'https://instagram.com/meetthelocals.nl',
    'https://tiktok.com/@meetthelocals',
  ],
}

// ─── WebSite ───
const websiteSchema = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: 'Meet the Locals',
  url: SITE_URL,
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'nl-NL',
}

/** Global schema: include on every page via layout */
export function GlobalJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [personSchema, organizationSchema, websiteSchema],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/** Article schema for blog posts */
export function ArticleJsonLd({
  title,
  description,
  slug,
  image,
  datePublished,
  dateModified,
  category,
  basePath = '/blog',
}: {
  title: string
  description: string
  slug: string
  image: string
  datePublished: string
  dateModified: string
  category?: string
  basePath?: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `${SITE_URL}${basePath}/${slug}`,
    image: image.startsWith('http') ? image : `${SITE_URL}${image}`,
    datePublished,
    dateModified,
    author: { '@id': `${SITE_URL}/#author` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    isPartOf: { '@id': `${SITE_URL}/#website` },
    inLanguage: 'nl-NL',
    ...(category && { articleSection: category }),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}${basePath}/${slug}`,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/** FAQPage schema for FAQ sections */
export function FAQJsonLd({
  questions,
}: {
  questions: { question: string; answer: string }[]
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/** ItemList schema for rankings/lists */
export function ItemListJsonLd({
  name,
  items,
}: {
  name: string
  items: { name: string; url: string; position: number; image?: string }[]
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      url: item.url,
      ...(item.image && { image: item.image }),
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/** BreadcrumbList schema */
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[]
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
