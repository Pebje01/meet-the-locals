import { getPayload } from 'payload'
import config from '../src/payload.config'

async function main() {
  const payload = await getPayload({ config })

  const updated = await payload.update({
    collection: 'destinations',
    id: 9, // Singapore
    data: {
      mapScale: 7000,
    },
  })

  console.log('Updated mapScale:', updated.mapScale)
  process.exit(0)
}

main()
