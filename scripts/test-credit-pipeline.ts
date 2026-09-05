/**
 * Controleert of de uploadpijplijn de credit correct doorzet.
 *
 * Maakt een testbeeld zonder enige metadata, duwt dat door Payload heen en
 * leest daarna het origineel en elke maatvariant terug. Slaagt alleen als
 * alle bestanden de juiste maker en rechthebbende dragen.
 *
 *   set -a; . ./.env; set +a; npx tsx scripts/test-credit-pipeline.ts
 *
 * De bestanden gaan naar de S3-bucket, dus ze worden via hun publieke URL
 * teruggelezen. Het testbeeld wordt aan het eind weer verwijderd, zowel uit de
 * database als uit de bucket.
 */

import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { getPayload } from 'payload'

import config from '../src/payload.config'
import { CREDIT } from '../src/lib/credit'

const run = promisify(execFile)
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

async function read(file: string, tag: string) {
  try {
    const { stdout } = await run('exiftool', ['-s3', tag, file])
    return stdout.trim() || '(leeg)'
  } catch {
    return '(niet leesbaar)'
  }
}

/** Haalt een geserveerd bestand op, precies zoals een bezoeker het krijgt. */
async function fetchTo(url: string, dest: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} op ${url}`)
  await writeFile(dest, Buffer.from(await res.arrayBuffer()))
  return dest
}

const tmp = await mkdtemp(path.join(tmpdir(), 'mtl-test-'))
const source = path.join(tmp, `credit-pijplijn-test-${Date.now()}.webp`)

// Een kaal beeld, gegarandeerd zonder metadata.
await sharp({
  create: { width: 2400, height: 1600, channels: 3, background: { r: 40, g: 74, b: 40 } },
})
  .webp()
  .toFile(source)

console.log(`Testbeeld zonder metadata : ${path.basename(source)}`)
console.log(`Creator vooraf            : ${await read(source, '-XMP-dc:Creator')}\n`)

const payload = await getPayload({ config })
let id: number | string | undefined

try {
  const doc = await payload.create({
    collection: 'media',
    data: { alt: 'Testupload credit-pijplijn' },
    filePath: source,
  })
  id = doc.id

  const files: { label: string; url: string }[] = [
    { label: 'origineel', url: doc.url as string },
  ]
  for (const [size, info] of Object.entries(doc.sizes ?? {})) {
    if (info && typeof info === 'object' && 'url' in info && info.url) {
      files.push({ label: size, url: info.url as string })
    }
  }

  let failed = 0
  console.log('Bestand'.padEnd(14) + 'Creator'.padEnd(16) + 'Rechthebbende')
  console.log('-'.repeat(58))

  for (const f of files) {
    const p = await fetchTo(f.url, path.join(tmp, `${f.label}.webp`))
    const creator = await read(p, '-XMP-dc:Creator')
    const licensor = await read(p, '-XMP-plus:LicensorName')
    const ok = creator === CREDIT.creator && licensor === CREDIT.copyrightHolder
    if (!ok) failed++
    console.log(`${f.label.padEnd(14)}${creator.padEnd(16)}${licensor}   ${ok ? 'ok' : 'MIST'}`)
  }

  console.log()
  console.log(
    failed === 0
      ? `Geslaagd: alle ${files.length} bestanden dragen de credit.`
      : `Gezakt: ${failed} van ${files.length} bestanden missen de credit.`,
  )
  process.exitCode = failed === 0 ? 0 : 1
} finally {
  if (id !== undefined) {
    await payload.delete({ collection: 'media', id }).catch(() => {})
  }
  await rm(tmp, { recursive: true, force: true }).catch(() => {})
}

process.exit(process.exitCode ?? 0)
