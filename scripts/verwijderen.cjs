/**
 * Verwijdert een blogpost of een reportage definitief, op slug.
 *
 *   node scripts/verwijderen.cjs posts <slug> [<slug>...] [--dry]
 *   node scripts/verwijderen.cjs stories <slug> [<slug>...] [--dry]
 *
 * Werkt tegen elke database via DATABASE_URI, dus lokaal en op productie
 * hetzelfde bestand. Bestaat de slug daar niet, dan gebeurt er niets.
 *
 * De koppeltabellen ruimen zichzelf op via CASCADE. De versiegeschiedenis niet:
 * die hangt met SET NULL aan het document en zou als losse rijen blijven staan.
 * Die gaan hier expliciet mee.
 *
 * Dit is niet terug te draaien. Twijfel je, zet het dan op concept in de admin:
 * dan is het van de site af en blijft het wel bestaan.
 */

const { Client } = require('pg')
const dry = process.argv.includes('--dry')
const [SOORT, ...SLUGS] = process.argv.slice(2).filter((a) => !a.startsWith('--'))

const TABELLEN = {
  posts: { tabel: 'posts', versies: '_posts_v', waar: '/blog' },
  stories: { tabel: 'stories', versies: '_stories_v', waar: '/verhalen' },
}

async function main() {
  const soort = TABELLEN[SOORT]
  if (!soort || !SLUGS.length) {
    console.error('Gebruik: node scripts/verwijderen.cjs <posts|stories> <slug> [<slug>...] [--dry]')
    process.exitCode = 1
    return
  }

  const db = new Client({ connectionString: process.env.DATABASE_URI })
  await db.connect()
  try {
    await db.query('BEGIN')

    for (const slug of SLUGS) {
      const r = await db.query(`select id, title, status from ${soort.tabel} where slug = $1`, [slug])
      if (!r.rows.length) {
        console.log(`niet gevonden   ${slug}`)
        continue
      }
      const post = r.rows[0]
      console.log(`${dry ? 'zou weg  ' : 'verwijderd'}      ${post.title}  (id ${post.id}, ${post.status})`)
      if (dry) continue
      await db.query(`delete from ${soort.versies} where parent_id = $1`, [post.id])
      await db.query(`delete from ${soort.tabel} where id = $1`, [post.id])
    }

    if (dry) {
      await db.query('ROLLBACK')
      console.log('\n--dry, er is niets verwijderd.')
    } else {
      await db.query('COMMIT')
    }

    const over = await db.query(
      `select to_char(published_date,'YYYY-MM-DD') d, title from ${soort.tabel} where status='published' order by published_date desc`,
    )
    console.log(`\nNog gepubliceerd op ${soort.waar}:`)
    console.log(over.rows.length ? over.rows.map((x) => `  ${x.d}  ${x.title}`).join('\n') : '  niets meer')
  } catch (e) {
    await db.query('ROLLBACK').catch(() => {})
    console.error('Mislukt, teruggedraaid:', e.message)
    process.exitCode = 1
  } finally {
    await db.end()
  }
}

main()
