/**
 * Verwijdert een blogpost definitief, op slug.
 *
 *   node scripts/post-verwijderen.cjs <slug> [<slug>...] --dry
 *   node scripts/post-verwijderen.cjs <slug> [<slug>...]
 *
 * Werkt tegen elke database via DATABASE_URI, dus lokaal en op productie
 * hetzelfde bestand. Bestaat de slug daar niet, dan gebeurt er niets.
 *
 * De koppeltabellen ruimen zichzelf op via CASCADE. De versiegeschiedenis in
 * _posts_v niet: die hangt met SET NULL aan de post en zou als losse rijen
 * blijven staan. Die gaan hier expliciet mee.
 *
 * Dit is niet terug te draaien. Twijfel je, zet de post dan op concept in de
 * admin: dan is hij van de site af en blijft hij wel bestaan.
 */

const { Client } = require('pg')
const dry = process.argv.includes('--dry')
const SLUGS = process.argv.slice(2).filter((a) => !a.startsWith('--'))

async function main() {
  if (!SLUGS.length) {
    console.error('Geef minstens één slug mee.')
    process.exitCode = 1
    return
  }

  const db = new Client({ connectionString: process.env.DATABASE_URI })
  await db.connect()
  try {
    await db.query('BEGIN')

    for (const slug of SLUGS) {
      const r = await db.query('select id, title, status from posts where slug = $1', [slug])
      if (!r.rows.length) {
        console.log(`niet gevonden   ${slug}`)
        continue
      }
      const post = r.rows[0]
      console.log(`${dry ? 'zou weg  ' : 'verwijderd'}      ${post.title}  (id ${post.id}, ${post.status})`)
      if (dry) continue
      await db.query('delete from _posts_v where parent_id = $1', [post.id])
      await db.query('delete from posts where id = $1', [post.id])
    }

    if (dry) {
      await db.query('ROLLBACK')
      console.log('\n--dry, er is niets verwijderd.')
    } else {
      await db.query('COMMIT')
    }

    const over = await db.query(
      "select to_char(published_date,'YYYY-MM-DD') d, title from posts where status='published' order by published_date desc",
    )
    console.log('\nNog gepubliceerd op /blog:')
    console.log(over.rows.length ? over.rows.map((x) => `  ${x.d}  ${x.title}`).join('\n') : '  geen enkele post')
  } catch (e) {
    await db.query('ROLLBACK').catch(() => {})
    console.error('Mislukt, teruggedraaid:', e.message)
    process.exitCode = 1
  } finally {
    await db.end()
  }
}

main()
