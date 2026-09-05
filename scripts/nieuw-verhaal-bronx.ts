/**
 * Zet het verhaal over de Bronx klaar als concept.
 *
 *   set -a; . ./.env; set +a; npx tsx scripts/nieuw-verhaal-bronx.ts [--dry]
 *
 * Het gaat om een Story, niet om een Post: /verhalen toont alleen de
 * stories-collectie, gesorteerd op publicatiedatum aflopend. De datum staat
 * daarom op vandaag, dus zodra het verhaal op gepubliceerd gaat staat het
 * vanzelf bovenaan, boven het Marokko-verhaal.
 *
 * Blijft bewust op concept: tekst en beeld komen van Daley zelf. Een leeg
 * verhaal live zetten is slechter dan geen verhaal.
 */

import path from 'node:path'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import type { Story } from '../src/payload-types'

const dry = process.argv.includes('--dry')

const SLUG = 'leven-als-een-local-in-the-bronx'
const TIJDELIJKE_HERO = 'newyork-taxi.webp'

const SKELET: [string, string][] = [
  ['Aankomen', 'Hoe kwam je er terecht, wat verwachtte je, en wat zag je toen je uitstapte.'],
  ['De buurt', 'Waar sliepen jullie, hoe zag de straat eruit, wie kwam je tegen.'],
  ['Wonen in plaats van bezoeken', 'Boodschappen, de metro, dezelfde gezichten. Wat twee weken anders maakt dan twee dagen.'],
  ['Eten', 'Namen en adressen. Wat je at, wat het kostte, of je terug zou gaan.'],
  ['Wat tegenviel', 'Niet overslaan. Dit is het stuk dat een verzonnen reisverhaal nooit heeft.'],
  ['Wat ik meenam', 'Waar je nog aan terugdenkt, en wat je een ander zou meegeven.'],
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
  console.log(`Het verhaal bestaat al (id ${bestaat.docs[0].id}). Niets gewijzigd.`)
  process.exit(0)
}

const { docs: media } = await payload.find({
  collection: 'media', where: { filename: { equals: TIJDELIJKE_HERO } }, limit: 1, depth: 0,
})
if (!media[0]) {
  console.error(`Tijdelijke hero ${TIJDELIJKE_HERO} niet gevonden.`)
  process.exit(1)
}

const data = {
  title: 'Leven als een local in The Bronx, New York',
  slug: SLUG,
  eyebrow: 'Twee weken in New York',
  heroImage: media[0].id as number,
  intro:
    'Twee weken wonen in plaats van bezoeken. Over de buurt, de metro, het eten en wat er verandert als je ergens blijft.',
  content: CONTENT,
  publishedDate: new Date().toISOString(),
  werelddeel: 'north-america' as const,
  thema: ['reisverhalen-routes', 'reisfotografie'] as const,
  status: 'draft' as const,
  seo: {
    metaTitle: 'Leven als een local in The Bronx, New York',
    metaDescription:
      'Twee weken wonen in de Bronx in plaats van New York bezoeken. Eigen ervaringen en eigen fotografie.',
  },
}

console.log('Aan te maken verhaal')
console.log(`  titel   ${data.title}`)
console.log(`  slug    ${data.slug}`)
console.log(`  datum   vandaag, dus bovenaan zodra het gepubliceerd is`)
console.log(`  status  ${data.status}`)
console.log(`  hero    ${TIJDELIJKE_HERO}  (tijdelijk)`)
console.log(`  kopjes  ${SKELET.map(([k]) => k).join(' | ')}`)

if (dry) {
  console.log('\n--dry, er is niets aangemaakt.')
  process.exit(0)
}

const doc = await payload.create({ collection: 'stories', data: data as never })
console.log(`\nAangemaakt met id ${doc.id}.`)
console.log(`Bewerken op /admin/collections/stories/${doc.id}`)
process.exit(0)
