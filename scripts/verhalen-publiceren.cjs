/**
 * Zet de drie nieuwe reportages op de site, ook al is de tekst nog niet af.
 *
 *   node scripts/verhalen-publiceren.cjs --dry
 *   node scripts/verhalen-publiceren.cjs
 *
 * Werkt tegen elke database via DATABASE_URI, dus lokaal en op productie
 * hetzelfde bestand. Zoekt op slug, nooit op id: de twee databases hebben
 * eigen nummering.
 *
 * De skeletten stonden vol met aantekeningen aan Daley zelf ("Niet overslaan.
 * Dit is het stuk dat een verzonnen reisverhaal nooit heeft."). Die horen niet
 * op een openbare pagina, dus de kopjes blijven staan en de aantekeningen gaan
 * eruit. Bovenaan komt één regel die zegt waar de lezer aan toe is.
 */

const { Client } = require('pg')
const dry = process.argv.includes('--dry')

const AANHEF =
  'Dit verhaal wordt nu geschreven. De opzet staat er al, de tekst en de foto’s volgen.'

const tekst = (t, cursief) => ({
  type: 'text', version: 1, text: t, format: cursief ? 2 : 0, detail: 0, mode: 'normal', style: '',
})
const para = (t, cursief) => ({
  type: 'paragraph', version: 1, children: [tekst(t, cursief)], direction: 'ltr', format: '', indent: 0,
})
const kop = (t) => ({
  type: 'heading', tag: 'h2', version: 1, children: [tekst(t, false)], direction: 'ltr', format: '', indent: 0,
})

function inhoud(kopjes) {
  return {
    root: {
      type: 'root', version: 1, direction: 'ltr', format: '', indent: 0,
      children: [para(AANHEF, true), ...kopjes.map(kop)],
    },
  }
}

const VERHALEN = [
  {
    slug: 'leven-als-een-local-in-the-bronx',
    titel: 'Leven als een local in The Bronx, New York',
    eyebrow: 'Twee weken in New York',
    hero: 'newyork-taxi.webp',
    datum: '2026-09-05',
    werelddeel: 'north-america',
    themas: ['reisverhalen-routes', 'reisfotografie'],
    intro:
      'Twee weken wonen in plaats van bezoeken. Over de buurt, de metro, het eten en wat er verandert als je ergens blijft.',
    metaTitle: 'Leven als een local in The Bronx, New York',
    metaDescription:
      'Twee weken wonen in de Bronx in plaats van New York bezoeken. Eigen ervaringen en eigen fotografie.',
    kopjes: ['Aankomen', 'De buurt', 'Wonen in plaats van bezoeken', 'Eten', 'Wat tegenviel', 'Wat ik meenam'],
  },
  {
    slug: 'opvangcentrum-wilde-dieren-jungle-iquitos',
    titel: 'Een opvangcentrum voor wilde dieren midden in de jungle van Iquitos, Peru',
    eyebrow: 'Amazonegebied, Peru',
    hero: 'Dansenmaloca-scaled.webp',
    datum: '2026-09-04',
    werelddeel: 'south-america',
    themas: ['reisverhalen-routes', 'natuur-buiten'],
    intro:
      'Over de rivier vanaf Iquitos, naar een plek waar dieren terechtkomen die nergens anders heen kunnen. Wat het is, wat het kost en of het helpt.',
    metaTitle: 'Opvangcentrum voor wilde dieren in de jungle bij Iquitos, Peru',
    metaDescription:
      'Een opvangcentrum voor wilde dieren in het Amazonegebied bij Iquitos. Eigen ervaring, eigen fotografie.',
    kopjes: ['Hoe je er komt', 'Het centrum', 'De dieren', 'Wat je er doet', 'Wat tegenviel', 'Zou je het aanraden'],
  },
  {
    slug: 'scootertocht-ho-chi-minh-mekong-delta',
    titel: '“Dit doen zelfs Vietnamezen niet”: een scootertocht van Ho Chi Minh naar de Mekong Delta',
    eyebrow: 'Zuid-Vietnam',
    hero: 'vietnam-scooters.webp',
    datum: '2026-09-03',
    werelddeel: 'asia',
    themas: ['reisverhalen-routes', 'reisfotografie'],
    intro:
      'Op de scooter de stad uit, richting de Mekong Delta. Een route die volgens de mensen daar niemand rijdt.',
    metaTitle: 'Met de scooter van Ho Chi Minh naar de Mekong Delta',
    metaDescription:
      'Een scootertocht van Ho Chi Minh City naar de Mekong Delta in Vietnam. Eigen ervaring, eigen fotografie.',
    kopjes: ['Het idee', 'De scooter', 'De weg uit', 'De Delta', 'Wat tegenviel', 'Zou je het aanraden'],
  },
]

async function main() {
  const db = new Client({ connectionString: process.env.DATABASE_URI })
  await db.connect()
  const overgeslagen = []
  try {
    await db.query('BEGIN')

    for (const v of VERHALEN) {
      const hero = await db.query('select id from media where filename = $1', [v.hero])
      if (!hero.rows.length) {
        // Overslaan en niet afbreken: de andere twee kunnen wel gewoon live.
        // De beelden staan wel op S3, maar de twee databases hebben elk hun
        // eigen media-records, dus een foto die lokaal geïmporteerd is hoeft
        // op productie nog niet te bestaan.
        console.log(`overslaan   ${v.slug}  (hero ${v.hero} staat niet in deze database)`)
        overgeslagen.push(v)
        continue
      }
      const heroId = hero.rows[0].id
      const content = JSON.stringify(inhoud(v.kopjes))

      const bestaand = await db.query('select id, status from stories where slug = $1', [v.slug])

      if (bestaand.rows.length) {
        const id = bestaand.rows[0].id
        console.log(`bijwerken   ${v.slug}  (id ${id}, was ${bestaand.rows[0].status})`)
        if (dry) continue
        await db.query(
          `update stories set title=$2, eyebrow=$3, hero_image_id=$4, intro=$5, content=$6,
             published_date=$7, werelddeel=$8, seo_meta_title=$9, seo_meta_description=$10,
             status='published', updated_at=now() where id=$1`,
          [id, v.titel, v.eyebrow, heroId, v.intro, content, v.datum, v.werelddeel,
           v.metaTitle, v.metaDescription],
        )
        await db.query('delete from stories_thema where parent_id = $1', [id])
        let o = 0
        for (const t of v.themas) {
          await db.query('insert into stories_thema ("order", parent_id, value) values ($1,$2,$3)', [o++, id, t])
        }
        continue
      }

      const volgend = await db.query('select coalesce(max(id),0)+1 as id from stories')
      const id = volgend.rows[0].id
      console.log(`aanmaken    ${v.slug}  (id ${id})`)
      if (dry) continue
      await db.query(
        `insert into stories (id, title, slug, eyebrow, hero_image_id, intro, content,
           published_date, werelddeel, seo_meta_title, seo_meta_description,
           status, updated_at, created_at)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'published',now(),now())`,
        [id, v.titel, v.slug, v.eyebrow, heroId, v.intro, content, v.datum, v.werelddeel,
         v.metaTitle, v.metaDescription],
      )
      await db.query("select setval(pg_get_serial_sequence('stories','id'), (select max(id) from stories))")
      let o = 0
      for (const t of v.themas) {
        await db.query('insert into stories_thema ("order", parent_id, value) values ($1,$2,$3)', [o++, id, t])
      }
    }

    if (dry) {
      await db.query('ROLLBACK')
      console.log('\n--dry, alles teruggedraaid.')
    } else {
      await db.query('COMMIT')
    }

    const nu = await db.query(
      "select to_char(published_date,'YYYY-MM-DD') d, title from stories where status='published' order by published_date desc",
    )
    console.log('\nOp /verhalen:')
    console.log(nu.rows.map((r) => `  ${r.d}  ${r.title}`).join('\n'))

    if (overgeslagen.length) {
      console.log('\nNog niet gelukt, hero ontbreekt in deze database:')
      for (const v of overgeslagen) console.log(`  ${v.slug}  vraagt om ${v.hero}`)
    }
  } catch (e) {
    await db.query('ROLLBACK').catch(() => {})
    console.error('Mislukt, teruggedraaid:', e.message)
    process.exitCode = 1
  } finally {
    await db.end()
  }
}

main()
