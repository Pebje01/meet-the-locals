/**
 * Importeert de Hanoi-scooterfoto in de mediabibliotheek.
 *
 *   set -a; . ./.env; set +a; IMPORT_DIR=... npx tsx scripts/import-vietnam-foto.ts
 *
 * Los script omdat het bestand van buiten public/media komt en dus door de
 * uploadpijplijn van Payload moet: daar krijgt het automatisch credit,
 * maatvarianten en de EXIF uit de D5300.
 */

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const IMPORT_DIR = process.env.IMPORT_DIR ?? path.join(ROOT, 'import-vn')

const payload = await getPayload({ config })

const { docs } = await payload.find({
  collection: 'media',
  where: { filename: { equals: 'vietnam-scooters.webp' } },
  limit: 1,
  depth: 0,
})

if (docs.length) {
  console.log(`bestaat al, id ${docs[0].id}`)
} else {
  const d = await payload.create({
    collection: 'media',
    data: {
      alt: 'Scooters in de schemering op een kruispunt in Hanoi, met bewegingsonscherpte',
      caption: 'Oude wijk, Hanoi',
    },
    filePath: path.join(IMPORT_DIR, 'vietnam-scooters.webp'),
  })
  console.log(`geimporteerd, id ${d.id}, opgeslagen als ${d.filename}`)
}
process.exit(0)
