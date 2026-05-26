import { getPayload } from 'payload'
import config from '../src/payload.config'

async function main() {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'destinations',
    where: { slug: { equals: 'singapore' } },
    limit: 1,
    depth: 2,
  })

  const dest = docs[0]
  console.log('Huidige gallery:', JSON.stringify(dest?.gallery, null, 2))

  // Check beschikbare media met 'singapore' in de naam of alt
  const { docs: media } = await payload.find({
    collection: 'media',
    limit: 50,
    depth: 0,
  })

  console.log('\nAlle media (recent):')
  media.forEach((m) => {
    console.log(`  ID ${m.id}: ${m.filename} | alt: ${m.alt ?? '-'} | caption: ${(m as any).caption ?? '-'}`)
  })

  process.exit(0)
}

main()
