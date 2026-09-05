/**
 * Zet het Vietnam-verhaal over de scootertocht klaar als concept.
 *
 *   set -a; . ./.env; set +a; npx tsx scripts/nieuw-verhaal-vietnam.ts [--dry]
 *
 * Derde in de lijst: de datum staat twee dagen terug, onder Bronx en Iquitos.
 *
 * Hero komt uit de Hanoi-serie: scooters in de schemering, met meesleep. Dat
 * is thematisch precies raak, maar het is Hanoi en niet Ho Chi Minh. Vervangen
 * zodra er beeld uit het zuiden is.
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'
import type { Story } from '../src/payload-types'

const dry = process.argv.includes('--dry')

const SLUG = 'scootertocht-ho-chi-minh-mekong-delta'
const HERO = 'vietnam-scooters.webp'

const SKELET: [string, string][] = [
  ['Het idee', 'Waarom een scooter en niet de bus. Wat zeiden mensen erover, en waar komt die titel vandaan.'],
  ['De scooter', 'Waar geregeld, wat het kostte, rijbewijs en verzekering, in welke staat hij was.'],
  ['De weg uit', 'Ho Chi Minh uit rijden. Het verkeer, de eerste uren, wanneer het rustiger werd.'],
  ['De Delta', 'Wat je zag, waar je sliep, wie je tegenkwam.'],
  ['Wat tegenviel', 'Niet overslaan. Pech, regen, verdwalen, en of het gevaarlijk was.'],
  ['Zou je het aanraden', 'Voor wie wel en voor wie niet, en wat je zelf anders zou doen.'],
]

const tekst = (t: string, cursief = false) => ({
  type: 'text', version: 1, text: t, format: cursief ? 2 : 0, detail: 0, mode: 'normal', style: '',
})
const para = (t: string, cursief = false) => ({
  type: 'paragraph', version: 1, children: [tekst(t, cursief)],
  direction: 'ltr' as const, format: '' as const, indent: 0,
})
const kop = (t: string) => ({
  type: 'heading', tag: 'h2', version: 1, children: [tekst(t)],
  direction: 'ltr' as const, format: '' as const, indent: 0,
})

const children: unknown[] = [
  para('Dit verhaal staat klaar maar is nog niet geschreven. De kopjes geven de structuur; de tekst en de beelden komen van Daley zelf.', true),
]
for (const [k, hint] of SKELET) {
  children.push(kop(k))
  children.push(para(hint, true))
}

const CONTENT = {
  root: { type: 'root', version: 1, children, direction: 'ltr' as const, format: '' as const, indent: 0 },
} as Story['content']

const payload = await getPayload({ config })

const bestaat = await payload.find({
  collection: 'stories', where: { slug: { equals: SLUG } }, limit: 1, depth: 0,
})
if (bestaat.docs.length) {
  console.log(`Bestaat al (id ${bestaat.docs[0].id}). Niets gewijzigd.`)
  process.exit(0)
}

const { docs: media } = await payload.find({
  collection: 'media', where: { filename: { equals: HERO } }, limit: 1, depth: 0,
})
if (!media[0]) {
  console.error(`Hero ${HERO} niet gevonden.`)
  process.exit(1)
}

// Twee dagen terug, zodat dit verhaal onder Bronx en Iquitos staat.
const datum = new Date()
datum.setDate(datum.getDate() - 2)

const data = {
  title: '\u201cDit doen zelfs Vietnamezen niet\u201d: een scootertocht van Ho Chi Minh naar de Mekong Delta',
  slug: SLUG,
  eyebrow: 'Zuid-Vietnam op twee wielen',
  heroImage: media[0].id as number,
  intro:
    'Op een geleende scooter de stad uit, richting de Mekong Delta. Over het verkeer, de route, wat het kostte en waarom iedereen zei dat het een slecht plan was.',
  content: CONTENT,
  publishedDate: datum.toISOString(),
  werelddeel: 'asia' as const,
  thema: ['reisverhalen-routes', 'reistips-praktisch'] as const,
  status: 'draft' as const,
  seo: {
    metaTitle: 'Met de scooter van Ho Chi Minh naar de Mekong Delta',
    metaDescription:
      'Een scootertocht van Ho Chi Minh City naar de Mekong Delta: route, kosten, verkeer en of het een goed idee is. Eigen ervaring en fotografie.',
  },
}

console.log('Aan te maken verhaal')
console.log(`  titel   ${data.title}`)
console.log(`  slug    ${data.slug}`)
console.log(`  datum   ${datum.toISOString().slice(0, 10)}  (derde in de lijst)`)
console.log(`  hero    ${HERO}  (Hanoi-scooters, juiste thema maar verkeerde stad)`)
console.log(`  kopjes  ${SKELET.map(([k]) => k).join(' | ')}`)

if (dry) {
  console.log('\n--dry, er is niets aangemaakt.')
  process.exit(0)
}

const doc = await payload.create({ collection: 'stories', data: data as never })
console.log(`\nAangemaakt met id ${doc.id}.`)
console.log(`Bewerken op /admin/collections/stories/${doc.id}`)
process.exit(0)
