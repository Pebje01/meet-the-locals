/**
 * JSON-LD Schema components for GEO (Generative Engine Optimization).
 *
 * Triple-stack approach per page:
 * 1. Organization + Person (global, on every page)
 * 2. BlogPosting + author (on blog posts)
 * 3. FAQPage (on posts with FAQ sections)
 * 4. ItemList (on list/ranking pages)
 */

import {
  BRANDS,
  CREDIT,
  DEFINING_SENTENCE,
  KNOWS_ABOUT,
  PART_OF_LINE,
  PROFILES,
  SITE_PROFILES,
} from '@/lib/credit'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://meetthelocals.nl'

// De @id's zijn ankers in de graaf, geen adressen die opgehaald worden. Ze
// hangen daarom aan de vaste site-URL uit credit.json en niet aan de omgeving,
// zodat een lokale NEXT_PUBLIC_SITE_URL de verwijzingen niet uit elkaar trekt.
const AUTHOR_ID = `${BRANDS.site.url}/#author`
const ORG_ID = BRANDS.site.id
const WEBSITE_ID = `${BRANDS.site.url}/#website`

// ─── Person (Daley) ───
// De losse velden hier zijn wat een model nodig heeft om deze Daley Jansen te
// onderscheiden van elke andere: een vaste omschrijving, de onderwerpen waar
// aantoonbaar over gepubliceerd wordt, en elk profiel dat van dezelfde persoon is.
const personSchema = {
  '@type': 'Person',
  '@id': AUTHOR_ID,
  name: CREDIT.creator,
  url: `${SITE_URL}/over`,
  image: `${SITE_URL}/media/portretje.webp`,
  jobTitle: CREDIT.jobTitle,
  description: DEFINING_SENTENCE,
  knowsAbout: [...KNOWS_ABOUT],
  nationality: { '@type': 'Country', name: 'Nederland' },
  worksFor: { '@id': ORG_ID },
  sameAs: [...PROFILES],
}

// ─── Merkstructuur ───
// The Daley Edit is de paraplu; Meet the Locals, Daley Photography en
// We Grow Brands hangen eronder. Alle vier krijgen een eigen @id en verwijzen
// naar elkaar, zodat een model ze als één organisatie herkent in plaats van
// als vier losse namen met toevallig dezelfde oprichter.

const childBrands = [BRANDS.site, BRANDS.rightsHolder, ...BRANDS.others]

const parentOrganizationSchema = {
  '@type': 'Organization',
  '@id': BRANDS.parent.id,
  name: BRANDS.parent.name,
  url: BRANDS.parent.url,
  ...(BRANDS.parent.description && { description: BRANDS.parent.description }),
  founder: { '@id': AUTHOR_ID },
  subOrganization: childBrands.map((b) => ({ '@id': b.id })),
}

// ─── Organization (Meet the Locals) ───
const organizationSchema = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: BRANDS.site.name,
  url: SITE_URL,
  description: BRANDS.site.description ?? PART_OF_LINE,
  slogan: PART_OF_LINE,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/media/logo.webp`,
  },
  founder: { '@id': AUTHOR_ID },
  parentOrganization: { '@id': BRANDS.parent.id },
  ...(SITE_PROFILES.length && { sameAs: [...SITE_PROFILES] }),
}

// ─── Daley Photography (rechthebbende op alle beelden) ───
const rightsHolderSchema = {
  '@type': 'Organization',
  '@id': BRANDS.rightsHolder.id,
  name: BRANDS.rightsHolder.name,
  url: BRANDS.rightsHolder.url,
  ...(BRANDS.rightsHolder.description && { description: BRANDS.rightsHolder.description }),
  founder: { '@id': AUTHOR_ID },
  parentOrganization: { '@id': BRANDS.parent.id },
}

// ─── Overige merken onder dezelfde paraplu ───
const otherBrandSchemas = BRANDS.others.map((b) => ({
  '@type': 'Organization',
  '@id': b.id,
  name: b.name,
  url: b.url,
  ...(b.description && { description: b.description }),
  parentOrganization: { '@id': BRANDS.parent.id },
}))

// ─── WebSite ───
const websiteSchema = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  name: 'Meet the Locals',
  url: SITE_URL,
  publisher: { '@id': ORG_ID },
  inLanguage: 'nl-NL',
}

/** Global schema: include on every page via layout */
export function GlobalJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      personSchema,
      organizationSchema,
      parentOrganizationSchema,
      rightsHolderSchema,
      ...otherBrandSchemas,
      websiteSchema,
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ─── ImageObject ───
/**
 * Bouwt een ImageObject met volledige rechteninformatie.
 *
 * Dit is voor een fotograaf het belangrijkste schema op de site: het koppelt
 * elk beeld aan een maker, een licentie en een plek om die licentie aan te
 * vragen. Zonder deze velden is een foto die elders opduikt anoniem.
 *
 * `license` en `acquireLicensePage` samen leveren het 'Licensable' label in
 * Google Images. Dezelfde waarden staan in de XMP van het bestand zelf,
 * geschreven door scripts/write-credit.mjs.
 */
export function imageObject({
  url,
  caption,
  width,
  height,
  exif,
}: {
  url: string
  caption?: string
  width?: number
  height?: number
  exif?: {
    camera?: string | null
    lens?: string | null
    aperture?: string | null
    shutterSpeed?: string | null
    iso?: string | null
    focalLength?: string | null
    latitude?: number | null
    longitude?: number | null
  } | null
}) {
  const absolute = url.startsWith('http') ? url : `${SITE_URL}${url}`

  // De cameragegevens als leesbare regel. Dit is precies het soort detail dat
  // niet uit een andere bron te halen is, en dus bewijst dat het beeld van jou is.
  const settings = [exif?.camera, exif?.lens, exif?.focalLength, exif?.aperture, exif?.shutterSpeed, exif?.iso ? `ISO ${exif.iso}` : null]
    .filter(Boolean)
    .join(' · ')

  return {
    '@type': 'ImageObject',
    contentUrl: absolute,
    url: absolute,
    ...(caption && { caption, description: caption }),
    ...(width && { width }),
    ...(height && { height }),
    creator: { '@id': AUTHOR_ID },
    copyrightHolder: { '@id': BRANDS.rightsHolder.id },
    copyrightNotice: CREDIT.copyrightNotice,
    creditText: CREDIT.creditLine,
    license: CREDIT.webStatement,
    acquireLicensePage: CREDIT.acquireLicensePage,
    ...(settings && { exifData: settings }),
    ...(typeof exif?.latitude === 'number' &&
      typeof exif?.longitude === 'number' && {
        contentLocation: {
          '@type': 'Place',
          geo: {
            '@type': 'GeoCoordinates',
            latitude: exif.latitude,
            longitude: exif.longitude,
          },
        },
      }),
  }
}

/** Los ImageObject op een pagina, voor galerijen en photo spots. */
export function ImageJsonLd(props: Parameters<typeof imageObject>[0]) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', ...imageObject(props) }),
      }}
    />
  )
}

/** BlogPosting schema for blog posts (subtype of Article) */
export function ArticleJsonLd({
  title,
  description,
  slug,
  image,
  datePublished,
  dateModified,
  category,
  keywords,
  basePath = '/blog',
}: {
  title: string
  description: string
  slug: string
  image: string
  datePublished: string
  dateModified: string
  category?: string
  keywords?: string[]
  basePath?: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url: `${SITE_URL}${basePath}/${slug}`,
    image: imageObject({ url: image, caption: title }),
    datePublished,
    dateModified,
    author: { '@id': AUTHOR_ID },
    publisher: { '@id': ORG_ID },
    isPartOf: { '@id': WEBSITE_ID },
    inLanguage: 'nl-NL',
    ...(category && { articleSection: category }),
    ...(keywords?.length && { keywords: keywords.join(', ') }),
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
