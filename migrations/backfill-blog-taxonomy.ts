/**
 * Eenmalige backfill: zet werelddeel + thema op de bestaande blogs,
 * zodat het nieuwe blogfilter meteen iets te tonen heeft.
 * Draaien:  node --env-file=.env --import tsx ./migrations/backfill-blog-taxonomy.ts
 *
 * Blogs die al een werelddeel hebben worden overgeslagen, dus dit script
 * is veilig opnieuw te draaien en overschrijft geen handmatige aanpassingen.
 * De thema-keuzes hieronder zijn een eerste inschatting, bij te stellen via /admin.
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'
import type { Post } from '../src/payload-types'

type Backfill = {
  id: number
  titel: string
  werelddeel: NonNullable<Post['werelddeel']>
  thema: NonNullable<Post['thema']>
}

const BACKFILL: Backfill[] = [
  { id: 1, titel: 'Testie mC Testy face', werelddeel: 'asia', thema: ['reisverhalen-routes'] },
  { id: 2, titel: '3 weken rondreizen door Peru', werelddeel: 'south-america', thema: ['reisverhalen-routes'] },
  { id: 3, titel: 'Twee weken route door Maleisie', werelddeel: 'asia', thema: ['reisverhalen-routes'] },
  { id: 4, titel: 'Machu Picchu kaartjes', werelddeel: 'south-america', thema: ['reistips-praktisch'] },
]

async function run() {
  const payload = await getPayload({ config })

  for (const item of BACKFILL) {
    let existing: Post | null = null
    try {
      existing = await payload.findByID({ collection: 'posts', id: item.id })
    } catch {
      payload.logger.warn(`Blog ${item.id} (${item.titel}) niet gevonden, overgeslagen.`)
      continue
    }

    if (existing.werelddeel) {
      payload.logger.info(`Blog ${item.id} heeft al een werelddeel, overgeslagen.`)
      continue
    }

    await payload.update({
      collection: 'posts',
      id: item.id,
      data: { werelddeel: item.werelddeel, thema: item.thema },
    })
    payload.logger.info(
      `Blog ${item.id} bijgewerkt: ${item.werelddeel} / ${item.thema.join(', ')}`,
    )
  }

  payload.logger.info('Backfill klaar.')
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
