import { getPayload } from 'payload'
import config from '../src/payload.config'
import fs from 'fs'
import path from 'path'

const PHOTOS = [
  { filename: 'singapore-9.webp', alt: 'Singapore 9' },
  { filename: 'singapore-11.webp', alt: 'Singapore 11' },
  { filename: 'singapore-20.webp', alt: 'Singapore 20' },
  { filename: 'singapore-21.webp', alt: 'Singapore 21' },
]

async function main() {
  const payload = await getPayload({ config })

  // Huidige gallery ophalen
  const { docs } = await payload.find({
    collection: 'destinations',
    where: { slug: { equals: 'singapore' } },
    limit: 1,
    depth: 0,
  })

  const dest = docs[0]
  if (!dest) {
    console.error('Singapore bestemming niet gevonden')
    process.exit(1)
  }

  const currentGallery = (dest.gallery as any[]) ?? []
  console.log('Huidige gallery items:', currentGallery.length)

  // Upload elk bestand naar Media
  const newIds: number[] = []

  for (const photo of PHOTOS) {
    const filePath = path.join(process.cwd(), 'public', 'media', photo.filename)

    if (!fs.existsSync(filePath)) {
      console.error(`Bestand niet gevonden: ${filePath}`)
      continue
    }

    const fileBuffer = fs.readFileSync(filePath)
    const fileData = {
      name: photo.filename,
      data: fileBuffer,
      mimetype: 'image/webp',
      size: fileBuffer.length,
    }

    try {
      const media = await payload.create({
        collection: 'media',
        data: { alt: photo.alt },
        file: fileData,
      })
      console.log(`Geupload: ${photo.filename} → ID ${media.id}`)
      newIds.push(media.id as number)
    } catch (err) {
      console.error(`Fout bij uploaden ${photo.filename}:`, err)
    }
  }

  if (newIds.length === 0) {
    console.error('Geen bestanden geupload')
    process.exit(1)
  }

  // Toevoegen aan gallery
  const updatedGallery = [
    ...currentGallery,
    ...newIds.map((id) => ({ image: id })),
  ]

  const updated = await payload.update({
    collection: 'destinations',
    id: dest.id,
    data: { gallery: updatedGallery },
  })

  console.log('Gallery bijgewerkt:', (updated.gallery as any[]).length, 'items totaal')
  process.exit(0)
}

main()
