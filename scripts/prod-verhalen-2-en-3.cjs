/**
 * GEGENEREERD. Zet de twee extra Bronx-opvolgers als concept op productie:
 * het Iquitos-verhaal en de Vietnamese scootertocht.
 *
 *   node prod-verhalen-2-en-3.cjs --dry
 *   node prod-verhalen-2-en-3.cjs
 *
 * Datums worden relatief gezet ten opzichte van vandaag, zodat de volgorde
 * op /verhalen gelijk blijft aan lokaal: Bronx, Iquitos, Vietnam.
 */

const { Client } = require('pg')
const dry = process.argv.includes('--dry')

const MEDIA = {
  "filename": "vietnam-scooters.webp",
  "alt": "Scooters in de schemering op een kruispunt in Hanoi, met bewegingsonscherpte",
  "caption": "Oude wijk, Hanoi",
  "width": 1920,
  "height": 1281,
  "mime_type": "image/webp",
  "filesize": 411672,
  "url": "https://fsn1.your-objectstorage.com/meetthelocals-media/vietnam-scooters.webp",
  "camera": "NIKON D5300",
  "lens": "10.0-20.0 mm f/4.0-5.6",
  "aperture": "f/4",
  "shutter": "1/30s",
  "iso": "4000",
  "focal": "10mm"
}

const VERHALEN = [
  {
    "slug": "opvangcentrum-wilde-dieren-jungle-iquitos",
    "title": "Een opvangcentrum voor wilde dieren midden in de jungle van Iquitos, Peru",
    "eyebrow": "Amazonegebied, Peru",
    "intro": "Over de rivier vanaf Iquitos, naar een plek waar dieren terechtkomen die nergens anders heen kunnen. Wat het is, wat het kost en of het helpt.",
    "content": {
      "root": {
        "type": "root",
        "format": "",
        "indent": 0,
        "version": 1,
        "children": [
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Dit verhaal staat klaar maar is nog niet geschreven. De kopjes geven de structuur; de tekst en de beelden komen van Daley zelf.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 2,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Hoe je er komt",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Vanaf Iquitos over de rivier. Hoe lang, waarmee, wat het kostte.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 2,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Het centrum",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Wie runt het, hoe groot is het, waar leven ze van.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 2,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "De dieren",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Welke soorten, waar komen ze vandaan, wat gebeurt er met ze.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 2,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Wat je er doet",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Meehelpen of kijken. Wat werd er van je verwacht.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 2,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Wat tegenviel",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Niet overslaan. Ook: is dit soort opvang wel goed voor de dieren.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 2,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Zou je het aanraden",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Voor wie wel, voor wie niet, en waar je op moet letten bij het kiezen van een centrum.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 2,
                "version": 1
              }
            ],
            "direction": "ltr"
          }
        ],
        "direction": "ltr"
      }
    },
    "werelddeel": "south-america",
    "seo_meta_title": "Opvangcentrum voor wilde dieren in de jungle bij Iquitos, Peru",
    "seo_meta_description": "Een opvangcentrum voor wilde dieren in het Amazonegebied bij Iquitos. Eigen ervaring, eigen fotografie.",
    "dagen_terug": 1,
    "hero": "Dansenmaloca-scaled.webp",
    "themas": [
      "reisverhalen-routes",
      "natuur-buiten"
    ]
  },
  {
    "slug": "scootertocht-ho-chi-minh-mekong-delta",
    "title": "“Dit doen zelfs Vietnamezen niet”: een scootertocht van Ho Chi Minh naar de Mekong Delta",
    "eyebrow": "Zuid-Vietnam op twee wielen",
    "intro": "Op een geleende scooter de stad uit, richting de Mekong Delta. Over het verkeer, de route, wat het kostte en waarom iedereen zei dat het een slecht plan was.",
    "content": {
      "root": {
        "type": "root",
        "format": "",
        "indent": 0,
        "version": 1,
        "children": [
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Dit verhaal staat klaar maar is nog niet geschreven. De kopjes geven de structuur; de tekst en de beelden komen van Daley zelf.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 2,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Het idee",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Waarom een scooter en niet de bus. Wat zeiden mensen erover, en waar komt die titel vandaan.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 2,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "De scooter",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Waar geregeld, wat het kostte, rijbewijs en verzekering, in welke staat hij was.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 2,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "De weg uit",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Ho Chi Minh uit rijden. Het verkeer, de eerste uren, wanneer het rustiger werd.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 2,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "De Delta",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Wat je zag, waar je sliep, wie je tegenkwam.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 2,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Wat tegenviel",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Niet overslaan. Pech, regen, verdwalen, en of het gevaarlijk was.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 2,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "tag": "h2",
            "type": "heading",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Zou je het aanraden",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 0,
                "version": 1
              }
            ],
            "direction": "ltr"
          },
          {
            "type": "paragraph",
            "format": "",
            "indent": 0,
            "version": 1,
            "children": [
              {
                "mode": "normal",
                "text": "Voor wie wel en voor wie niet, en wat je zelf anders zou doen.",
                "type": "text",
                "style": "",
                "detail": 0,
                "format": 2,
                "version": 1
              }
            ],
            "direction": "ltr"
          }
        ],
        "direction": "ltr"
      }
    },
    "werelddeel": "asia",
    "seo_meta_title": "Met de scooter van Ho Chi Minh naar de Mekong Delta",
    "seo_meta_description": "Een scootertocht van Ho Chi Minh City naar de Mekong Delta: route, kosten, verkeer en of het een goed idee is. Eigen ervaring en fotografie.",
    "dagen_terug": 2,
    "hero": "vietnam-scooters.webp",
    "themas": [
      "reisverhalen-routes",
      "reistips-praktisch"
    ]
  }
]

async function main() {
  const db = new Client({ connectionString: process.env.DATABASE_URI })
  await db.connect()
  try {
    await db.query('BEGIN')

    // Beeld dat lokaal wel maar op productie nog niet bestaat.
    let mediaId = null
    const bm = await db.query('select id from media where filename = $1', [MEDIA.filename])
    if (bm.rows.length) {
      mediaId = bm.rows[0].id
      console.log('beeld bestaat al  ' + MEDIA.filename)
    } else if (!dry) {
      const n = await db.query('select coalesce(max(id),0)+1 as id from media')
      mediaId = n.rows[0].id
      await db.query(
        `insert into media (id, alt, caption, filename, mime_type, filesize, width, height, url,
           exif_camera, exif_lens, exif_aperture, exif_shutter_speed, exif_iso, exif_focal_length,
           updated_at, created_at)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15, now(), now())`,
        [mediaId, MEDIA.alt, MEDIA.caption, MEDIA.filename, MEDIA.mime_type, MEDIA.filesize,
         MEDIA.width, MEDIA.height, MEDIA.url, MEDIA.camera, MEDIA.lens, MEDIA.aperture,
         MEDIA.shutter, MEDIA.iso, MEDIA.focal],
      )
      await db.query("select setval(pg_get_serial_sequence('media','id'), (select max(id) from media))")
      console.log('beeld aangemaakt  ' + MEDIA.filename + '  id ' + mediaId)
    } else {
      console.log('zou beeld aanmaken  ' + MEDIA.filename)
    }

    for (const v of VERHALEN) {
      const al = await db.query('select id from stories where slug = $1', [v.slug])
      if (al.rows.length) { console.log('bestaat al        ' + v.slug); continue }

      const h = await db.query('select id from media where filename = $1', [v.hero])
      const heroId = h.rows.length ? h.rows[0].id : mediaId
      console.log((dry ? 'zou aanmaken      ' : 'aanmaken          ') + v.slug + '   ' + v.dagen_terug + ' dagen terug')
      if (dry) continue

      const n = await db.query('select coalesce(max(id),0)+1 as id from stories')
      const id = n.rows[0].id
      await db.query(
        `insert into stories (id, title, slug, eyebrow, hero_image_id, intro, content,
           published_date, werelddeel, seo_meta_title, seo_meta_description, status, updated_at, created_at)
         values ($1,$2,$3,$4,$5,$6,$7, now() - ($8 || ' days')::interval, $9, $10, $11, 'draft', now(), now())`,
        [id, v.title, v.slug, v.eyebrow, heroId, v.intro, JSON.stringify(v.content),
         String(v.dagen_terug), v.werelddeel, v.seo_meta_title, v.seo_meta_description],
      )
      await db.query("select setval(pg_get_serial_sequence('stories','id'), (select max(id) from stories))")
      let o = 0
      for (const t of (v.themas || [])) {
        await db.query('insert into stories_thema ("order", parent_id, value) values ($1,$2,$3)', [o++, id, t])
      }
      console.log('                  id ' + id + ', status draft')
    }

    if (dry) { await db.query('ROLLBACK'); console.log('\n--dry, er is niets gewijzigd.') }
    else { await db.query('COMMIT'); console.log('\nDoorgevoerd.') }
  } catch (e) {
    await db.query('ROLLBACK').catch(() => {})
    console.error('Mislukt, teruggedraaid:', e.message)
    process.exitCode = 1
  } finally { await db.end() }
}
main()
