/**
 * Herstelt de beeldkoppeling van bestemmingen die bij de WordPress-migratie
 * door elkaar zijn geraakt.
 *
 *   set -a; . ./.env; set +a; npx tsx scripts/herstel-bestemmingsbeeld.ts [--dry]
 *
 * Twee dingen:
 *  1. De Puglia-foto's uit public/media importeren. Die stonden wel op schijf
 *     maar hadden geen enkel media-record, dus ze waren nergens koppelbaar.
 *  2. Bestemmingen herkoppelen waarvoor het juiste beeld al bestaat.
 *
 * Bestemmingen waarvoor Daley geen eigen beeld heeft blijven met opzet
 * ongemoeid: die laten we staan zoals ze zijn.
 */

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const dry = process.argv.includes('--dry')
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const MEDIA_DIR = path.join(ROOT, 'public/media')

/**
 * Puglia-serie, gemaakt in Ceglie Messapica voor Trulli Lupoli.
 *
 * `file` is het bronbestand in public/media, `opgeslagen` de naam die Payload
 * er bij het importeren van maakte. Payload hernoemt namelijk zodra een
 * bestandsnaam al in staticDir bestaat, en dat was hier bij alle 11 het geval.
 */
const PUGLIA: { file: string; opgeslagen: string; alt: string; caption: string }[] = [
  { file: 'trulli-home-1.webp', opgeslagen: 'trulli-home-3.webp', alt: 'Twee trulli met kegeldaken en een terras onder een blauwe lucht', caption: 'Ceglie Messapica, Apulië' },
  { file: 'trulli-home-2.webp', opgeslagen: 'trulli-home-4.webp', alt: 'Stenen terras met tafel en stoelen naast een trullo', caption: 'Ceglie Messapica, Apulië' },
  { file: 'trulli-lupoli-1.webp', opgeslagen: 'trulli-lupoli-31.webp', alt: 'Trullo tussen de bomen in het Apulische landschap', caption: 'Ceglie Messapica, Apulië' },
  { file: 'trulli-lupoli-2.webp', opgeslagen: 'trulli-lupoli-32.webp', alt: 'Twee trulli met een blauwe deur en stenen muur', caption: 'Ceglie Messapica, Apulië' },
  { file: 'trulli-lupoli-3.webp', opgeslagen: 'trulli-lupoli-33.webp', alt: 'Groep trulli met witte kegeldaken en een terras', caption: 'Ceglie Messapica, Apulië' },
  { file: 'trulli-lupoli-4.webp', opgeslagen: 'trulli-lupoli-34.webp', alt: 'Trullo aan het einde van een pad met bomen eromheen', caption: 'Ceglie Messapica, Apulië' },
  { file: 'trulli-lupoli-6.webp', opgeslagen: 'trulli-lupoli-35.webp', alt: 'Oprit met hek en auto naar een trullo tussen de bomen', caption: 'Ceglie Messapica, Apulië' },
  { file: 'trulli-lupoli-7.webp', opgeslagen: 'trulli-lupoli-36.webp', alt: 'Tuin met olijfbomen en droge stenen muurtjes', caption: 'Valle d Itria, Apulië' },
  { file: 'trulli-lupoli-12.webp', opgeslagen: 'trulli-lupoli-37.webp', alt: 'Pergola met tafel en stoelen op een binnenplaats van natuursteen', caption: 'Ceglie Messapica, Apulië' },
  { file: 'trulli-lupoli-14.webp', opgeslagen: 'trulli-lupoli-38.webp', alt: 'Trullo met blauw luik en een terras in de middagzon', caption: 'Ceglie Messapica, Apulië' },
  { file: 'trulli-lupoli-16.webp', opgeslagen: 'trulli-lupoli-39.webp', alt: 'Wit gepleisterd gebouw met blauwe deur en een boom ervoor', caption: 'Ceglie Messapica, Apulië' },
]

/**
 * Per bestemming de nieuwe hero en galerij, op bestandsnaam.
 * Alleen bestemmingen waarvoor het juiste beeld daadwerkelijk bestaat.
 */
const HERSTEL: { slug: string; hero: string; gallery: string[]; waarom: string }[] = [
  {
    slug: 'apulie',
    hero: 'trulli-home-3.webp',
    gallery: ['trulli-lupoli-33.webp', 'trulli-lupoli-32.webp', 'trulli-lupoli-36.webp', 'trulli-lupoli-39.webp', 'trulli-lupoli-37.webp'],
    waarom: 'had Dansenmaloca, dat is de Amazone',
  },
  {
    slug: 'valle-ditria',
    hero: 'trulli-lupoli-31.webp',
    gallery: ['trulli-lupoli-34.webp', 'trulli-lupoli-35.webp', 'trulli-lupoli-38.webp', 'trulli-lupoli-36.webp'],
    waarom: 'had Dansenmaloca, dat is de Amazone',
  },
  {
    slug: 'italie',
    hero: 'como-italia086-correct.webp',
    gallery: ['trulli-home-3.webp', 'trulli-lupoli-33.webp', 'como-italia086-1920.webp'],
    waarom: 'had Kellies Castle uit Maleisie en een luchtfoto uit Ierland',
  },
  {
    slug: 'comomeer',
    hero: 'como-italia086-correct.webp',
    gallery: ['como-italia086-1920.webp', 'como-italia086.webp'],
    waarom: 'galerij had Dansenmaloca, dat is de Amazone',
  },
  {
    slug: 'new-york',
    hero: 'newyork-1-scaled.webp',
    gallery: ['newyork-taxi.webp', 'newyork-vessel.webp'],
    waarom: 'had Dansenmaloca, dat is de Amazone',
  },
  {
    slug: 'java',
    hero: 'image929.webp',
    gallery: ['DJI_20240517152816_0082_D-scaled.webp'],
    waarom: 'had drie keer Dansenmaloca, dat is de Amazone',
  },
  {
    slug: 'indonesie',
    hero: 'DJI_20240517152816_0082_D-scaled.webp',
    gallery: ['image929.webp'],
    waarom: 'galerij had een foto uit Marokko',
  },
  {
    slug: 'cameron-highlands',
    hero: 'Cameronhighlands-1-scaled.webp',
    gallery: ['maleisie-7-scaled.webp'],
    waarom: 'had Dansenmaloca, dat is de Amazone',
  },
  {
    slug: 'langkawi',
    hero: 'langkawi-scaled.webp',
    gallery: ['ombakvilla-scaled.webp'],
    waarom: 'galerij had Dansenmaloca, dat is de Amazone',
  },
  {
    slug: 'bangkok',
    hero: 'bangkok-scaled.webp',
    gallery: ['Ayuthayya-1-2-scaled.webp'],
    waarom: 'galerij had Dansenmaloca, dat is de Amazone',
  },
  {
    slug: 'maleisie',
    hero: 'maleisie-7-scaled.webp',
    gallery: [
      'Batucaves-6-scaled.webp', 'Cameronhighlands-1-scaled.webp', 'langkawi-scaled.webp',
      'Malaysia-1-7-1-scaled.webp', 'maleisie-5-scaled.webp', 'maleisie-6-scaled.webp',
      'ombakvilla-scaled.webp', 'kellys-scaled.webp',
    ],
    waarom: 'Kellies Castle hoort hier, niet bij Italie en Florida',
  },
  {
    slug: 'japan',
    hero: 'Shirakawago-3.webp',
    gallery: [],
    waarom: 'galerij had Franksunset, dat is geen Japan',
  },
]

/**
 * Detailpagina's met een hero die nergens op slaat. De vier Puglia-posts
 * droegen allemaal Kellies Castle uit Maleisie, de vijfde de Amazone.
 *
 * Let op bij locorotondo-wit-en-stil: de Puglia-serie is gemaakt in Ceglie
 * Messapica, niet in Locorotondo zelf. Beide liggen in de Valle d Itria, dus
 * het klopt op streekniveau maar niet op dorpsniveau. Nog altijd beter dan
 * een kasteel in Maleisie, maar vervang het zodra er echt Locorotondo-beeld is.
 */
const POSTS: { slug: string; hero: string; waarom: string }[] = [
  { slug: 'apulie-regio-overzicht', hero: 'trulli-home-3.webp', waarom: 'had Kellies Castle, Maleisie' },
  { slug: 'apulie-leukste-dorpjes', hero: 'trulli-lupoli-39.webp', waarom: 'had Kellies Castle, Maleisie' },
  { slug: 'locorotondo-wit-en-stil', hero: 'trulli-lupoli-32.webp', waarom: 'had Kellies Castle, Maleisie' },
  { slug: 'valle-ditria-trulli-en-olijfbomen', hero: 'trulli-lupoli-36.webp', waarom: 'had Kellies Castle, en dit zijn letterlijk de olijfbomen' },
  { slug: 'Slow-tourism-puglia', hero: 'trulli-lupoli-37.webp', waarom: 'had Dansenmaloca, de Amazone' },
]

/** Verhalen met een hero uit het verkeerde werelddeel. */
const VERHALEN: { slug: string; hero: string; waarom: string }[] = [
  { slug: 'boven-de-wolken-in-de-andes', hero: 'cusco-12-scaled.webp', waarom: 'had een tempelruine uit Ayutthaya, Thailand' },
]

const payload = await getPayload({ config })

async function mediaId(filename: string): Promise<number | null> {
  const { docs } = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
  })
  return docs[0] ? (docs[0].id as number) : null
}

// Puglia importeren
console.log('Puglia-serie')
for (const p of PUGLIA) {
  const bestaat = await mediaId(p.opgeslagen)
  if (bestaat) {
    console.log(`  bestaat al     ${p.file}`)
    continue
  }
  if (dry) {
    console.log(`  zou importeren ${p.file}`)
    continue
  }
  const doc = await payload.create({
    collection: 'media',
    data: { alt: p.alt, caption: p.caption },
    filePath: path.join(MEDIA_DIR, p.file),
  })
  console.log(`  geimporteerd   ${p.file.padEnd(26)} id ${doc.id}`)
}

// Bestemmingen herkoppelen
console.log('\nBestemmingen')
for (const h of HERSTEL) {
  const { docs } = await payload.find({
    collection: 'destinations',
    where: { slug: { equals: h.slug } },
    limit: 1,
    depth: 0,
  })
  const dest = docs[0]
  if (!dest) {
    console.log(`  ${h.slug}: niet gevonden`)
    continue
  }

  const heroId = await mediaId(h.hero)
  if (!heroId) {
    console.log(`  ${h.slug}: hero ${h.hero} ontbreekt, overgeslagen`)
    continue
  }

  const galIds: number[] = []
  for (const f of h.gallery) {
    const id = await mediaId(f)
    if (id) galIds.push(id)
    else console.log(`  ${h.slug}: let op, ${f} ontbreekt`)
  }

  console.log(`  ${h.slug.padEnd(19)} hero ${h.hero.padEnd(32)} galerij ${galIds.length}   ${h.waarom}`)

  if (dry) continue

  await payload.update({
    collection: 'destinations',
    id: dest.id,
    data: { heroImage: heroId, gallery: galIds.map((image) => ({ image })) },
  })
}

// Detailpagina's
for (const [label, lijst, collectie] of [
  ['Blogposts', POSTS, 'posts'],
  ['Verhalen', VERHALEN, 'stories'],
] as const) {
  console.log(`\n${label}`)
  for (const item of lijst) {
    const { docs } = await payload.find({
      collection: collectie,
      where: { slug: { equals: item.slug } },
      limit: 1,
      depth: 0,
    })
    const doc = docs[0]
    if (!doc) {
      console.log(`  ${item.slug}: niet gevonden`)
      continue
    }
    const heroId = await mediaId(item.hero)
    if (!heroId) {
      console.log(`  ${item.slug}: ${item.hero} ontbreekt, overgeslagen`)
      continue
    }
    console.log(`  ${item.slug.padEnd(36)} ${item.hero.padEnd(26)} ${item.waarom}`)
    if (dry) continue
    await payload.update({ collection: collectie, id: doc.id, data: { heroImage: heroId } })
  }
}

// Controle: waar staat de Amazone-foto nog?
const amazone = await mediaId('Dansenmaloca-scaled.webp')
if (amazone) {
  const { docs: nog } = await payload.find({
    collection: 'destinations',
    where: { or: [{ heroImage: { equals: amazone } }, { 'gallery.image': { equals: amazone } }] },
    limit: 100,
    depth: 0,
  })
  console.log(
    `\nDansenmaloca (Amazone) staat nog bij ${nog.length} bestemming(en): ` +
      nog.map((d) => d.slug).join(', '),
  )
}

if (dry) console.log('\n--dry, er is niets gewijzigd.')
process.exit(0)
