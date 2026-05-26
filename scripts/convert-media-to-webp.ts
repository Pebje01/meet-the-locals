/**
 * Converteert alle JPG/PNG media-bestanden naar WebP,
 * update de Payload media-tabel en vervangt URL-referenties in alle content.
 *
 * Gebruik: npx tsx --env-file=.env scripts/convert-media-to-webp.ts
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { Client } from 'pg'

const MEDIA_DIR = path.join(process.cwd(), 'public', 'media')
const DB_URI = process.env.DATABASE_URI || 'postgresql://localhost:5432/meetthelocals'
const QUALITY = 80
const DRY_RUN = process.argv.includes('--dry-run')

if (DRY_RUN) console.log('--- DRY RUN: geen bestanden worden gewijzigd ---\n')

function toWebpFilename(filename: string): string {
  return filename.replace(/\.(jpg|jpeg|png)$/i, '.webp')
}

function toWebpUrl(url: string | null): string | null {
  if (!url) return null
  return url.replace(/\.(jpg|jpeg|png)(\?.*)?$/i, '.webp')
}

function convertFile(srcPath: string, destPath: string): number {
  if (!fs.existsSync(srcPath)) return 0
  execSync(`cwebp -q ${QUALITY} "${srcPath}" -o "${destPath}" 2>/dev/null`)
  return fs.existsSync(destPath) ? fs.statSync(destPath).size : 0
}

async function main() {
  const client = new Client({ connectionString: DB_URI })
  await client.connect()
  console.log('Verbonden met database\n')

  // Haal alle niet-webp media op
  const { rows: mediaRecords } = await client.query(`
    SELECT id, filename, url, mime_type, filesize,
           sizes_thumbnail_filename, sizes_thumbnail_url, sizes_thumbnail_mime_type,
           sizes_medium_filename, sizes_medium_url, sizes_medium_mime_type,
           sizes_large_filename, sizes_large_url, sizes_large_mime_type,
           sizes_hero_filename, sizes_hero_url, sizes_hero_mime_type
    FROM media
    WHERE mime_type IN ('image/jpeg', 'image/png', 'image/jpg')
    ORDER BY id
  `)

  console.log(`${mediaRecords.length} bestanden te converteren\n`)

  let converted = 0
  let skipped = 0
  const urlMap: Record<string, string> = {} // old url -> new url

  for (const row of mediaRecords) {
    const oldFilename = row.filename
    const newFilename = toWebpFilename(oldFilename)
    const srcPath = path.join(MEDIA_DIR, oldFilename)
    const destPath = path.join(MEDIA_DIR, newFilename)

    console.log(`[${row.id}] ${oldFilename} → ${newFilename}`)

    if (!fs.existsSync(srcPath)) {
      console.log(`  SKIP: bronbestand niet gevonden`)
      skipped++
      continue
    }

    // URL mapping bijhouden voor content-updates
    if (row.url) urlMap[row.url] = toWebpUrl(row.url)!

    if (!DRY_RUN) {
      // Converteer hoofdbestand
      const newFilesize = convertFile(srcPath, destPath)

      // Converteer size-varianten
      const sizes = ['thumbnail', 'medium', 'large', 'hero']
      for (const size of sizes) {
        const sizeFilename = row[`sizes_${size}_filename`]
        if (sizeFilename) {
          const sizeNewFilename = toWebpFilename(sizeFilename)
          const sizeSrc = path.join(MEDIA_DIR, sizeFilename)
          const sizeDest = path.join(MEDIA_DIR, sizeNewFilename)
          convertFile(sizeSrc, sizeDest)
          if (row[`sizes_${size}_url`]) urlMap[row[`sizes_${size}_url`]] = toWebpUrl(row[`sizes_${size}_url`])!
        }
      }

      // Check of de webp-filename al bestaat (vorige deelrun)
      const { rows: existing } = await client.query(
        `SELECT id FROM media WHERE filename = $1 AND id != $2`,
        [newFilename, row.id]
      )
      if (existing.length > 0) {
        console.log(`  SKIP: ${newFilename} al aanwezig als apart record`)
        skipped++
        continue
      }

      // Update media-record in database
      await client.query(`
        UPDATE media SET
          filename = $1,
          url = $2,
          mime_type = 'image/webp',
          filesize = $3,
          sizes_thumbnail_filename = CASE WHEN sizes_thumbnail_filename IS NOT NULL THEN $4 END,
          sizes_thumbnail_url      = CASE WHEN sizes_thumbnail_url IS NOT NULL THEN $5 END,
          sizes_thumbnail_mime_type = CASE WHEN sizes_thumbnail_mime_type IS NOT NULL THEN 'image/webp' END,
          sizes_medium_filename    = CASE WHEN sizes_medium_filename IS NOT NULL THEN $6 END,
          sizes_medium_url         = CASE WHEN sizes_medium_url IS NOT NULL THEN $7 END,
          sizes_medium_mime_type   = CASE WHEN sizes_medium_mime_type IS NOT NULL THEN 'image/webp' END,
          sizes_large_filename     = CASE WHEN sizes_large_filename IS NOT NULL THEN $8 END,
          sizes_large_url          = CASE WHEN sizes_large_url IS NOT NULL THEN $9 END,
          sizes_large_mime_type    = CASE WHEN sizes_large_mime_type IS NOT NULL THEN 'image/webp' END,
          sizes_hero_filename      = CASE WHEN sizes_hero_filename IS NOT NULL THEN $10 END,
          sizes_hero_url           = CASE WHEN sizes_hero_url IS NOT NULL THEN $11 END,
          sizes_hero_mime_type     = CASE WHEN sizes_hero_mime_type IS NOT NULL THEN 'image/webp' END
        WHERE id = $12
      `, [
        newFilename,
        toWebpUrl(row.url),
        newFilesize || row.filesize,
        row.sizes_thumbnail_filename ? toWebpFilename(row.sizes_thumbnail_filename) : null,
        toWebpUrl(row.sizes_thumbnail_url),
        row.sizes_medium_filename ? toWebpFilename(row.sizes_medium_filename) : null,
        toWebpUrl(row.sizes_medium_url),
        row.sizes_large_filename ? toWebpFilename(row.sizes_large_filename) : null,
        toWebpUrl(row.sizes_large_url),
        row.sizes_hero_filename ? toWebpFilename(row.sizes_hero_filename) : null,
        toWebpUrl(row.sizes_hero_url),
        row.id,
      ])

      console.log(`  OK (${Math.round(newFilesize / 1024)}kb)`)
      converted++
    } else {
      console.log(`  DRY-RUN: zou converteren`)
      converted++
    }
  }

  // Update URL-referenties in rich-text content van posts
  if (!DRY_RUN && Object.keys(urlMap).length > 0) {
    console.log(`\nURL-referenties updaten in content...`)

    // Tabellen en kolommen met mogelijke URL-verwijzingen
    const contentFields = [
      { table: 'posts', columns: ['content', 'intro'] },
      { table: '_posts_v', columns: ['version_content', 'version_intro'] },
      { table: 'stories', columns: ['content', 'intro'] },
      { table: '_stories_v', columns: ['version_content', 'version_intro'] },
    ]

    for (const { table, columns } of contentFields) {
      for (const col of columns) {
        // Check of kolom bestaat
        const { rows: colExists } = await client.query(`
          SELECT 1 FROM information_schema.columns
          WHERE table_name = $1 AND column_name = $2
        `, [table, col])

        if (colExists.length === 0) continue

        for (const [oldUrl, newUrl] of Object.entries(urlMap)) {
          if (!oldUrl || !newUrl) continue
          const result = await client.query(
            `UPDATE ${table} SET ${col} = REPLACE(${col}::text, $1, $2)::jsonb
             WHERE ${col}::text LIKE $3`,
            [oldUrl, newUrl, `%${oldUrl}%`]
          )
          if (result.rowCount && result.rowCount > 0) {
            console.log(`  ${table}.${col}: ${result.rowCount} rij(en) bijgewerkt voor ${path.basename(oldUrl)}`)
          }
        }
      }
    }
  }

  console.log(`\n=== KLAAR ===`)
  console.log(`Geconverteerd: ${converted}`)
  console.log(`Overgeslagen:  ${skipped}`)

  if (!DRY_RUN) {
    // Verwijder oude jpg/png bestanden (alleen als webp-versie bestaat)
    console.log(`\nOude bestanden verwijderen...`)
    let deleted = 0
    for (const row of mediaRecords) {
      const oldFilename = row.filename
      const newFilename = toWebpFilename(oldFilename)
      const srcPath = path.join(MEDIA_DIR, oldFilename)
      const destPath = path.join(MEDIA_DIR, newFilename)
      if (fs.existsSync(srcPath) && fs.existsSync(destPath)) {
        fs.unlinkSync(srcPath)
        deleted++
      }
      // Verwijder ook size-varianten
      const sizes = ['thumbnail', 'medium', 'large', 'hero']
      for (const size of sizes) {
        const sizeFilename = row[`sizes_${size}_filename`]
        if (sizeFilename) {
          const sizeSrc = path.join(MEDIA_DIR, sizeFilename)
          const sizeDest = path.join(MEDIA_DIR, toWebpFilename(sizeFilename))
          if (fs.existsSync(sizeSrc) && fs.existsSync(sizeDest)) {
            fs.unlinkSync(sizeSrc)
          }
        }
      }
    }
    console.log(`${deleted} originelen verwijderd`)
  }

  await client.end()
  process.exit(0)
}

main().catch(e => {
  console.error('FOUT:', e.message)
  process.exit(1)
})
