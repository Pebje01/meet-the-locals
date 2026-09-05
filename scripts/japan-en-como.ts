/**
 * Vult Japan met echte foto's en haalt de gekantelde Como-beelden weg.
 *
 *   set -a; . ./.env; set +a; IMPORT_DIR=... npx tsx scripts/japan-en-como.ts [--dry]
 *
 * Japan had één foto en een lege galerij. Van de Comomeer-serie stonden er
 * twee 90 graden gedraaid in de galerij: como-italia086-1920 en
 * como-italia086. Alleen como-italia086-correct staat rechtop, en die naam
 * zei dat eigenlijk al.
 */

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const dry = process.argv.includes('--dry')
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const IMPORT_DIR = process.env.IMPORT_DIR ?? path.join(ROOT, 'import-japan')

const JAPAN = [
  { file: 'japan-fuji-chureito.webp', alt: 'De Chureito-pagode met de berg Fuji op de achtergrond', caption: 'Chureito-pagode, Fujiyoshida' },
  { file: 'japan-fuji-drone.webp', alt: 'De berg Fuji boven het Kawaguchiko-meer, gezien vanuit de lucht', caption: 'Kawaguchiko, Yamanashi' },
  { file: 'japan-shirakawago-winter.webp', alt: 'Het dorp Shirakawa-go in de sneeuw, gezien vanuit de lucht', caption: 'Shirakawa-go, Gifu' },
  { file: 'japan-shirakawago-daken.webp', alt: 'Rieten daken van Shirakawa-go onder een laag sneeuw', caption: 'Shirakawa-go, Gifu' },
  { file: 'japan-nara-hert.webp', alt: 'Een hert bij een informatiebord in het park van Nara', caption: 'Nara-park, Nara' },
  { file: 'japan-tokyo-rivier.webp', alt: 'Gebouwen langs de Sumida-rivier in Tokio met een rondvaartboot', caption: 'Sumida, Tokio' },
  { file: 'japan-tokyo-uitzicht.webp', alt: 'Bezoekers bij het raam met uitzicht over Tokio', caption: 'Tokyo Skytree, Tokio' },
  { file: 'japan-kersenbloesem.webp', alt: 'Bruidspaar onder bloeiende kersenbomen in het park', caption: 'Shioiri-park, Tokio' },
]

const payload = await getPayload({ config })

async function mediaId(filename: string) {
  const { docs } = await payload.find({
    collection: 'media', where: { filename: { equals: filename } }, limit: 1, depth: 0,
  })
  return docs[0] ? (docs[0].id as number) : null
}

async function destId(slug: string) {
  const { docs } = await payload.find({
    collection: 'destinations', where: { slug: { equals: slug } }, limit: 1, depth: 0,
  })
  return docs[0] ? (docs[0].id as number) : null
}

console.log('Japan importeren')
for (const j of JAPAN) {
  if (await mediaId(j.file)) { console.log(`  bestaat al     ${j.file}`); continue }
  if (dry) { console.log(`  zou importeren ${j.file}`); continue }
  const doc = await payload.create({
    collection: 'media',
    data: { alt: j.alt, caption: j.caption },
    filePath: path.join(IMPORT_DIR, j.file),
  })
  console.log(`  geimporteerd   ${j.file.padEnd(32)} id ${doc.id}`)
}

const PLAN: { slug: string; hero: string; gallery: string[]; waarom: string }[] = [
  {
    slug: 'japan',
    hero: 'japan-fuji-chureito.webp',
    gallery: [
      'japan-fuji-drone.webp', 'japan-shirakawago-winter.webp', 'japan-shirakawago-daken.webp',
      'japan-nara-hert.webp', 'japan-tokyo-rivier.webp', 'japan-tokyo-uitzicht.webp',
      'japan-kersenbloesem.webp',
    ],
    waarom: 'had een lege galerij',
  },
  {
    slug: 'comomeer',
    hero: 'como-italia086-correct.webp',
    gallery: [],
    waarom: 'galerij had twee gekantelde beelden',
  },
  {
    slug: 'italie',
    hero: 'como-italia086-correct.webp',
    gallery: ['trulli-home-3.webp', 'trulli-lupoli-33.webp'],
    waarom: 'galerij had een gekanteld Como-beeld',
  },
  {
    slug: 'lombardije',
    hero: 'como-italia086-correct.webp',
    gallery: [],
    waarom: 'controle, hero was al goed',
  },
]

console.log('\nBestemmingen')
for (const p of PLAN) {
  const id = await destId(p.slug)
  if (!id) { console.log(`  ${p.slug}: niet gevonden`); continue }
  const heroId = await mediaId(p.hero)
  if (!heroId) { console.log(`  ${p.slug}: hero ontbreekt, overgeslagen`); continue }
  const gal: number[] = []
  for (const f of p.gallery) {
    const g = await mediaId(f)
    if (g) gal.push(g)
    else console.log(`  ${p.slug}: let op, ${f} ontbreekt`)
  }
  console.log(`  ${p.slug.padEnd(14)} hero ${p.hero.padEnd(30)} galerij ${gal.length}   ${p.waarom}`)
  if (dry) continue
  await payload.update({
    collection: 'destinations',
    id,
    data: { heroImage: heroId, gallery: gal.map((image) => ({ image })) },
  })
}

// Controle: staan de gekantelde beelden nergens meer?
console.log('\nControle gekantelde Como-beelden')
for (const f of ['como-italia086-1920.webp', 'como-italia086.webp']) {
  const id = await mediaId(f)
  if (!id) { console.log(`  ${f}: niet in de bibliotheek`); continue }
  const { docs } = await payload.find({
    collection: 'destinations',
    where: { or: [{ heroImage: { equals: id } }, { 'gallery.image': { equals: id } }] },
    limit: 50, depth: 0,
  })
  console.log(`  ${f.padEnd(30)} nog in gebruik bij: ${docs.length ? docs.map((d) => d.slug).join(', ') : 'nergens'}`)
}

if (dry) console.log('\n--dry, er is niets gewijzigd.')
process.exit(0)
