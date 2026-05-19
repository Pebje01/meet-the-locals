import type { CollectionBeforeChangeHook } from 'payload'
import exifr from 'exifr'

function formatShutter(exposureTime?: number): string | undefined {
  if (!exposureTime || exposureTime <= 0) return undefined
  if (exposureTime >= 1) return `${Number(exposureTime.toFixed(1))}s`
  return `1/${Math.round(1 / exposureTime)}s`
}

function formatCamera(make?: string, model?: string): string | undefined {
  const cleanMake = (make || '').trim()
  const cleanModel = (model || '').trim()
  if (!cleanModel) return cleanMake || undefined
  if (cleanMake && cleanModel.toLowerCase().startsWith(cleanMake.toLowerCase())) return cleanModel
  return [cleanMake, cleanModel].filter(Boolean).join(' ').trim() || undefined
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
    const raw = await exifr.parse(file.data, { tiff: true, exif: true, gps: true })
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
      takenAt: raw.DateTimeOriginal instanceof Date ? raw.DateTimeOriginal.toISOString() : undefined,
      latitude: typeof raw.latitude === 'number' ? raw.latitude : undefined,
      longitude: typeof raw.longitude === 'number' ? raw.longitude : undefined,
    }
  } catch (err) {
    req.payload.logger.warn(`EXIF uitlezen mislukt voor ${file.name}: ${(err as Error).message}`)
  }

  return data
}
