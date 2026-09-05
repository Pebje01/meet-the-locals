/**
 * Schrijft auteursrecht en naamsvermelding in de XMP van elk beeldbestand
 * in public/media. Zonder deze velden is een foto die van de site af raakt
 * anoniem: er is dan geen enkel spoor terug naar de maker.
 *
 *   node scripts/write-credit.mjs           bestanden zonder credit
 *   node scripts/write-credit.mjs --force   ook bestanden die al credit dragen
 *   node scripts/write-credit.mjs --dry     alleen tellen, niets wijzigen
 *
 * Draait op kaal Node, zonder pnpm install. Vereist wel exiftool:
 *   brew install exiftool
 *
 * Waarden komen uit src/lib/credit.json, dezelfde bron als het schema
 * op de pagina. Pas daar aan, niet hier.
 */

import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const run = promisify(execFile)

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const MEDIA_DIR = path.join(ROOT, 'public/media')
const EXTENSIONS = ['webp', 'jpg', 'jpeg', 'png', 'tif', 'tiff']

const c = JSON.parse(readFileSync(path.join(ROOT, 'src/lib/credit.json'), 'utf8'))

const copyright = c.copyrightTemplate.replace('{year}', String(new Date().getFullYear()))
const webStatement = `${c.siteUrl}${c.webStatementPath}`
const acquireLicense = `${c.siteUrl}${c.acquireLicensePath}`

const force = process.argv.includes('--force')
const dry = process.argv.includes('--dry')

/** De velden die Google, Adobe en de meeste beeldbanken uitlezen. */
const tags = [
  `-XMP-dc:Creator=${c.creator}`,
  `-XMP-dc:Rights=${copyright}`,
  `-XMP-photoshop:Credit=${c.creditLine}`,
  `-XMP-photoshop:Source=${c.siteName}`,
  `-XMP-xmpRights:Marked=True`,
  `-XMP-xmpRights:WebStatement=${webStatement}`,
  `-XMP-xmpRights:UsageTerms=${c.usageTerms}`,
  `-XMP-plus:LicensorName=${c.copyrightHolder}`,
  `-XMP-plus:LicensorURL=${acquireLicense}`,
  // Echt beeld, geen AI. Zie de over-pagina.
  `-XMP-iptcExt:DigitalSourceType=${c.digitalSourceType}`,
  // IPTC IIM en EXIF Artist voor oudere lezers. WebP kent geen IIM-blok,
  // daar slaat exiftool die velden vanzelf over.
  `-IPTC:By-line=${c.creator}`,
  `-IPTC:CopyrightNotice=${copyright}`,
  `-EXIF:Artist=${c.creator}`,
  `-EXIF:Copyright=${copyright}`,
]

const extArgs = EXTENSIONS.flatMap((ext) => ['-ext', ext])

// Niet alles in public/media is van Daley. Er staat nog materiaal uit de oude
// WordPress-site: stockfoto's van Unsplash en een paar met DALL-E gegenereerde
// banners. Die mogen NOOIT haar naam of copyright krijgen, en een AI-beeld mag
// al helemaal niet als 'met een camera vastgelegd' worden gemarkeerd.
// Zie ook: node scripts/audit-credit.mjs
// exiftool kent geen glob om bestanden uit te sluiten ('--' is voor tags),
// dus dit gaat via een -if op de bestandsnaam.
const NOT_MINE = 'unsplash|dall|pexels|shutterstock|istock|getty|freepik|adobestock'
const excludeArgs = ['-if', `not ($FileName =~ /${NOT_MINE}/i)`]
// Let op: exiftool laat een -if expressie falen zodra de tag niet bestaat.
// `$XMP-dc:Creator ne "..."` matcht daarom juist NIET op bestanden zonder
// credit, precies de bestanden die we zoeken. `not $tag` doet het wel goed.
// Staat er een verkeerde naam in, gebruik dan --force.
const notCredited = ['-if', 'not $XMP-dc:Creator']

async function exiftool(args) {
  try {
    const { stdout, stderr } = await run('exiftool', args, { maxBuffer: 64 * 1024 * 1024 })
    return `${stdout}${stderr}`.trim()
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error('exiftool niet gevonden. Installeer met: brew install exiftool')
      process.exit(1)
    }
    // exiftool geeft exitcode 1 als -if niets matcht. Dat is geen fout.
    return `${err.stdout ?? ''}${err.stderr ?? ''}`.trim()
  }
}

async function count(extra = []) {
  const out = await exiftool(['-q', '-q', '-p', '$FilePath', ...extra, ...extArgs, '-r', MEDIA_DIR])
  return out.split('\n').filter(Boolean).length
}

const total = await count(excludeArgs)
const missing = await count([...notCredited, ...excludeArgs])
const skipped = (await count()) - total

console.log(`Beeldbestanden van Daley : ${total}`)
console.log(`Zonder credit            : ${missing}`)
if (skipped > 0) console.log(`Overgeslagen (niet van jou): ${skipped}`)

if (dry) {
  console.log('\n--dry, er is niets gewijzigd.')
  process.exit(0)
}

const target = force ? total : missing
if (target === 0) {
  console.log('\nNiets te doen, alles draagt al de juiste credit.')
  process.exit(0)
}

console.log(`\nSchrijven naar ${target} bestand(en)...`)

const args = ['-overwrite_original', '-preserve', ...tags]
if (!force) args.push(...notCredited)
args.push(...excludeArgs, ...extArgs, '-r', MEDIA_DIR)

console.log(await exiftool(args))

const left = await count([...notCredited, ...excludeArgs])
console.log(`Controle: ${total - left} van ${total} bestanden dragen nu de credit.`)
