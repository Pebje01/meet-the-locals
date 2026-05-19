/**
 * Seed-script: vult de kaart met een set voorbeeld-fotospots.
 * Draaien:  node --env-file=.env --import tsx ./migrations/seed-photo-spots.ts
 *
 * Slaat zichzelf over zodra er al fotospots bestaan. De voorbeelden zijn
 * later gewoon te verwijderen via de beheeromgeving op /admin.
 */
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const mediaDir = path.resolve(dirname, '../public/media')

type SeedSpot = {
  title: string
  country: string
  region: 'asia' | 'middle-east' | 'south-america'
  lat: number
  lng: number
  story: string
  file: string
  alt: string
  exif: {
    camera: string
    lens: string
    aperture: string
    shutterSpeed: string
    iso: string
    focalLength: string
  }
}

const SEED: SeedSpot[] = [
  {
    title: 'Ochtendlicht bij de bloemenmarkt',
    country: 'Thailand',
    region: 'asia',
    lat: 13.7404,
    lng: 100.4969,
    story:
      'Vroeg in de ochtend bij Pak Khlong Talat. Een verkoopster reeg jasmijnkransen terwijl Bangkok langzaam wakker werd.',
    file: 'bangkok-scaled.webp',
    alt: 'Bloemenmarkt in Bangkok bij ochtendlicht',
    exif: {
      camera: 'Sony A7 IV',
      lens: 'Sony FE 24-70mm f/2.8 GM',
      aperture: 'f/4',
      shutterSpeed: '1/250s',
      iso: '400',
      focalLength: '35mm',
    },
  },
  {
    title: 'Tempels van Ayutthaya',
    country: 'Thailand',
    region: 'asia',
    lat: 14.3551,
    lng: 100.5689,
    story:
      'De oude hoofdstad in de namiddagzon. Een monnik wees me de stilste hoek van het complex aan.',
    file: 'Ayuthayya-1-2-scaled.webp',
    alt: 'Oude tempelruïnes in Ayutthaya',
    exif: {
      camera: 'Sony A7 IV',
      lens: 'Sony FE 16-35mm f/2.8 GM',
      aperture: 'f/8',
      shutterSpeed: '1/500s',
      iso: '100',
      focalLength: '24mm',
    },
  },
  {
    title: 'Zonsondergang boven Langkawi',
    country: 'Maleisië',
    region: 'asia',
    lat: 6.3503,
    lng: 99.7872,
    story:
      'Vanaf een vissersboot keken we toe hoe de zon achter de eilanden zakte. De schipper deelde zijn gegrilde vangst.',
    file: 'langkawi-scaled.webp',
    alt: 'Zonsondergang boven de eilanden van Langkawi',
    exif: {
      camera: 'Sony A7 IV',
      lens: 'Sony FE 70-200mm f/4 G',
      aperture: 'f/5.6',
      shutterSpeed: '1/1000s',
      iso: '200',
      focalLength: '135mm',
    },
  },
  {
    title: 'De trap van Batu Caves',
    country: 'Maleisië',
    region: 'asia',
    lat: 3.2379,
    lng: 101.684,
    story:
      'Tweehonderdzevenenzeventig kleurrijke treden, en bovenaan een grot vol licht en duiven.',
    file: 'Batucaves-6-scaled.webp',
    alt: 'De kleurrijke trap naar Batu Caves',
    exif: {
      camera: 'Sony A7 III',
      lens: 'Sony FE 16-35mm f/2.8 GM',
      aperture: 'f/5.6',
      shutterSpeed: '1/160s',
      iso: '800',
      focalLength: '18mm',
    },
  },
  {
    title: 'Theevelden van Cameron Highlands',
    country: 'Maleisië',
    region: 'asia',
    lat: 4.471,
    lng: 101.3771,
    story:
      'Mist die over de glooiende theevelden rolde. Een plukster vertelde over haar dagen tussen de struiken.',
    file: 'maleisie-7-scaled.webp',
    alt: 'Glooiende theevelden in de Cameron Highlands',
    exif: {
      camera: 'Sony A7 IV',
      lens: 'Sony FE 24-70mm f/2.8 GM',
      aperture: 'f/2.8',
      shutterSpeed: '1/320s',
      iso: '320',
      focalLength: '50mm',
    },
  },
  {
    title: 'Het dorp Shirakawa-go',
    country: 'Japan',
    region: 'asia',
    lat: 36.2578,
    lng: 136.9066,
    story:
      'Rieten daken onder een dik pak sneeuw. Een oude vrouw schonk groene thee terwijl het buiten bleef vallen.',
    file: 'Shirakawago-3.webp',
    alt: 'Boerderijen met rieten daken in Shirakawa-go',
    exif: {
      camera: 'Sony A7 IV',
      lens: 'Sony FE 24-70mm f/2.8 GM',
      aperture: 'f/9',
      shutterSpeed: '1/200s',
      iso: '100',
      focalLength: '28mm',
    },
  },
  {
    title: 'Stilte in Wadi Rum',
    country: 'Jordanië',
    region: 'middle-east',
    lat: 29.5765,
    lng: 35.4203,
    story:
      'Een bedoeïenengids bracht me naar een rotswand met duizend jaar oude tekeningen. Daarna alleen nog wind.',
    file: 'woestijn-3-scaled.jpeg',
    alt: 'Rode rotsformaties in de woestijn van Wadi Rum',
    exif: {
      camera: 'Sony A7 IV',
      lens: 'Sony FE 16-35mm f/2.8 GM',
      aperture: 'f/11',
      shutterSpeed: '1/400s',
      iso: '100',
      focalLength: '20mm',
    },
  },
  {
    title: 'Avond aan de Amazone',
    country: 'Brazilië',
    region: 'south-america',
    lat: -3.119,
    lng: -60.0217,
    story:
      'Vanuit de maloca klonk muziek over het water. De familie nodigde me uit om mee te eten en te dansen.',
    file: 'Dansenmaloca-scaled.webp',
    alt: 'Avondlicht over de Amazone-rivier',
    exif: {
      camera: 'Sony A7 III',
      lens: 'Sony FE 24-70mm f/2.8 GM',
      aperture: 'f/2.8',
      shutterSpeed: '1/125s',
      iso: '1600',
      focalLength: '35mm',
    },
  },
]

async function run() {
  const payload = await getPayload({ config })

  const existing = await payload.count({ collection: 'photo-spots' })
  if (existing.totalDocs > 0) {
    payload.logger.info(
      `Er bestaan al ${existing.totalDocs} fotospots. Seed wordt overgeslagen.`,
    )
    return
  }

  for (const spot of SEED) {
    const media = await payload.create({
      collection: 'media',
      data: { alt: spot.alt },
      filePath: path.join(mediaDir, spot.file),
    })

    await payload.update({
      collection: 'media',
      id: media.id,
      data: { exif: spot.exif },
    })

    await payload.create({
      collection: 'photo-spots',
      data: {
        title: spot.title,
        status: 'published',
        region: spot.region,
        country: spot.country,
        story: spot.story,
        photo: media.id,
        coordinates: { latitude: spot.lat, longitude: spot.lng },
      },
    })

    payload.logger.info(`Fotospot aangemaakt: ${spot.title}`)
  }

  payload.logger.info(`Seed klaar. ${SEED.length} voorbeeld-fotospots toegevoegd.`)
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
