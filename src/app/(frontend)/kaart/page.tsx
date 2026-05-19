import { getPayload } from 'payload'
import config from '@payload-config'
import { PageHero } from '@/components/PageHero'
import { PhotoMap, type MapSpot } from './PhotoMap'
import type { Media, Post } from '@/payload-types'

export const dynamic = 'force-dynamic'

async function getSpots(): Promise<MapSpot[]> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'photo-spots',
    where: { status: { equals: 'published' } },
    depth: 2,
    limit: 500,
    pagination: false,
  })

  const spots: MapSpot[] = []

  for (const spot of result.docs) {
    const photo = spot.photo
    if (typeof photo !== 'object' || photo === null) continue

    const lat = spot.coordinates?.latitude
    const lng = spot.coordinates?.longitude
    if (typeof lat !== 'number' || typeof lng !== 'number') continue

    const media = photo as Media
    const thumbFile =
      media.sizes?.thumbnail?.filename || media.sizes?.medium?.filename || media.filename
    const photoFile = media.sizes?.medium?.filename || media.filename
    if (!thumbFile || !photoFile) continue

    const related = spot.relatedPost
    const postSlug =
      related && typeof related === 'object' ? ((related as Post).slug ?? null) : null

    spots.push({
      id: spot.id,
      slug: spot.slug ?? null,
      title: spot.title,
      country: spot.country,
      lat,
      lng,
      story: spot.story ?? null,
      thumbUrl: `/media/${thumbFile}`,
      photoUrl: `/media/${photoFile}`,
      alt: media.alt || spot.title,
      camera: media.exif?.camera ?? null,
      lens: media.exif?.lens ?? null,
      aperture: media.exif?.aperture ?? null,
      shutterSpeed: media.exif?.shutterSpeed ?? null,
      iso: media.exif?.iso ?? null,
      focalLength: media.exif?.focalLength ?? null,
      postSlug,
    })
  }

  return spots
}

export default async function KaartPage() {
  const spots = await getSpots()

  return (
    <main>
      <PageHero
        title="Kaart"
        subtitle="Bekijk de interactieve kaart met bestemmingen en bijzondere plekken."
        image="/media/Shirakawago-3.webp"
        imageAlt="Uitzicht over een rivierdal in Azië"
      />

      <section className="mx-auto max-w-[1600px] px-4 py-14 sm:px-6 md:py-20 lg:px-10">
        <div className="mb-8 w-full md:mb-12">
          <h2 className="text-3xl md:text-4xl">De wereld in fotospots</h2>
        </div>

        <PhotoMap spots={spots} />
      </section>
    </main>
  )
}
