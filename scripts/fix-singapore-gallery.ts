import { getPayload } from 'payload'
import config from '../src/payload.config'

async function main() {
  const payload = await getPayload({ config })

  // Zet gallery op exact de 3 unieke Singapore-foto's
  const updated = await payload.update({
    collection: 'destinations',
    where: { slug: { equals: 'singapore' } },
    data: {
      gallery: [
        { image: 98 }, // singapore-skyline.webp
        { image: 99 }, // singapore-2.webp (Marina Bay)
        { image: 100 }, // singapore-3.webp (Gardens by the Bay)
      ],
    },
  })

  console.log('Gallery hersteld:', (updated.docs[0].gallery as any[]).length, 'items')
  process.exit(0)
}

main()
