/**
 * Zet de blogpost over de Bronx klaar als concept.
 *
 *   set -a; . ./.env; set +a; npx tsx scripts/nieuwe-post-bronx.ts [--dry]
 *
 * De post gaat als `draft` de deur uit: het verhaal en de beelden komen nog
 * van Daley zelf. Alles eromheen staat wel al goed, zodat er straks alleen
 * tekst en foto's in hoeven.
 *
 * De hero is voorlopig newyork-taxi.webp. Dat is New York maar niet de Bronx,
 * dus die moet eruit zodra het echte beeld er is. Payload eist een hero, dus
 * leeg laten kan niet.
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'
import type { Post } from '../src/payload-types'

const dry = process.argv.includes('--dry')

const SLUG = 'twee-weken-als-local-in-the-bronx'
const TIJDELIJKE_HERO = 'newyork-taxi.webp'

/** Kopjes die de structuur vastleggen. De tekst eronder schrijft Daley. */
const SKELET: { kop: string; hint: string }[] = [
  {
    kop: 'Waarom de Bronx',
    hint: 'Hoe kwam je daar terecht, en wat verwachtte je vooraf. Twee of drie zinnen is genoeg.',
  },
  {
    kop: 'Waar we sliepen',
    hint: 'De buurt, het appartement, wat het kostte. Dit is het soort detail dat alleen iemand heeft die er was.',
  },
  {
    kop: 'Wat twee weken anders maakt dan twee dagen',
    hint: 'Het verschil tussen bezoeken en er even wonen. Boodschappen, de metro, dezelfde gezichten.',
  },
  {
    kop: 'Eten',
    hint: 'Namen en adressen. Wat je at, wat het kostte, of je terug zou gaan.',
  },
  {
    kop: 'Wat tegenviel',
    hint: 'Niet overslaan. Dit is het stuk dat een gegenereerd reisverhaal nooit heeft.',
  },
  {
    kop: 'Praktisch',
    hint: 'Vervoer, veiligheid zoals jij het ervoer, beste tijd, wat je anders zou doen.',
  },
]

/** Bouwt de Lexical-structuur die Payload verwacht. */
function maakContent() {
  const para = (tekst: string, cursief = false) => ({
    type: 'paragraph',
    version: 1,
    children: [
      {
        type: 'text',
        version: 1,
        text: tekst,
        format: cursief ? 2 : 0,
        detail: 0,
        mode: 'normal',
        style: '',
      },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
  })

  const kop = (tekst: string) => ({
    type: 'heading',
    tag: 'h2',
    version: 1,
    children: [
      { type: 'text', version: 1, text: tekst, format: 0, detail: 0, mode: 'normal', style: '' },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
  })

  const children: unknown[] = [
    para(
      'Deze post staat klaar maar is nog niet geschreven. De kopjes hieronder geven de structuur; de tekst en de beelden komen van Daley zelf.',
      true,
    ),
  ]

  for (const s of SKELET) {
    children.push(kop(s.kop))
    children.push(para(s.hint, true))
  }

  return {
    root: {
      type: 'root',
      version: 1,
      children,
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
    },
  } as Post['content']
}

const payload = await getPayload({ config })

async function idVan(collection: 'media' | 'destinations', veld: string, waarde: string) {
  const { docs } = await payload.find({
    collection,
    where: { [veld]: { equals: waarde } },
    limit: 1,
    depth: 0,
  })
  return docs[0] ? (docs[0].id as number) : null
}

const bestaat = await payload.find({
  collection: 'posts',
  where: { slug: { equals: SLUG } },
  limit: 1,
  depth: 0,
})
if (bestaat.docs.length) {
  console.log(`De post bestaat al (id ${bestaat.docs[0].id}). Er is niets gewijzigd.`)
  process.exit(0)
}

const heroId = await idVan('media', 'filename', TIJDELIJKE_HERO)
if (!heroId) {
  console.error(`Tijdelijke hero ${TIJDELIJKE_HERO} niet gevonden in de media.`)
  process.exit(1)
}

const bestemmingen = (
  await Promise.all(
    ['new-york', 'verenigde-staten'].map((s) => idVan('destinations', 'slug', s)),
  )
).filter((x): x is number => x !== null)

const data = {
  title: 'Twee weken als local in The Bronx, New York',
  slug: SLUG,
  heroImage: heroId,
  content: maakContent(),
  excerpt:
    'Twee weken wonen in plaats van bezoeken. Over de Bronx, de metro, het eten en wat er anders is als je ergens blijft.',
  publishedDate: new Date().toISOString(),
  destinations: bestemmingen,
  werelddeel: 'north-america' as const,
  thema: ['reisverhalen-routes', 'reisfotografie'] as const,
  status: 'draft' as const,
  seo: {
    metaTitle: 'Twee weken als local in The Bronx, New York',
    metaDescription:
      'Hoe het is om twee weken in de Bronx te wonen in plaats van New York te bezoeken. Eigen ervaringen, eigen fotografie.',
  },
}

console.log('Aan te maken post')
console.log(`  titel        ${data.title}`)
console.log(`  slug         ${data.slug}`)
console.log(`  status       ${data.status}`)
console.log(`  hero         ${TIJDELIJKE_HERO}  (tijdelijk, moet vervangen)`)
console.log(`  bestemmingen ${bestemmingen.length} gekoppeld`)
console.log(`  kopjes       ${SKELET.map((s) => s.kop).join(' | ')}`)

if (dry) {
  console.log('\n--dry, er is niets aangemaakt.')
  process.exit(0)
}

const doc = await payload.create({ collection: 'posts', data: data as never })
console.log(`\nAangemaakt met id ${doc.id}.`)
console.log(`Bewerken op /admin/collections/posts/${doc.id}`)
process.exit(0)
