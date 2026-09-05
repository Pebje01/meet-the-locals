/**
 * Zet dezelfde Bronx-conceptpost op de productiedatabase.
 *
 *   node prod-nieuwe-post-bronx.cjs --dry
 *   node prod-nieuwe-post-bronx.cjs
 *
 * De post staat als concept klaar zodat Daley hem in de admin op
 * meetthelocals.nl kan invullen. Zolang hij op draft staat is hij nergens
 * op de site zichtbaar.
 *
 * De hero is voorlopig newyork-taxi.webp: dat is New York maar niet de Bronx.
 * Payload eist een hero, dus leeg laten kan niet. Vervangen zodra het echte
 * beeld er is.
 *
 * Draait alles in één transactie: bij een fout blijft de database ongemoeid.
 */

const { Client } = require('pg')
const dry = process.argv.includes('--dry')

const SLUG = 'twee-weken-als-local-in-the-bronx'
const TIJDELIJKE_HERO = 'newyork-taxi.webp'
const BESTEMMINGEN = ['new-york', 'verenigde-staten']
const THEMAS = ['reisverhalen-routes', 'reisfotografie']

const KOPJES = [
  ['Waarom de Bronx', 'Hoe kwam je daar terecht, en wat verwachtte je vooraf. Twee of drie zinnen is genoeg.'],
  ['Waar we sliepen', 'De buurt, het appartement, wat het kostte. Dit is het soort detail dat alleen iemand heeft die er was.'],
  ['Wat twee weken anders maakt dan twee dagen', 'Het verschil tussen bezoeken en er even wonen. Boodschappen, de metro, dezelfde gezichten.'],
  ['Eten', 'Namen en adressen. Wat je at, wat het kostte, of je terug zou gaan.'],
  ['Wat tegenviel', 'Niet overslaan. Dit is het stuk dat een gegenereerd reisverhaal nooit heeft.'],
  ['Praktisch', 'Vervoer, veiligheid zoals jij het ervoer, beste tijd, wat je anders zou doen.'],
]

const tekst = (t, cursief) => ({
  type: 'text', version: 1, text: t, format: cursief ? 2 : 0, detail: 0, mode: 'normal', style: '',
})
const para = (t, cursief) => ({
  type: 'paragraph', version: 1, children: [tekst(t, cursief)], direction: 'ltr', format: '', indent: 0,
})
const kop = (t) => ({
  type: 'heading', tag: 'h2', version: 1, children: [tekst(t, false)], direction: 'ltr', format: '', indent: 0,
})

const children = [
  para('Deze post staat klaar maar is nog niet geschreven. De kopjes hieronder geven de structuur; de tekst en de beelden komen van Daley zelf.', true),
]
for (const [k, hint] of KOPJES) {
  children.push(kop(k))
  children.push(para(hint, true))
}
const CONTENT = { root: { type: 'root', version: 1, children, direction: 'ltr', format: '', indent: 0 } }

async function main() {
  const db = new Client({ connectionString: process.env.DATABASE_URI })
  await db.connect()
  try {
    const al = await db.query('select id, status from posts where slug = $1', [SLUG])
    if (al.rows.length) {
      console.log(`De post bestaat al (id ${al.rows[0].id}, status ${al.rows[0].status}). Niets gedaan.`)
      return
    }

    const hero = await db.query('select id from media where filename = $1', [TIJDELIJKE_HERO])
    if (!hero.rows.length) {
      console.error(`Tijdelijke hero ${TIJDELIJKE_HERO} staat niet in de media op productie.`)
      process.exitCode = 1
      return
    }
    const heroId = hero.rows[0].id

    const dests = await db.query('select id, slug from destinations where slug = any($1::text[])', [BESTEMMINGEN])
    console.log(`hero          ${TIJDELIJKE_HERO} (id ${heroId})`)
    console.log(`bestemmingen  ${dests.rows.map((r) => r.slug).join(', ') || 'geen gevonden'}`)
    console.log(`kopjes        ${KOPJES.length}`)

    if (dry) {
      console.log('\n--dry, er is niets aangemaakt.')
      return
    }

    await db.query('BEGIN')

    const next = await db.query('select coalesce(max(id),0)+1 as id from posts')
    const id = next.rows[0].id

    await db.query(
      `insert into posts
         (id, title, slug, hero_image_id, content, excerpt, published_date, werelddeel,
          status, seo_meta_title, seo_meta_description, updated_at, created_at)
       values ($1,$2,$3,$4,$5,$6,now(),'north-america','draft',$7,$8, now(), now())`,
      [
        id,
        'Twee weken als local in The Bronx, New York',
        SLUG,
        heroId,
        JSON.stringify(CONTENT),
        'Twee weken wonen in plaats van bezoeken. Over de Bronx, de metro, het eten en wat er anders is als je ergens blijft.',
        'Twee weken als local in The Bronx, New York',
        'Hoe het is om twee weken in de Bronx te wonen in plaats van New York te bezoeken. Eigen ervaringen, eigen fotografie.',
      ],
    )
    await db.query("select setval(pg_get_serial_sequence('posts','id'), (select max(id) from posts))")

    let orde = 0
    for (const t of THEMAS) {
      await db.query('insert into posts_thema ("order", parent_id, value) values ($1,$2,$3)', [orde++, id, t])
    }

    orde = 0
    for (const d of dests.rows) {
      await db.query(
        'insert into posts_rels ("order", parent_id, path, destinations_id) values ($1,$2,$3,$4)',
        [orde++, id, 'destinations', d.id],
      )
    }

    await db.query('COMMIT')
    console.log(`\nAangemaakt met id ${id}, status draft.`)
    console.log(`Bewerken op https://meetthelocals.nl/admin/collections/posts/${id}`)
  } catch (err) {
    await db.query('ROLLBACK').catch(() => {})
    console.error('Mislukt, teruggedraaid:', err.message)
    process.exitCode = 1
  } finally {
    await db.end()
  }
}

main()
