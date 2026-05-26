import { getPayload } from 'payload'
import config from '../src/payload.config'

async function main() {
  const payload = await getPayload({ config })

  const updated = await payload.update({
    collection: 'destinations',
    id: 9, // Singapore
    data: {
      mapCenter: {
        longitude: 97,   // was 103.82 — naar het westen verschoven zodat Singapore rechts in beeld staat
        latitude: 1.35,
      },
    },
  })

  console.log('Updated mapCenter:', updated.mapCenter)
  process.exit(0)
}

main()
