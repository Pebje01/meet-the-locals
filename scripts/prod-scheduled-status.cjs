// Migratie 20261006_130000_scheduled_status op de productiedatabase.
//
// Voegt de enumwaarde 'scheduled' toe aan enum_posts_status en
// enum_photography_posts_status, en registreert de migratie in
// payload_migrations. Additief en veilig om vaker te draaien: bestaande
// gegevens veranderen niet.
//
// Draaien in de app-container (zie CLAUDE.md, "Productie DB"):
//   docker cp scripts/prod-scheduled-status.cjs <container>:/app/
//   docker exec -w /app <container> node prod-scheduled-status.cjs
const { Client } = require('pg')

;(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URI })
  await client.connect()

  const show = async (label) => {
    const r = await client.query(`
      select t.typname, string_agg(e.enumlabel, ',' order by e.enumsortorder) as labels
      from pg_type t join pg_enum e on e.enumtypid = t.oid
      where t.typname in ('enum_posts_status', 'enum_photography_posts_status')
      group by 1 order by 1`)
    console.log(label, JSON.stringify(r.rows))
  }

  await show('voor:')
  await client.query(`ALTER TYPE "public"."enum_posts_status" ADD VALUE IF NOT EXISTS 'scheduled'`)
  await client.query(`ALTER TYPE "public"."enum_photography_posts_status" ADD VALUE IF NOT EXISTS 'scheduled'`)

  const name = '20261006_130000_scheduled_status'
  const exists = await client.query('select 1 from payload_migrations where name = $1', [name])
  if (exists.rowCount === 0) {
    const batch = await client.query('select coalesce(max(batch), 0) + 1 as b from payload_migrations')
    await client.query(
      'insert into payload_migrations (name, batch, updated_at, created_at) values ($1, $2, now(), now())',
      [name, batch.rows[0].b],
    )
    console.log('migratie geregistreerd in batch', batch.rows[0].b)
  } else {
    console.log('migratie stond al geregistreerd')
  }

  await show('na:')
  await client.end()
})().catch((e) => {
  console.error('FOUT', e.message)
  process.exit(1)
})
