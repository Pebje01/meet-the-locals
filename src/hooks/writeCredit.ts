import type { CollectionBeforeOperationHook } from 'payload'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { CREDIT } from '../lib/credit'

const run = promisify(execFile)

/**
 * Schrijft auteursrecht en naamsvermelding in de XMP van een geüploade foto.
 *
 * Draait als `beforeOperation`, niet als `beforeChange`. Dat is geen detail:
 * Payload roept generateFileData (dat de maatvarianten maakt) aan tussen die
 * twee hooks in. Een beforeChange-hook is dus te laat, de thumbnails, medium,
 * large en hero zijn dan al gemaakt uit de ongetagde buffer.
 *
 *   beforeOperation   <- hier, de originele buffer krijgt credit
 *   generateFileData     sharp maakt de varianten
 *   beforeChange         extractExif leest de camera-instellingen
 *
 * De varianten erven de metadata alleen als `upload.withMetadata` op true
 * staat in Media.ts. Zonder die vlag strijkt sharp alles weg.
 *
 * Zonder exiftool op de machine slaat de hook zichzelf over met een
 * waarschuwing in het log en gaat de upload gewoon door. Draai in dat geval
 * achteraf: node scripts/write-credit.mjs
 */
export const writeCredit: CollectionBeforeOperationHook = async ({ args, operation, req }) => {
  if (operation !== 'create' && operation !== 'update') return args

  const file = req.file
  if (!file?.data || !file.mimetype?.startsWith('image/')) return args

  let dir: string | undefined

  try {
    dir = await mkdtemp(path.join(tmpdir(), 'mtl-credit-'))
    const target = path.join(dir, file.name || 'upload.bin')
    await writeFile(target, file.data)

    await run('exiftool', [
      '-overwrite_original',
      `-XMP-dc:Creator=${CREDIT.creator}`,
      `-XMP-dc:Rights=${CREDIT.copyrightNotice}`,
      `-XMP-photoshop:Credit=${CREDIT.creditLine}`,
      `-XMP-photoshop:Source=${CREDIT.siteName}`,
      '-XMP-xmpRights:Marked=True',
      `-XMP-xmpRights:WebStatement=${CREDIT.webStatement}`,
      `-XMP-xmpRights:UsageTerms=${CREDIT.usageTerms}`,
      `-XMP-plus:LicensorName=${CREDIT.copyrightHolder}`,
      `-XMP-plus:LicensorURL=${CREDIT.acquireLicensePage}`,
      // Echt beeld, geen AI. Zie de over-pagina.
      `-XMP-iptcExt:DigitalSourceType=${CREDIT.digitalSourceType}`,
      `-IPTC:By-line=${CREDIT.creator}`,
      `-IPTC:CopyrightNotice=${CREDIT.copyrightNotice}`,
      `-EXIF:Artist=${CREDIT.creator}`,
      `-EXIF:Copyright=${CREDIT.copyrightNotice}`,
      target,
    ])

    const tagged = await readFile(target)
    file.data = tagged
    file.size = tagged.length
  } catch (err) {
    const e = err as NodeJS.ErrnoException
    const reden =
      e.code === 'ENOENT'
        ? 'exiftool is niet geïnstalleerd op deze machine'
        : (err as Error).message
    req.payload.logger.warn(
      `Credit schrijven overgeslagen voor ${file.name}: ${reden}. ` +
        'Draai achteraf: node scripts/write-credit.mjs',
    )
  } finally {
    if (dir) await rm(dir, { recursive: true, force: true }).catch(() => {})
  }

  return args
}
