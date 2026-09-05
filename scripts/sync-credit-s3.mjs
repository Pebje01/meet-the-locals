/**
 * Schrijft dezelfde credit in de beelden die al in de S3-bucket staan.
 *
 * Nodig omdat de site uit twee bronnen serveert: bestanden uit public/media
 * gaan via git mee met een deploy, maar alles wat via de Payload-admin is
 * geüpload staat in S3 en wordt daar rechtstreeks vandaan geserveerd
 * (disablePayloadAccessControl). Die bestanden bereikt write-credit.mjs niet.
 *
 *   node --env-file=.env scripts/sync-credit-s3.mjs --dry   tellen, niets wijzigen
 *   node --env-file=.env scripts/sync-credit-s3.mjs         doorvoeren
 *
 * Vereist exiftool. Werkt op de originelen en op de maatvarianten.
 */

import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { readFileSync, createReadStream } from 'node:fs'
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readdirSync } from 'node:fs'
import { createRequire } from 'node:module'

const run = promisify(execFile)
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dry = process.argv.includes('--dry')

// ─── SDK uit de pnpm-store halen, die is niet naar de top gehoist ───
// Via createRequire, want de dist-es build van de SDK gebruikt extensieloze
// imports die Node's ESM-resolver niet aankan. De CJS-build wel.
const require = createRequire(import.meta.url)

function loadSdk() {
  const store = path.join(ROOT, 'node_modules/.pnpm')
  const dir = readdirSync(store).find((d) => d.startsWith('@aws-sdk+client-s3@'))
  if (!dir) {
    console.error('@aws-sdk/client-s3 niet gevonden. Draai eerst: pnpm install')
    process.exit(1)
  }
  return require(path.join(store, dir, 'node_modules/@aws-sdk/client-s3'))
}

const { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand } = loadSdk()

// ─── Credit, uit dezelfde bron als de rest ───
const c = JSON.parse(readFileSync(path.join(ROOT, 'src/lib/credit.json'), 'utf8'))
const copyright = c.copyrightTemplate.replace('{year}', String(new Date().getFullYear()))

const tags = [
  `-XMP-dc:Creator=${c.creator}`,
  `-XMP-dc:Rights=${copyright}`,
  `-XMP-photoshop:Credit=${c.creditLine}`,
  `-XMP-photoshop:Source=${c.siteName}`,
  '-XMP-xmpRights:Marked=True',
  `-XMP-xmpRights:WebStatement=${c.siteUrl}${c.webStatementPath}`,
  `-XMP-xmpRights:UsageTerms=${c.usageTerms}`,
  `-XMP-plus:LicensorName=${c.copyrightHolder}`,
  `-XMP-plus:LicensorURL=${c.siteUrl}${c.acquireLicensePath}`,
  // Echt beeld, geen AI. Zie de over-pagina.
  `-XMP-iptcExt:DigitalSourceType=${c.digitalSourceType}`,
  `-IPTC:By-line=${c.creator}`,
  `-IPTC:CopyrightNotice=${copyright}`,
  `-EXIF:Artist=${c.creator}`,
  `-EXIF:Copyright=${copyright}`,
]

const BUCKET = process.env.S3_BUCKET
if (!BUCKET) {
  console.error('S3_BUCKET ontbreekt. Draai met: node --env-file=.env scripts/sync-credit-s3.mjs')
  process.exit(1)
}

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || 'auto',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
})

const IMAGE_RE = /\.(webp|jpe?g|png|tiff?)$/i
const MIME = {
  webp: 'image/webp', jpg: 'image/jpeg', jpeg: 'image/jpeg',
  png: 'image/png', tif: 'image/tiff', tiff: 'image/tiff',
}

async function listAll() {
  const keys = []
  let token
  do {
    const res = await s3.send(
      new ListObjectsV2Command({ Bucket: BUCKET, ContinuationToken: token }),
    )
    for (const o of res.Contents ?? []) if (IMAGE_RE.test(o.Key)) keys.push(o.Key)
    token = res.IsTruncated ? res.NextContinuationToken : undefined
  } while (token)
  return keys
}

async function body(key) {
  const res = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }))
  return Buffer.from(await res.Body.transformToByteArray())
}

const keys = await listAll()
console.log(`Beelden in bucket ${BUCKET}: ${keys.length}`)

const dir = await mkdtemp(path.join(tmpdir(), 'mtl-s3-'))
let credited = 0
let written = 0
let failed = 0

try {
  for (const [i, key] of keys.entries()) {
    const local = path.join(dir, path.basename(key))
    try {
      await writeFile(local, await body(key))

      const { stdout } = await run('exiftool', ['-s3', '-XMP-dc:Creator', local])
      if (stdout.trim() === c.creator) {
        credited++
        continue
      }

      if (dry) {
        written++
        continue
      }

      await run('exiftool', ['-overwrite_original', ...tags, local])
      const ext = key.split('.').pop().toLowerCase()
      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: await readFile(local),
          ContentType: MIME[ext] || 'application/octet-stream',
          ACL: 'public-read',
        }),
      )
      written++
    } catch (err) {
      failed++
      console.error(`  fout bij ${key}: ${err.message}`)
    } finally {
      await rm(local, { force: true }).catch(() => {})
    }

    if ((i + 1) % 25 === 0) console.log(`  ${i + 1}/${keys.length}...`)
  }
} finally {
  await rm(dir, { recursive: true, force: true }).catch(() => {})
}

console.log(`\nDroeg al credit : ${credited}`)
console.log(dry ? `Zou geschreven worden : ${written}` : `Geschreven : ${written}`)
if (failed) console.log(`Mislukt : ${failed}`)
if (dry) console.log('\n--dry, er is niets in de bucket gewijzigd.')
