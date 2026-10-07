import type { CollectionBeforeChangeHook } from 'payload'
import exifr from 'exifr'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

const run = promisify(execFile)

function formatShutter(exposureTime?: number): string | undefined {
  if (!exposureTime || exposureTime <= 0) return undefined
  if (exposureTime >= 1) return `${Number(exposureTime.toFixed(1))}s`
  return `1/${Math.round(1 / exposureTime)}s`
}

/** exifr geeft een Date terug, exiftool een string als '2026:08:22 18:03:53'. */
function toIsoDate(v: unknown): string | undefined {
  if (v instanceof Date) return v.toISOString()
  if (typeof v !== 'string') return undefined
  const d = new Date(v.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3'))
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString()
}

function formatCamera(make?: string, model?: string): string | undefined {
  const cleanMake = (make || '').trim()
  const cleanModel = (model || '').trim()
  if (!cleanModel) return cleanMake || undefined
  // Nikon zet 'NIKON CORPORATION' in Make en 'NIKON D780' in Model. Vergelijken
  // op het eerste woord voorkomt 'NIKON CORPORATION NIKON D780'.
  const merk = cleanMake.split(/\s+/)[0]?.toLowerCase()
  if (merk && cleanModel.toLowerCase().startsWith(merk)) return cleanModel
  return [cleanMake, cleanModel].filter(Boolean).join(' ').trim() || undefined
}

/**
 * Leest de EXIF met exiftool. Nodig omdat exifr geen WebP aankan en dat nu
 * juist het formaat is waarin alle beelden op deze site staan: daardoor bleven
 * de cameravelden leeg en toonde de EXIF-overlay bij hover niets.
 */
async function parseWithExiftool(buffer: Buffer, name: string) {
  const dir = await mkdtemp(path.join(tmpdir(), 'mtl-exif-'))
  try {
    const target = path.join(dir, name || 'upload.bin')
    await writeFile(target, buffer)
    const { stdout } = await run('exiftool', ['-json', '-n', '-G0:1', '-EXIF:all', '-Composite:all', target])
    const raw = JSON.parse(stdout)[0] ?? {}
    // Groepsprefixen weghalen zodat het resultaat op dat van exifr lijkt.
    const flat: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(raw)) flat[k.split(':').pop() as string] = v
    return flat
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => {})
  }
}

/**
 * Leest camera-instellingen en GPS uit de EXIF van een geüploade foto.
 * Draait alleen bij een nieuwe upload; handmatig ingevulde velden blijven
 * staan wanneer er geen nieuw bestand wordt meegestuurd.
 */
export const extractExif: CollectionBeforeChangeHook = async ({ data, req }) => {
  const file = req.file
  if (!file?.data || !file.mimetype?.startsWith('image/')) return data

  try {
    // exifr eerst, dat is snel en zonder subproces. Kan hij het formaat niet
    // aan (WebP), dan doet exiftool het alsnog.
    // exifr levert ongetypeerde tags terug; de velden worden hieronder stuk voor stuk gecontroleerd.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let raw: Record<string, any> | undefined
    try {
      raw = await exifr.parse(file.data, { tiff: true, exif: true, gps: true })
    } catch {
      raw = undefined
    }
    if (!raw || !raw.Model) {
      raw = { ...(await parseWithExiftool(file.data, file.name)), ...(raw ?? {}) }
    }
    if (!raw) return data

    const rawIso = raw.ISO ?? raw.ISOSpeedRatings ?? raw.PhotographicSensitivity
    const iso = Array.isArray(rawIso) ? rawIso[0] : rawIso
    const focal = typeof raw.FocalLength === 'number' ? raw.FocalLength : undefined

    data.exif = {
      camera: formatCamera(raw.Make, raw.Model),
      lens: (raw.LensModel || raw.LensInfo || '').toString().trim() || undefined,
      focalLength: focal ? `${Math.round(focal)}mm` : undefined,
      aperture:
        typeof raw.FNumber === 'number' ? `f/${Number(raw.FNumber.toFixed(1))}` : undefined,
      shutterSpeed: formatShutter(
        typeof raw.ExposureTime === 'number' ? raw.ExposureTime : undefined,
      ),
      iso: iso != null ? String(iso) : undefined,
      takenAt: toIsoDate(raw.DateTimeOriginal),
      latitude: typeof raw.latitude === 'number' ? raw.latitude : (typeof raw.GPSLatitude === 'number' ? raw.GPSLatitude : undefined),
      longitude: typeof raw.longitude === 'number' ? raw.longitude : (typeof raw.GPSLongitude === 'number' ? raw.GPSLongitude : undefined),
    }
  } catch (err) {
    req.payload.logger.warn(`EXIF uitlezen mislukt voor ${file.name}: ${(err as Error).message}`)
  }

  return data
}
