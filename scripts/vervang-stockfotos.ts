/**
 * Vervangt de Unsplash-stockfoto's op vier bestemmingspagina's door Daley's
 * eigen werk. Die stock sprak de belofte op de over-pagina tegen dat alle
 * beelden zelf gemaakt zijn.
 *
 *   set -a; . ./.env; set +a; npx tsx scripts/vervang-stockfotos.ts
 *
 * Nieuwe beelden gaan via payload.create door de normale uploadpijplijn, dus
 * ze krijgen automatisch credit, EXIF en maatvarianten.
 */

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../src/payload.config'

// Map met de omgezette webp-bestanden. Overschrijf met IMPORT_DIR=... als de
// bestanden ergens anders staan.
const IMPORT_DIR =
  process.env.IMPORT_DIR ??
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../import')

/** Nieuw te importeren beeld, met de tekst die eronder komt te staan. */
const NIEUW = [
  {
    file: 'parijs-eiffeltoren.webp',
    alt: 'Eiffeltoren in Parijs achter een border met rode bloemen',
    caption: 'Champ de Mars, Parijs',
  },
  {
    file: 'parijs-brasserie.webp',
    alt: 'Terras van een Parijse brasserie met gasten en rode details',
    caption: 'Brasserie in het 11e arrondissement, Parijs',
  },
  {
    file: 'parijs-tour-de-france.webp',
    alt: 'Peloton van de Tour de France scherpgetrokken tegen een bewegende achtergrond',
    caption: 'Tour de France, Champs-Élysées, Parijs',
  },
  {
    file: 'newyork-taxi.webp',
    alt: 'Gele taxi in een straat in Manhattan met stoom uit het wegdek',
    caption: 'Midtown Manhattan, New York',
  },
  {
    file: 'newyork-vessel.webp',
    alt: 'The Vessel in Hudson Yards met een kleurrijke muurschildering ernaast',
    caption: 'Hudson Yards, New York',
  },
]

const payload = await getPayload({ config })

// ─── 1. Nieuwe beelden importeren ───
const ids: Record<string, number> = {}
for (const item of NIEUW) {
  const doc = await payload.create({
    collection: 'media',
    data: { alt: item.alt, caption: item.caption },
    filePath: path.join(IMPORT_DIR, item.file),
  })
  ids[item.file] = doc.id as number
  console.log(`geimporteerd  ${item.file.padEnd(28)} id ${doc.id}`)
}

// ─── 2. Bestaand eigen beeld opzoeken voor de hero's ───
async function byFilename(name: string) {
  const { docs } = await payload.find({
    collection: 'media',
    where: { filename: { equals: name } },
    limit: 1,
    depth: 0,
  })
  if (!docs[0]) throw new Error(`media niet gevonden: ${name}`)
  return docs[0].id as number
}

async function destBySlug(slug: string) {
  const { docs } = await payload.find({
    collection: 'destinations',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  if (!docs[0]) throw new Error(`bestemming niet gevonden: ${slug}`)
  return docs[0]
}

const isStock = (v: unknown) => typeof v === 'string' && /unsplash|dall/i.test(v)

/** Vervangt de hero en haalt stock uit de galerij, met nieuwe beelden erachter. */
async function fix(slug: string, heroId: number, extraGallery: number[]) {
  const dest = await destBySlug(slug)

  const bestaand = (dest.gallery ?? []) as { image?: unknown }[]
  const behouden: number[] = []
  for (const g of bestaand) {
    const id = typeof g.image === 'number' ? g.image : (g.image as { id?: number })?.id
    if (!id) continue
    const m = await payload.findByID({ collection: 'media', id, depth: 0 })
    if (isStock(m.filename)) continue
    behouden.push(id)
  }

  const gallery = [...behouden, ...extraGallery].map((image) => ({ image }))

  await payload.update({
    collection: 'destinations',
    id: dest.id,
    data: { heroImage: heroId, gallery },
  })

  console.log(
    `bijgewerkt    ${slug.padEnd(20)} hero ${heroId}  galerij ${bestaand.length} -> ${gallery.length}`,
  )
}

await fix('frankrijk', ids['parijs-eiffeltoren.webp'], [
  ids['parijs-brasserie.webp'],
  ids['parijs-tour-de-france.webp'],
])

await fix('verenigde-staten', await byFilename('newyork-1-scaled.webp'), [
  ids['newyork-taxi.webp'],
  ids['newyork-vessel.webp'],
])

await fix('nederland', await byFilename('veluwe-2712.webp'), [])
await fix('singapore', await byFilename('singapore-2.webp'), [])

console.log('\nKlaar.')
process.exit(0)
