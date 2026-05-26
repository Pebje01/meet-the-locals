import { getPayload } from 'payload'
import config from '../src/payload.config'

async function main() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'destinations',
    where: { slug: { equals: 'singapore' } },
    limit: 1,
    depth: 0,
  })

  const dest = docs[0]
  if (dest) {
    console.log('ID:', dest.id)
    console.log('mapScale:', dest.mapScale)
    console.log('mapCenter:', JSON.stringify(dest.mapCenter))
    console.log('coordinates:', JSON.stringify(dest.coordinates))
  }
  process.exit(0)
}

main()
