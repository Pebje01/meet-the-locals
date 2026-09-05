/**
 * Leest de lokale eindstand en schrijft daar een productiescript uit.
 *
 *   set -a; . ./.env; set +a; npx tsx scripts/maak-prod-script.ts
 *
 * Nodig omdat inhoud niet meereist met een deploy: lokaal en productie hebben
 * elk een eigen database. De beelden staan wel al in de gedeelde S3-bucket.
 *
 * Het gegenereerde script matcht op bestandsnaam en slug, nooit op id, want
 * de id's verschillen per database.
 */

import path from 'node:path'
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

/** Alles wat deze sessie is aangeraakt. */
const DESTINATIONS = [
  'apulie', 'valle-ditria', 'italie', 'comomeer', 'new-york', 'java', 'indonesie',
  'cameron-highlands', 'langkawi', 'bangkok', 'maleisie', 'japan',
]
const POSTS = [
  'apulie-regio-overzicht', 'apulie-leukste-dorpjes', 'locorotondo-wit-en-stil',
  'valle-ditria-trulli-en-olijfbomen', 'Slow-tourism-puglia',
]
const STORIES = ['boven-de-wolken-in-de-andes']

const payload = await getPayload({ config })

type MediaLite = {
  filename: string
  alt: string
  caption: string | null
  width: number | null
  height: number | null
  mimeType: string | null
  filesize: number | null
  url: string | null
  exif: Record<string, unknown> | null
}

const nodig = new Map<string, MediaLite>()

async function mediaById(id: number) {
  const m = await payload.findByID({ collection: 'media', id, depth: 0 })
  if (m.filename && !nodig.has(m.filename)) {
    nodig.set(m.filename, {
      filename: m.filename,
      alt: m.alt,
      caption: m.caption ?? null,
      width: m.width ?? null,
      height: m.height ?? null,
      mimeType: m.mimeType ?? null,
      filesize: m.filesize ?? null,
      url: m.url ?? null,
      exif: (m.exif as Record<string, unknown>) ?? null,
    })
  }
  return m.filename
}

async function heroEnGalerij(collection: 'destinations' | 'posts' | 'stories', slug: string) {
  const { docs } = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  const doc = docs[0]
  if (!doc) return null

  const heroId = doc.heroImage as number | null
  const hero = (heroId ? await mediaById(heroId) : null) ?? null

  const gallery: string[] = []
  if (collection === 'destinations') {
    for (const g of ((doc as { gallery?: { image?: number }[] }).gallery ?? [])) {
      if (typeof g.image === 'number') {
        const fn = await mediaById(g.image)
        if (fn) gallery.push(fn)
      }
    }
  }
  return { slug, hero, gallery }
}

const plan = {
  destinations: [] as { slug: string; hero: string | null; gallery: string[] }[],
  posts: [] as { slug: string; hero: string | null }[],
  stories: [] as { slug: string; hero: string | null }[],
}

for (const s of DESTINATIONS) {
  const r = await heroEnGalerij('destinations', s)
  if (r) plan.destinations.push(r)
}
for (const s of POSTS) {
  const r = await heroEnGalerij('posts', s)
  if (r) plan.posts.push({ slug: r.slug, hero: r.hero })
}
for (const s of STORIES) {
  const r = await heroEnGalerij('stories', s)
  if (r) plan.stories.push({ slug: r.slug, hero: r.hero })
}

const uit = `/**
 * GEGENEREERD door scripts/maak-prod-script.ts. Niet met de hand aanpassen.
 *
 * Zet de beeldkoppeling van bestemmingen, blogposts en verhalen op productie
 * gelijk aan lokaal. De beelden staan al in de gedeelde S3-bucket; alleen de
 * koppeling zit in de database en die is per omgeving.
 *
 *   node prod-herstel-beeld.cjs --dry
 *   node prod-herstel-beeld.cjs
 */

const { Client } = require('pg')
const dry = process.argv.includes('--dry')

const MEDIA = ${JSON.stringify([...nodig.values()], null, 2)}

const PLAN = ${JSON.stringify(plan, null, 2)}

async function main() {
  const db = new Client({ connectionString: process.env.DATABASE_URI })
  await db.connect()
  try {
    if (!dry) await db.query('BEGIN')

    // Ontbrekende media-records aanmaken. Matchen op bestandsnaam, want de
    // id's lopen niet gelijk tussen lokaal en productie.
    const ids = {}
    for (const m of MEDIA) {
      const r = await db.query('select id from media where filename = $1', [m.filename])
      if (r.rows.length) { ids[m.filename] = r.rows[0].id; continue }
      if (dry) { console.log('zou aanmaken  ' + m.filename); continue }
      const next = await db.query('select coalesce(max(id),0)+1 as id from media')
      const id = next.rows[0].id
      const e = m.exif || {}
      await db.query(
        \`insert into media (id, alt, caption, filename, mime_type, filesize, width, height, url,
            exif_camera, exif_lens, exif_aperture, exif_shutter_speed, exif_iso, exif_focal_length,
            updated_at, created_at)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15, now(), now())\`,
        [id, m.alt, m.caption, m.filename, m.mimeType || 'image/webp', m.filesize || 0,
         m.width, m.height, m.url, e.camera || null, e.lens || null, e.aperture || null,
         e.shutterSpeed || null, e.iso || null, e.focalLength || null],
      )
      ids[m.filename] = id
      console.log('aangemaakt    ' + m.filename + '  id ' + id)
    }
    if (!dry) {
      await db.query("select setval(pg_get_serial_sequence('media','id'), (select max(id) from media))")
    }

    const idVan = async (fn) => {
      if (ids[fn]) return ids[fn]
      const r = await db.query('select id from media where filename = $1', [fn])
      return r.rows.length ? r.rows[0].id : null
    }

    // Bestemmingen: hero en galerij
    for (const d of PLAN.destinations) {
      const row = await db.query('select id from destinations where slug = $1', [d.slug])
      if (!row.rows.length) { console.log('overgeslagen  ' + d.slug); continue }
      const destId = row.rows[0].id
      const heroId = d.hero ? await idVan(d.hero) : null
      const galIds = []
      for (const fn of d.gallery) { const i = await idVan(fn); if (i) galIds.push(i) }
      console.log(d.slug.padEnd(20) + 'hero ' + (d.hero || '-') + '  galerij ' + galIds.length)
      if (dry) continue
      if (heroId) await db.query('update destinations set hero_image_id=$1 where id=$2', [heroId, destId])
      await db.query('delete from destinations_gallery where _parent_id = $1', [destId])
      let o = 0
      for (const i of galIds) {
        o += 1
        await db.query(
          'insert into destinations_gallery (_parent_id, _order, id, image_id) values ($1,$2,gen_random_uuid()::text,$3)',
          [destId, o, i],
        )
      }
    }

    // Blogposts en verhalen: alleen de hero
    for (const [tabel, lijst] of [['posts', PLAN.posts], ['stories', PLAN.stories]]) {
      for (const p of lijst) {
        const row = await db.query('select id from ' + tabel + ' where slug = $1', [p.slug])
        if (!row.rows.length) { console.log('overgeslagen  ' + p.slug); continue }
        const heroId = p.hero ? await idVan(p.hero) : null
        console.log(p.slug.padEnd(36) + (p.hero || '-'))
        if (dry || !heroId) continue
        await db.query('update ' + tabel + ' set hero_image_id=$1 where id=$2', [heroId, row.rows[0].id])
      }
    }

    if (dry) { console.log('\\n--dry, er is niets gewijzigd.') }
    else { await db.query('COMMIT'); console.log('\\nDoorgevoerd.') }
  } catch (err) {
    if (!dry) await db.query('ROLLBACK').catch(() => {})
    console.error('Mislukt, teruggedraaid:', err.message)
    process.exitCode = 1
  } finally {
    await db.end()
  }
}

main()
`

await writeFile(path.join(ROOT, 'scripts/prod-herstel-beeld.cjs'), uit)
console.log(`Geschreven: scripts/prod-herstel-beeld.cjs`)
console.log(`  media-records nodig : ${nodig.size}`)
console.log(`  bestemmingen        : ${plan.destinations.length}`)
console.log(`  blogposts           : ${plan.posts.length}`)
console.log(`  verhalen            : ${plan.stories.length}`)
process.exit(0)
