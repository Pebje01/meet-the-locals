/**
 * Vult de EXIF-velden van bestaande media alsnog in.
 *
 * Nodig omdat de oorspronkelijke hook exifr gebruikte, en exifr geen WebP kan
 * lezen. Alle beelden op deze site zijn WebP, dus de cameravelden bleven leeg
 * en de EXIF-overlay bij hover toonde niets.
 *
 *   set -a; . ./.env; set +a; npx tsx scripts/backfill-exif.ts [--dry]
 *
 * Leest elk bestand op via zijn eigen URL, precies zoals een bezoeker het
 * krijgt, en schrijft alleen velden die nu nog leeg zijn.
 */

import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import type { Media } from '../src/payload-types'

const run = promisify(execFile)
const dry = process.argv.includes('--dry')

function formatShutter(t?: number) {
  if (!t || t <= 0) return undefined
  return t >= 1 ? `${Number(t.toFixed(1))}s` : `1/${Math.round(1 / t)}s`
}

function formatCamera(make?: string, model?: string) {
  const a = (make || '').trim()
  const b = (model || '').trim()
  if (!b) return a || undefined
  // Nikon zet 'NIKON CORPORATION' in Make en 'NIKON D780' in Model. Vergelijken
  // op het eerste woord voorkomt 'NIKON CORPORATION NIKON D780'.
  const merk = a.split(/\s+/)[0]?.toLowerCase()
  if (merk && b.toLowerCase().startsWith(merk)) return b
  return [a, b].filter(Boolean).join(' ').trim() || undefined
}

function toIsoDate(v: unknown) {
  if (typeof v !== 'string') return undefined
  const d = new Date(v.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3'))
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString()
}

const payload = await getPayload({ config })
const { docs } = await payload.find({ collection: 'media', limit: 1000, depth: 0 })

const dir = await mkdtemp(path.join(tmpdir(), 'mtl-backfill-'))
let gevuld = 0
let alGoed = 0
let geenExif = 0
let mislukt = 0

try {
  for (const doc of docs) {
    const bestaand = (doc.exif ?? {}) as NonNullable<Media['exif']>
    if (bestaand.camera) {
      alGoed++
      continue
    }
    if (!doc.url || !doc.filename) continue

    const local = path.join(dir, doc.filename)
    try {
      const res = await fetch(doc.url)
      if (!res.ok) throw new Error(`${res.status}`)
      await writeFile(local, Buffer.from(await res.arrayBuffer()))

      const { stdout } = await run('exiftool', ['-json', '-n', '-EXIF:all', '-Composite:all', local])
      const r = (JSON.parse(stdout)[0] ?? {}) as Record<string, any>

      const camera = formatCamera(r.Make, r.Model)
      if (!camera) {
        geenExif++
        continue
      }

      const iso = Array.isArray(r.ISO) ? r.ISO[0] : r.ISO
      const exif: Media['exif'] = {
        ...bestaand,
        camera,
        lens: bestaand.lens || (r.LensModel || r.LensID || '').toString().trim() || undefined,
        focalLength:
          bestaand.focalLength ||
          (typeof r.FocalLength === 'number' ? `${Math.round(r.FocalLength)}mm` : undefined),
        aperture:
          bestaand.aperture ||
          (typeof r.FNumber === 'number' ? `f/${Number(r.FNumber.toFixed(1))}` : undefined),
        shutterSpeed:
          bestaand.shutterSpeed ||
          formatShutter(typeof r.ExposureTime === 'number' ? r.ExposureTime : undefined),
        iso: bestaand.iso || (iso != null ? String(iso) : undefined),
        takenAt: bestaand.takenAt || toIsoDate(r.DateTimeOriginal),
        latitude:
          bestaand.latitude ?? (typeof r.GPSLatitude === 'number' ? r.GPSLatitude : undefined),
        longitude:
          bestaand.longitude ?? (typeof r.GPSLongitude === 'number' ? r.GPSLongitude : undefined),
      }

      if (!dry) {
        await payload.update({ collection: 'media', id: doc.id, data: { exif } })
      }
      gevuld++
      console.log(`${doc.filename.padEnd(38)} ${camera}`)
    } catch (err) {
      mislukt++
      console.error(`  fout bij ${doc.filename}: ${(err as Error).message}`)
    } finally {
      await rm(local, { force: true }).catch(() => {})
    }
  }
} finally {
  await rm(dir, { recursive: true, force: true }).catch(() => {})
}

console.log(`\nHad al camera-gegevens : ${alGoed}`)
console.log(`${dry ? 'Zou gevuld worden' : 'Gevuld'}      : ${gevuld}`)
console.log(`Geen EXIF in bestand   : ${geenExif}`)
if (mislukt) console.log(`Mislukt                : ${mislukt}`)
if (dry) console.log('\n--dry, er is niets gewijzigd.')

process.exit(0)
