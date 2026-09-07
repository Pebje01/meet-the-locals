/**
 * Zet verhalen offline door ze op concept te zetten.
 *
 *   node scripts/verhalen-offline.cjs --dry
 *   node scripts/verhalen-offline.cjs
 *   node scripts/verhalen-offline.cjs <slug> [<slug>...] [--dry]
 *
 * Cartagena en de Andes zijn verzonnen reisverhalen: Daley staat er niet
 * achter en ze spreken de belofte op de over-pagina tegen dat alles echt is.
 *
 * Bewust op concept en niet verwijderd. Ze verdwijnen direct van de site,
 * maar blijven in de admin staan mocht er ooit nog iets uit te halen zijn.
 * Definitief weggooien kan altijd nog; terughalen niet.
 */

const { Client } = require('pg')
const dry = process.argv.includes('--dry')

// Slugs mogen ook op de opdrachtregel mee, zodat dit script herbruikbaar is:
//   node scripts/verhalen-offline.cjs verloren-in-de-sahara --dry
const STANDAARD = ['de-keuken-van-cartagena', 'boven-de-wolken-in-de-andes']
const meegegeven = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const SLUGS = meegegeven.length ? meegegeven : STANDAARD

async function main() {
  const db = new Client({ connectionString: process.env.DATABASE_URI })
  await db.connect()
  try {
    for (const slug of SLUGS) {
      const r = await db.query('select id, status, title from stories where slug = $1', [slug])
      if (!r.rows.length) { console.log(`niet gevonden   ${slug}`); continue }
      const s = r.rows[0]
      console.log(`${dry ? 'zou offline' : 'offline    '}     ${s.title}  (was ${s.status})`)
      if (dry) continue
      await db.query("update stories set status = 'draft', updated_at = now() where id = $1", [s.id])
    }

    const nog = await db.query(
      "select title, to_char(published_date,'YYYY-MM-DD') d from stories where status='published' order by published_date desc",
    )
    console.log('\nNog gepubliceerd op /verhalen:')
    console.log(nog.rows.length
      ? nog.rows.map((r) => `  ${r.d}  ${r.title}`).join('\n')
      : '  geen enkel verhaal')

    if (dry) console.log('\n--dry, er is niets gewijzigd.')
  } catch (e) {
    console.error('Mislukt:', e.message)
    process.exitCode = 1
  } finally { await db.end() }
}
main()
