/**
 * Zet hetzelfde Bronx-verhaal klaar op de productiedatabase, als concept.
 *
 *   node prod-nieuw-verhaal-bronx.cjs --dry
 *   node prod-nieuw-verhaal-bronx.cjs
 *
 * /verhalen sorteert op publicatiedatum aflopend, dus met de datum van vandaag
 * staat dit verhaal bovenaan zodra het op gepubliceerd gaat.
 *
 * De hero is voorlopig newyork-taxi.webp. Payload eist een hero, dus leeg
 * laten kan niet. Vervangen zodra het echte beeld er is.
 */

const { Client } = require('pg')
const dry = process.argv.includes('--dry')

const SLUG = 'leven-als-een-local-in-the-bronx'
const HERO = 'newyork-taxi.webp'
const THEMAS = ['reisverhalen-routes', 'reisfotografie']
const VELDEN = {
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
              "text": "Aankomen",
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
              "text": "Hoe kwam je er terecht, wat verwachtte je, en wat zag je toen je uitstapte.",
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
              "text": "De buurt",
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
              "text": "Waar sliepen jullie, hoe zag de straat eruit, wie kwam je tegen.",
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
              "text": "Wonen in plaats van bezoeken",
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
              "text": "Boodschappen, de metro, dezelfde gezichten. Wat twee weken anders maakt dan twee dagen.",
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
              "text": "Eten",
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
              "text": "Namen en adressen. Wat je at, wat het kostte, of je terug zou gaan.",
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
              "text": "Niet overslaan. Dit is het stuk dat een verzonnen reisverhaal nooit heeft.",
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
              "text": "Wat ik meenam",
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
              "text": "Waar je nog aan terugdenkt, en wat je een ander zou meegeven.",
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
  "intro": "Twee weken wonen in plaats van bezoeken. Over de buurt, de metro, het eten en wat er verandert als je ergens blijft.",
  "eyebrow": "Twee weken in New York",
  "title": "Leven als een local in The Bronx, New York",
  "seo_meta_title": "Leven als een local in The Bronx, New York",
  "seo_meta_description": "Twee weken wonen in de Bronx in plaats van New York bezoeken. Eigen ervaringen en eigen fotografie."
}

async function main() {
  const db = new Client({ connectionString: process.env.DATABASE_URI })
  await db.connect()
  try {
    const al = await db.query('select id, status from stories where slug = $1', [SLUG])
    if (al.rows.length) {
      console.log(`Bestaat al (id ${al.rows[0].id}, status ${al.rows[0].status}). Niets gedaan.`)
      return
    }
    const h = await db.query('select id from media where filename = $1', [HERO])
    if (!h.rows.length) { console.error(`Hero ${HERO} niet gevonden.`); process.exitCode = 1; return }

    console.log(`titel   ${VELDEN.title}`)
    console.log(`hero    ${HERO} (id ${h.rows[0].id})`)
    if (dry) { console.log('\n--dry, er is niets aangemaakt.'); return }

    await db.query('BEGIN')
    const n = await db.query('select coalesce(max(id),0)+1 as id from stories')
    const id = n.rows[0].id
    await db.query(
      `insert into stories (id, title, slug, eyebrow, hero_image_id, intro, content,
         published_date, werelddeel, seo_meta_title, seo_meta_description, status, updated_at, created_at)
       values ($1,$2,$3,$4,$5,$6,$7, now(), 'north-america', $8, $9, 'draft', now(), now())`,
      [id, VELDEN.title, SLUG, VELDEN.eyebrow, h.rows[0].id, VELDEN.intro,
       JSON.stringify(VELDEN.content), VELDEN.seo_meta_title, VELDEN.seo_meta_description],
    )
    await db.query("select setval(pg_get_serial_sequence('stories','id'), (select max(id) from stories))")
    let o = 0
    for (const t of THEMAS) {
      await db.query('insert into stories_thema ("order", parent_id, value) values ($1,$2,$3)', [o++, id, t])
    }
    await db.query('COMMIT')
    console.log(`\nAangemaakt met id ${id}, status draft.`)
    console.log(`Bewerken op https://meetthelocals.nl/admin/collections/stories/${id}`)
  } catch (e) {
    await db.query('ROLLBACK').catch(() => {})
    console.error('Mislukt, teruggedraaid:', e.message)
    process.exitCode = 1
  } finally { await db.end() }
}
main()
