import { getPayload } from 'payload'
import config from '../src/payload.config'

async function main() {
  const payload = await getPayload({ config })

  // Haal huidige gallery op
  const { docs } = await payload.find({
    collection: 'destinations',
    where: { slug: { equals: 'singapore' } },
    limit: 1,
    depth: 0,
  })

  const dest = docs[0]
  const currentGallery = (dest?.gallery as any[]) ?? []

  console.log('Huidige gallery items:', currentGallery.length)
  console.log(JSON.stringify(currentGallery, null, 2))

  // Voeg singapore-2 (ID 99) en singapore-3 (ID 100) toe
  const newGallery = [
    ...currentGallery,
    { image: 99 },
    { image: 100 },
  ]

  const updated = await payload.update({
    collection: 'destinations',
    id: dest.id,
    data: {
      gallery: newGallery,
    },
  })

  console.log('\nGallery bijgewerkt, nu', (updated.gallery as any[]).length, 'items')
  process.exit(0)
}

main()
