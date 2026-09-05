/**
 * Doet op de productiedatabase hetzelfde als scripts/vervang-stockfotos.ts
 * lokaal deed: de Unsplash-stock van vier bestemmingspagina's vervangen door
 * Daley's eigen werk.
 *
 * De beelden staan al in de S3-bucket, want die is gedeeld. Alleen de
 * koppeling tussen bestemming en beeld zit in de database, en productie heeft
 * zijn eigen database. Vandaar dit aparte script.
 *
 * Draaien op de server (zie CLAUDE.md):
 *   ssh root@178.104.41.26 "docker cp prod-vervang-stockfotos.cjs <id>:/app/ && \
 *     docker exec -w /app <id> node prod-vervang-stockfotos.cjs"
 *
 * Eerst kijken zonder te wijzigen:  node prod-vervang-stockfotos.cjs --dry
 *
 * .cjs omdat package.json op "type": "module" staat.
 */

const { Client } = require('pg')

const dry = process.argv.includes('--dry')

/** De beelden die lokaal zijn geimporteerd en al in de bucket staan. */
const NIEUW = [
  {
    filename: 'parijs-eiffeltoren.webp',
    alt: 'Eiffeltoren in Parijs achter een border met rode bloemen',
    caption: 'Champ de Mars, Parijs',
    width: 1920,
    height: 1280,
    camera: 'NIKON D5300',
    lens: '35.0 mm f/1.8',
    aperture: 'f/4',
    shutterSpeed: '1/1000s',
    iso: '100',
    focalLength: '35mm',
  },
  {
    filename: 'parijs-brasserie.webp',
    alt: 'Terras van een Parijse brasserie met gasten en rode details',
    caption: 'Brasserie in het 11e arrondissement, Parijs',
    width: 1920,
    height: 1280,
    camera: 'NIKON D5300',
    lens: '35.0 mm f/1.8',
    aperture: 'f/1.8',
    shutterSpeed: '1/3200s',
    iso: '100',
    focalLength: '35mm',
  },
  {
    filename: 'parijs-tour-de-france.webp',
    alt: 'Peloton van de Tour de France scherpgetrokken tegen een bewegende achtergrond',
    caption: 'Tour de France, Champs-Élysées, Parijs',
    width: 1920,
    height: 1280,
    camera: 'NIKON D5300',
    lens: '35.0 mm f/1.8',
    aperture: 'f/4.5',
    shutterSpeed: '1/40s',
    iso: '160',
    focalLength: '35mm',
  },
  {
    filename: 'newyork-taxi.webp',
    alt: 'Gele taxi in een straat in Manhattan met stoom uit het wegdek',
    caption: 'Midtown Manhattan, New York',
    width: 1920,
    height: 1278,
    camera: 'NIKON D780',
    lens: 'VR 15-30mm f/2.8G',
    aperture: 'f/4.5',
    shutterSpeed: '1/60s',
    iso: '50',
    focalLength: '15mm',
  },
  {
    filename: 'newyork-vessel.webp',
    alt: 'The Vessel in Hudson Yards met een kleurrijke muurschildering ernaast',
    caption: 'Hudson Yards, New York',
    width: 1920,
    height: 1278,
    camera: 'NIKON D780',
    lens: 'VR 15-30mm f/2.8G',
    aperture: 'f/14',
    shutterSpeed: '1/320s',
    iso: '80',
    focalLength: '15mm',
  },
]

/** Per bestemming: welk beeld de hero wordt, en wat er in de galerij komt. */
const PLAN = [
  { slug: 'frankrijk', hero: 'parijs-eiffeltoren.webp', extra: ['parijs-brasserie.webp', 'parijs-tour-de-france.webp'] },
  { slug: 'verenigde-staten', hero: 'newyork-1-scaled.webp', extra: ['newyork-taxi.webp', 'newyork-vessel.webp'] },
  { slug: 'nederland', hero: 'veluwe-2712.webp', extra: [] },
  { slug: 'singapore', hero: 'singapore-2.webp', extra: [] },
]

const IS_STOCK = /unsplash|dall/i

async function main() {
  const db = new Client({ connectionString: process.env.DATABASE_URI })
  await db.connect()

  try {
    if (!dry) await db.query('BEGIN')

    // ─── 1. Media-records aanmaken voor beelden die er nog niet zijn ───
    const ids = {}
    for (const m of NIEUW) {
      const found = await db.query('select id from media where filename = $1', [m.filename])
      if (found.rows.length) {
        ids[m.filename] = found.rows[0].id
        console.log(`bestaat al    ${m.filename.padEnd(30)} id ${found.rows[0].id}`)
        continue
      }

      if (dry) {
        console.log(`zou aanmaken  ${m.filename}`)
        continue
      }

      const next = await db.query('select coalesce(max(id), 0) + 1 as id from media')
      const id = next.rows[0].id
      await db.query(
        `insert into media
           (id, alt, caption, filename, mime_type, filesize, width, height, url,
            exif_camera, exif_lens, exif_aperture, exif_shutter_speed, exif_iso, exif_focal_length,
            updated_at, created_at)
         values ($1,$2,$3,$4,'image/webp',0,$5,$6,$7,$8,$9,$10,$11,$12,$13, now(), now())`,
        [
          id, m.alt, m.caption, m.filename, m.width, m.height,
          `https://fsn1.your-objectstorage.com/meetthelocals-media/${m.filename}`,
          m.camera, m.lens, m.aperture, m.shutterSpeed, m.iso, m.focalLength,
        ],
      )
      ids[m.filename] = id
      console.log(`aangemaakt    ${m.filename.padEnd(30)} id ${id}`)
    }

    if (!dry) {
      await db.query(`select setval(pg_get_serial_sequence('media','id'), (select max(id) from media))`)
    }

    // ─── 2. Bestemmingen omzetten ───
    for (const p of PLAN) {
      const d = await db.query('select id, name from destinations where slug = $1', [p.slug])
      if (!d.rows.length) {
        console.log(`overgeslagen  ${p.slug}: bestemming niet gevonden`)
        continue
      }
      const destId = d.rows[0].id

      const heroRow = await db.query('select id from media where filename = $1', [p.hero])
      if (!heroRow.rows.length) {
        console.log(`overgeslagen  ${p.slug}: hero ${p.hero} niet in media`)
        continue
      }
      const heroId = heroRow.rows[0].id

      const gal = await db.query(
        `select g.id, g._order, m.filename
           from destinations_gallery g join media m on m.id = g.image_id
          where g._parent_id = $1 order by g._order`,
        [destId],
      )
      const stock = gal.rows.filter((r) => IS_STOCK.test(r.filename))

      console.log(
        `${p.slug.padEnd(18)} hero -> ${p.hero.padEnd(26)} stock in galerij: ${stock.length}`,
      )

      if (dry) continue

      await db.query('update destinations set hero_image_id = $1 where id = $2', [heroId, destId])

      if (stock.length) {
        await db.query(
          `delete from destinations_gallery where id = any($1::int[])`,
          [stock.map((r) => r.id)],
        )
      }

      let order = Number(
        (await db.query('select coalesce(max(_order), 0) as o from destinations_gallery where _parent_id = $1', [destId])).rows[0].o,
      )
      for (const filename of p.extra) {
        const mid = ids[filename]
        if (!mid) continue
        order += 1
        await db.query(
          `insert into destinations_gallery (_parent_id, _order, id, image_id)
           values ($1, $2, gen_random_uuid()::text, $3)`,
          [destId, order, mid],
        )
      }
    }

    // ─── 3. Controle ───
    const rest = await db.query(
      `select d.slug, m.filename
         from destinations d join media m on m.id = d.hero_image_id
        where m.filename ~* 'unsplash|dall'
        union all
       select d.slug, m.filename
         from destinations_gallery g
         join media m on m.id = g.image_id
         join destinations d on d.id = g._parent_id
        where m.filename ~* 'unsplash|dall'`,
    )
    console.log(
      rest.rows.length
        ? `\nLET OP: nog stock in gebruik:\n${rest.rows.map((r) => `  ${r.slug}: ${r.filename}`).join('\n')}`
        : '\nGeen stockfoto meer in gebruik.',
    )

    if (dry) {
      console.log('\n--dry, er is niets gewijzigd.')
    } else {
      await db.query('COMMIT')
      console.log('Doorgevoerd.')
    }
  } catch (err) {
    if (!dry) await db.query('ROLLBACK').catch(() => {})
    console.error('Mislukt, teruggedraaid:', err.message)
    process.exitCode = 1
  } finally {
    await db.end()
  }
}

main()
