/**
 * Zet het verhaal over het opvangcentrum bij Iquitos klaar als concept.
 *
 *   set -a; . ./.env; set +a; npx tsx scripts/nieuw-verhaal-iquitos.ts [--dry]
 *
 * Komt na het Bronx-verhaal in de lijst: /verhalen sorteert op
 * publicatiedatum aflopend, dus de datum staat één dag vóór die van Bronx.
 * Zo staat Bronx eerste en dit tweede, boven Marokko.
 *
 * Hero is Dansenmaloca: avondlicht over de Amazone-rivier. Dat is de juiste
 * streek, want Iquitos ligt in het Amazonegebied. Er is geen enkele foto van
 * een opvangcentrum of van dieren, dus dit blijft een tijdelijke hero.
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'
import type { Story } from '../src/payload-types'

const dry = process.argv.includes('--dry')

const SLUG = 'opvangcentrum-wilde-dieren-jungle-iquitos'
const HERO = 'Dansenmaloca-scaled.webp'

const SKELET: [string, string][] = [
  ['Hoe je er komt', 'Vanaf Iquitos over de rivier. Hoe lang, waarmee, wat het kostte.'],
  ['Het centrum', 'Wie runt het, hoe groot is het, waar leven ze van.'],
  ['De dieren', 'Welke soorten, waar komen ze vandaan, wat gebeurt er met ze.'],
  ['Wat je er doet', 'Meehelpen of kijken. Wat werd er van je verwacht.'],
  ['Wat tegenviel', 'Niet overslaan. Ook: is dit soort opvang wel goed voor de dieren.'],
  ['Zou je het aanraden', 'Voor wie wel, voor wie niet, en waar je op moet letten bij het kiezen van een centrum.'],
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

// Eén dag vóór vandaag, zodat dit verhaal onder Bronx staat maar boven Marokko.
const datum = new Date()
datum.setDate(datum.getDate() - 1)

const data = {
  title: 'Een opvangcentrum voor wilde dieren midden in de jungle van Iquitos, Peru',
  slug: SLUG,
  eyebrow: 'Amazonegebied, Peru',
  heroImage: media[0].id as number,
  intro:
    'Over de rivier vanaf Iquitos, naar een plek waar dieren terechtkomen die nergens anders heen kunnen. Wat het is, wat het kost en of het helpt.',
  content: CONTENT,
  publishedDate: datum.toISOString(),
  werelddeel: 'south-america' as const,
  thema: ['reisverhalen-routes', 'natuur-buiten'] as const,
  status: 'draft' as const,
  seo: {
    metaTitle: 'Opvangcentrum voor wilde dieren in de jungle bij Iquitos, Peru',
    metaDescription:
      'Een opvangcentrum voor wilde dieren in het Amazonegebied bij Iquitos. Eigen ervaring, eigen fotografie.',
  },
}

console.log('Aan te maken verhaal')
console.log(`  titel   ${data.title}`)
console.log(`  slug    ${data.slug}`)
console.log(`  datum   ${datum.toISOString().slice(0, 10)}  (tweede in de lijst, onder Bronx)`)
console.log(`  hero    ${HERO}  (Amazone, juiste streek, maar geen opvangcentrum)`)
console.log(`  kopjes  ${SKELET.map(([k]) => k).join(' | ')}`)

if (dry) {
  console.log('\n--dry, er is niets aangemaakt.')
  process.exit(0)
}

const doc = await payload.create({ collection: 'stories', data: data as never })
console.log(`\nAangemaakt met id ${doc.id}.`)
console.log(`Bewerken op /admin/collections/stories/${doc.id}`)
process.exit(0)
