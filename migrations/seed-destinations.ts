/**
 * Seed: zet alle bestemmingen in Payload met hiërarchie (land > regio > gebied > stad).
 * Draaien: node --env-file=.env --import tsx ./migrations/seed-destinations.ts
 *
 * Let op: verwijdert bestaande destination-records voor een schone slate.
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'
import type { Payload } from 'payload'

// --- Media helper ---
async function buildImageLookup(payload: Payload): Promise<Map<string, number>> {
  const map = new Map<string, number>()
  let page = 1
  while (true) {
    const result = await payload.find({ collection: 'media', limit: 100, page })
    for (const doc of result.docs) {
      if (doc.filename) map.set(doc.filename, doc.id as number)
    }
    if (!result.hasNextPage) break
    page++
  }
  return map
}

function imgId(
  path: string,
  lookup: Map<string, number>,
  fallback: number,
): number {
  const filename = path.replace(/^\/media\//, '')
  return lookup.get(filename) ?? fallback
}

function galleryItems(
  paths: string[],
  lookup: Map<string, number>,
  fallback: number,
) {
  return paths.map((p) => ({ image: imgId(p, lookup, fallback) }))
}

// --- Data ---
type DestData = {
  name: string
  slug: string
  level: 'land' | 'regio' | 'gebied' | 'stad'
  region: string
  parentSlug?: string
  heroImagePath: string
  gallery?: string[]
  eyebrow?: string
  title?: string
  intro?: string
  mood?: string
  population?: string
  flightHours?: string
  mapLabel?: string
  mapScale?: number
  mapCenter?: [number, number]
  markerLng?: number
  markerLat?: number
  countryIds?: string[]
  highlights?: string[]
  places?: string[]
}

const DESTINATIONS: DestData[] = [
  // ─── Landen ──────────────────────────────────────────────────────────────
  {
    name: 'Peru',
    slug: 'peru',
    level: 'land',
    region: 'south-america',
    heroImagePath: '/media/cusco-12-scaled.webp',
    gallery: [
      '/media/cusco-12-scaled.webp',
      '/media/DSC_3016-copy-scaled.webp',
      '/media/image3300.jpg',
      '/media/Peru_daley-4.webp',
    ],
    eyebrow: 'Overview',
    title: 'Peru in lagen van stad, bergen en oude verhalen',
    intro:
      'Peru is een bestemming waar het landschap voortdurend verandert: koloniale straten, hoge bergpassen, markten, ruïnes en uitzichten die je stil maken.',
    mood: 'Andes, cultuur en fotografie',
    population: '33 miljoen',
    flightHours: '±13 uur',
    mapLabel: 'PERU',
    mapScale: 1400,
    mapCenter: [-76, -10],
    markerLng: -75.0152,
    markerLat: -9.19,
    countryIds: ['604'],
    highlights: [
      'Cusco als uitvalsbasis',
      'Machu Picchu en de Sacred Valley',
      'Fotogenieke markten en berglicht',
    ],
    places: ['Lima', 'Cusco', 'Sacred Valley', 'Machu Picchu'],
  },
  {
    name: 'Maleisië',
    slug: 'maleisie',
    level: 'land',
    region: 'asia',
    heroImagePath: '/media/maleisie-7-scaled.webp',
    gallery: [
      '/media/maleisie-7-scaled.webp',
      '/media/maleisie-5-scaled.webp',
      '/media/maleisie-6-scaled.webp',
      '/media/maleisie-2.jpg',
      '/media/maleisie-8b.jpg',
      '/media/Malaysia-1-7-1-scaled.webp',
      '/media/Batucaves-6-scaled.webp',
      '/media/Cameronhighlands-1-scaled.webp',
    ],
    eyebrow: 'Overview',
    title: 'Maleisië tussen jungle, stad en eilandrust',
    intro:
      'Maleisië voelt als meerdere reizen in één: drukke foodcourts, groene hooglanden, kleurrijke tempels en stranden waar de dag vanzelf vertraagt.',
    mood: 'Food, jungle en eilanden',
    population: '33 miljoen',
    flightHours: '±12 uur',
    mapLabel: 'MALEISIË',
    mapScale: 1400,
    mapCenter: [103, 4],
    markerLng: 101.9758,
    markerLat: 4.2105,
    countryIds: ['458'],
    highlights: [
      'Kuala Lumpur en Batu Caves',
      'Cameron Highlands',
      'Langkawi als eilandstop',
    ],
    places: ['Kuala Lumpur', 'Batu Caves', 'Cameron Highlands', 'Langkawi'],
  },
  {
    name: 'Thailand',
    slug: 'thailand',
    level: 'land',
    region: 'asia',
    heroImagePath: '/media/bangkok-scaled.webp',
    gallery: [
      '/media/bangkok-scaled.webp',
      '/media/Ayuthayya-1-2-scaled.webp',
      '/media/Ayuthayya-1-4-scaled.webp',
      '/media/Ayuthayya-1-9-scaled.webp',
    ],
    eyebrow: 'Overview',
    title: 'Thailand met Bangkok als eerste indruk',
    intro:
      'Thailand staat hier vooral voor Bangkok: een stad vol contrast, streetfood, tempels, verkeer en kleine momenten tussen de drukte door.',
    mood: 'Stad, tempels en food',
    population: '70 miljoen',
    flightHours: '±11 uur',
    mapLabel: 'THAILAND',
    mapScale: 1500,
    mapCenter: [101, 14],
    markerLng: 100.5018,
    markerLat: 13.7563,
    countryIds: ['764'],
    highlights: [
      'Bangkok streetfood',
      'Tempels en rivierleven',
      'Ayutthaya als dagtrip',
    ],
    places: ['Bangkok', 'Ayutthaya'],
  },
  {
    name: 'Indonesië',
    slug: 'indonesie',
    level: 'land',
    region: 'asia',
    heroImagePath: '/media/DJI_20240517152816_0082_D-scaled.webp',
    gallery: [
      '/media/DJI_20240517152816_0082_D-scaled.webp',
      '/media/IMG_2243-scaled.jpeg',
      '/media/indonesie.jpg',
      '/media/indonesie-2.jpg',
      '/media/Tepus.jpg',
      '/media/Yogya_Jungle.jpg',
    ],
    eyebrow: 'Overview',
    title: 'Indonesië van Java tot Lombok',
    intro:
      'Indonesië is groot en gelaagd. Deze pagina bundelt de plekken waar ik ben geweest: Java, Bali en Lombok, elk met een eigen tempo en sfeer.',
    mood: 'Eilanden, rijstvelden en vulkanen',
    population: '278 miljoen',
    flightHours: '±14 uur',
    mapLabel: 'INDONESIË',
    mapScale: 1200,
    mapCenter: [116, -4],
    markerLng: 113.9213,
    markerLat: -7.8,
    countryIds: ['360'],
    highlights: [
      'Java als cultureel startpunt',
      'Bali voor rijstvelden en kust',
      'Lombok voor rustiger eilandgevoel',
    ],
    places: ['Java', 'Bali', 'Lombok'],
  },
  {
    name: 'Vietnam',
    slug: 'vietnam',
    level: 'land',
    region: 'asia',
    heroImagePath: '/media/1920x540.webp',
    gallery: [
      '/media/1920x540.webp',
      '/media/image850.jpg',
      '/media/image881.jpg',
    ],
    eyebrow: 'Overview',
    title: 'Vietnam van stadsgeluid naar groene routes',
    intro:
      'Vietnam is een land van beweging: scooters, markten, lange afstanden en landschappen die van stad naar kust naar bergen verschuiven.',
    mood: 'Routes, food en landschap',
    population: '97 miljoen',
    flightHours: '±11 uur',
    mapLabel: 'VIETNAM',
    mapScale: 1600,
    mapCenter: [107, 16],
    markerLng: 107.8333,
    markerLat: 16.1667,
    countryIds: ['704'],
    highlights: [
      'Steden vol energie',
      'Kust en groene routes',
      'Veel streetfood en kleine stops',
    ],
    places: ['Vietnam', 'Stadsroutes', 'Kust en bergen'],
  },
  {
    name: 'Japan',
    slug: 'japan',
    level: 'land',
    region: 'asia',
    heroImagePath: '/media/Shirakawago-3.webp',
    gallery: [
      '/media/Shirakawago-3.webp',
      '/media/Shirakawago-4.jpg',
      '/media/MtFuji-1.jpg',
      '/media/Tokyo_cityscape-1.jpg',
      '/media/nara-1.jpg',
    ],
    eyebrow: 'Overview',
    title: 'Japan op het mainland, van stad tot bergdorp',
    intro:
      'Japan is precies en verrassend tegelijk: grote steden, kleine rituelen, bergdorpen en plekken waar zelfs de stilte ontworpen lijkt.',
    mood: 'Steden, dorpen en details',
    population: '125 miljoen',
    flightHours: '±12 uur',
    mapLabel: 'JAPAN',
    mapScale: 1400,
    mapCenter: [138, 37],
    markerLng: 138.2529,
    markerLat: 36.2048,
    countryIds: ['392'],
    highlights: [
      'Shirakawa-go en bergdorpen',
      'Stedelijke ritmes',
      'Details in eten, stations en straten',
    ],
    places: ['Mainland Japan', 'Shirakawa-go', 'Stadsroutes'],
  },
  {
    name: 'Singapore',
    slug: 'singapore',
    level: 'land',
    region: 'asia',
    heroImagePath: '/media/Franksunset-scaled.webp',
    gallery: [
      '/media/Franksunset-scaled.webp',
      '/media/image833.jpg',
      '/media/image929.jpg',
    ],
    eyebrow: 'City stop',
    title: 'Singapore als compacte stad vol contrast',
    intro:
      'Singapore is compact, maar vol contrast: glanzende skyline, groen, hawker food en wijken waar veel culturen samenkomen.',
    mood: 'Stad, food en skyline',
    population: '6 miljoen',
    flightHours: '±12 uur',
    mapLabel: 'SINGAPORE',
    mapScale: 2200,
    mapCenter: [104, 2],
    markerLng: 103.8198,
    markerLat: 1.3521,
    countryIds: ['702'],
    highlights: [
      'Hawker food',
      'Skyline en stadsparken',
      'Compacte routes te voet',
    ],
    places: ['Singapore', 'Hawker centres', 'Skyline'],
  },
  {
    name: 'Marokko',
    slug: 'marokko',
    level: 'land',
    region: 'africa',
    heroImagePath: '/media/woestijn-9-scaled.webp',
    gallery: [
      '/media/woestijn-9-scaled.webp',
      '/media/woestijn-3-scaled.jpeg',
      '/media/woestijn-3-scaled-1.jpeg',
    ],
    eyebrow: 'Overview',
    title: 'Marokko in kleur, warmte en ritme',
    intro:
      'Marokko is een bestemming van kleur en ritme: markten, binnenplaatsen, warm licht en geuren die meteen onderdeel van je herinnering worden.',
    mood: 'Kleur, medina en woestijnlicht',
    population: '37 miljoen',
    flightHours: '±3,5 uur',
    mapLabel: 'MAROKKO',
    mapScale: 1300,
    mapCenter: [-6, 31],
    markerLng: -7.9811,
    markerLat: 31.6295,
    countryIds: ['504'],
    highlights: [
      'Marrakesh',
      'Medina-details',
      'Warm licht voor fotografie',
    ],
    places: ['Marrakesh', 'Medina', 'Woestijnsfeer'],
  },
  {
    name: 'Colombia',
    slug: 'colombia',
    level: 'land',
    region: 'south-america',
    heroImagePath: '/media/Dansenmaloca-scaled.webp',
    gallery: [
      '/media/Dansenmaloca-scaled.webp',
      '/media/image3344.jpg',
    ],
    eyebrow: 'Overview',
    title: 'Colombia met verhalen tussen natuur en cultuur',
    intro:
      'Colombia staat hier voor ontmoetingen, natuur en cultuur. Een bestemming waar de reis niet alleen in landschappen zit, maar vooral in verhalen.',
    mood: 'Natuur, mensen en cultuur',
    population: '52 miljoen',
    flightHours: '±12 uur',
    mapLabel: 'COLOMBIA',
    mapScale: 1400,
    mapCenter: [-74, 5],
    markerLng: -74.2973,
    markerLat: 4.5709,
    countryIds: ['170'],
    highlights: [
      'Lokale verhalen',
      'Natuur en ritme',
      'Fotografie met mensen en context',
    ],
    places: ['Colombia', 'Lokale gemeenschappen', 'Natuurgebieden'],
  },
  {
    name: 'Italië',
    slug: 'italie',
    level: 'land',
    region: 'europe',
    heroImagePath: '/media/woestijn-9-scaled-800x532.jpg',
    gallery: [
      '/media/woestijn-9-scaled-800x532.jpg',
      '/media/Franksunset-scaled.webp',
      '/media/kellys-scaled.jpg',
    ],
    eyebrow: 'Overview',
    title: 'Italië van noord naar zuid in smaak en landschap',
    intro:
      'Italië is op deze site een verzameling routes: van meren en dorpen in het noorden tot eten, kust en trage wegen verder naar het zuiden.',
    mood: 'Food, dorpen en routes',
    population: '60 miljoen',
    flightHours: '±2,5 uur',
    mapLabel: 'ITALIË',
    mapScale: 1500,
    mapCenter: [12, 42],
    markerLng: 12.5674,
    markerLat: 41.8719,
    countryIds: ['380'],
    highlights: [
      'Como en Lombardia',
      'Puglia en zuidelijke sfeer',
      'Emilia-Romagna en food',
    ],
    places: ['Como', 'Apulië', 'Emilia-Romagna', 'Toscane', 'Marche', 'Calabria'],
  },
  {
    name: 'Spanje',
    slug: 'spanje',
    level: 'land',
    region: 'europe',
    heroImagePath: '/media/Franksunset-scaled.webp',
    gallery: [
      '/media/Franksunset-scaled.webp',
      '/media/image833.jpg',
      '/media/woestijn-3-scaled.jpeg',
    ],
    eyebrow: 'Overview',
    title: 'Spanje met Sevilla als warme stadsstop',
    intro:
      'Spanje draait hier om warme straten, eten, pleinen en dat relaxte ritme waarin een stad pas later op de dag echt wakker lijkt te worden.',
    mood: 'Stad, zon en food',
    population: '47 miljoen',
    flightHours: '±2,5 uur',
    mapLabel: 'SPANJE',
    mapScale: 1400,
    mapCenter: [-4, 40],
    markerLng: -5.9845,
    markerLat: 37.3891,
    countryIds: ['724'],
    highlights: ['Sevilla', 'Avondlicht', 'Eten en pleinen'],
    places: ['Sevilla', 'Stadsroutes'],
  },
  {
    name: 'Frankrijk',
    slug: 'frankrijk',
    level: 'land',
    region: 'europe',
    heroImagePath: '/media/kellys-scaled-800x533.jpg',
    gallery: [
      '/media/kellys-scaled-800x533.jpg',
      '/media/Franksunset-scaled.webp',
    ],
    eyebrow: 'Overview',
    title: 'Frankrijk dichtbij, maar nooit hetzelfde',
    intro:
      'Frankrijk is dichtbij, maar verandert snel per regio. Op deze pagina staat de combinatie van stadsritme, eten en sfeer centraal.',
    mood: 'Stad, eten en sfeer',
    population: '68 miljoen',
    flightHours: '±1,5 uur',
    mapLabel: 'FRANKRIJK',
    mapScale: 1400,
    mapCenter: [2, 46],
    markerLng: 2.3522,
    markerLat: 48.8566,
    countryIds: ['250'],
    highlights: ['Parijs', 'Straten en cafés', 'Korte routes dichtbij huis'],
    places: ['Parijs', 'Cafés', 'Stadsroutes'],
  },
  {
    name: 'Duitsland',
    slug: 'duitsland',
    level: 'land',
    region: 'europe',
    heroImagePath: '/media/Shirakawago-3.webp',
    gallery: [
      '/media/Shirakawago-3.webp',
      '/media/image3344.jpg',
    ],
    eyebrow: 'Overview',
    title: 'Duitsland net over de grens en verder',
    intro:
      'Duitsland is ideaal voor korte routes met veel afwisseling: vakwerk, heuvels, steden en regio\'s die je makkelijk over het hoofd ziet.',
    mood: 'Korte trips en regio\'s',
    population: '84 miljoen',
    flightHours: '±1,5 uur',
    mapLabel: 'DUITSLAND',
    mapScale: 1500,
    mapCenter: [10, 51],
    markerLng: 9.3059,
    markerLat: 48.7395,
    countryIds: ['276'],
    highlights: ['Hunsrück', 'Esslingen am Neckar', 'Dichtbij maar anders'],
    places: ['Hunsrück', 'Esslingen am Neckar'],
  },
  {
    name: 'Nederland',
    slug: 'nederland',
    level: 'land',
    region: 'europe',
    heroImagePath: '/media/DSC_3016-copy-scaled.webp',
    gallery: ['/media/DSC_3016-copy-scaled.webp'],
    eyebrow: 'Overview',
    title: 'Nederland als dichtbij-bestemming',
    intro:
      'Ook dichtbij huis zijn er plekken die voelen als een kleine reis. Nederland krijgt hier ruimte voor lokale adressen, korte routes en fotografie om de hoek.',
    mood: 'Dichtbij en lokaal',
    population: '18 miljoen',
    flightHours: 'Thuisland',
    mapLabel: 'NEDERLAND',
    mapScale: 1800,
    mapCenter: [5, 52],
    markerLng: 5.2913,
    markerLat: 52.1326,
    countryIds: ['528'],
    highlights: ['Lokale adressen', 'Korte routes', 'Fotografie dichtbij huis'],
    places: ['Nederland', 'Lokale plekken'],
  },
  {
    name: 'Ierland',
    slug: 'ierland',
    level: 'land',
    region: 'europe',
    heroImagePath: '/media/image3344.jpg',
    gallery: ['/media/image3344.jpg', '/media/image3344-800x449.jpg'],
    eyebrow: 'Overview',
    title: 'Ierland in groen, kust en pubwarmte',
    intro:
      'Ierland heeft een directe sfeer: groen, kust, wind en warme plekken waar je na een dag buiten wilt blijven hangen.',
    mood: 'Kust, groen en pubs',
    population: '5 miljoen',
    flightHours: '±2 uur',
    mapLabel: 'IERLAND',
    mapScale: 1600,
    mapCenter: [-8, 53],
    markerLng: -8.2439,
    markerLat: 53.4129,
    countryIds: ['372'],
    highlights: ['Groene landschappen', 'Kustwegen', 'Warme pubcultuur'],
    places: ['Ierland', 'Kustroutes', 'Groene landschappen'],
  },
  {
    name: 'Nieuw-Zeeland',
    slug: 'nieuw-zeeland',
    level: 'land',
    region: 'oceania',
    heroImagePath: '/media/woestijn-3-scaled-1.jpeg',
    gallery: [
      '/media/woestijn-3-scaled-1.jpeg',
      '/media/woestijn-3-scaled.jpeg',
    ],
    eyebrow: 'Overview',
    title: 'Nieuw-Zeeland als grote natuurroute',
    intro:
      'Nieuw-Zeeland is een bestemming voor grote natuur en lange routes. Het soort plek waar de weg zelf vaak net zo belangrijk is als de stop.',
    mood: 'Natuur en roadtrip',
    population: '5 miljoen',
    flightHours: '±25 uur',
    mapLabel: 'NIEUW-ZEELAND',
    mapScale: 1200,
    mapCenter: [173, -41],
    markerLng: 174.886,
    markerLat: -40.9006,
    countryIds: ['554'],
    highlights: ['Roadtriproutes', 'Grote natuur', 'Fotografie onderweg'],
    places: ['Nieuw-Zeeland', 'Roadtriproutes', 'Natuurgebieden'],
  },
  {
    name: 'Verenigde Staten',
    slug: 'verenigde-staten',
    level: 'land',
    region: 'north-america',
    heroImagePath: '/media/newyork-1-scaled.webp',
    gallery: [
      '/media/newyork-1-scaled.webp',
      '/media/newyork-1-scaled-800x532.jpg',
      '/media/kellys-scaled.jpg',
    ],
    eyebrow: 'Overview',
    title: 'Verenigde Staten van citytrip tot roadtrip',
    intro:
      'De Verenigde Staten staan op Meet the Locals voor contrast: New Yorkse energie, Florida-zon en roadtrips waar de afstanden onderdeel van de reis zijn.',
    mood: 'Steden en roadtrips',
    population: '335 miljoen',
    flightHours: '±9–11 uur',
    mapLabel: 'VERENIGDE STATEN',
    mapScale: 900,
    mapCenter: [-98, 38],
    markerLng: -98.5795,
    markerLat: 39.8283,
    countryIds: ['840'],
    highlights: [
      'New York als stedentrip',
      'Florida voor zon en kust',
      'Westkust en Route 66 als roadtripgevoel',
    ],
    places: ['New York', 'Florida', 'Westkust', 'Route 66'],
  },

  // ─── Regio's ──────────────────────────────────────────────────────────────
  {
    name: 'Langkawi',
    slug: 'langkawi',
    level: 'regio',
    region: 'asia',
    parentSlug: 'maleisie',
    heroImagePath: '/media/langkawi-scaled.webp',
    gallery: [
      '/media/langkawi-scaled.webp',
      '/media/langkawi-scaled-800x532.webp',
      '/media/ombakvilla-scaled.jpg',
    ],
    eyebrow: 'Eiland',
    title: 'Langkawi voor uitzicht, zee en een rustiger ritme',
    intro:
      'Langkawi is het rustige hoofdstuk van Maleisië: groen, water, kleine wegen en plekken waar je vooral wilt blijven hangen rond zonsondergang.',
    mood: 'Eiland, natuur en rust',
    population: '±100.000',
    flightHours: '±12 uur',
    mapLabel: 'LANGKAWI',
    mapScale: 1600,
    mapCenter: [101, 5],
    markerLng: 99.8,
    markerLat: 6.35,
    countryIds: ['458'],
    highlights: [
      'Uitzicht vanaf hoger gelegen punten',
      'Kust en eilandroutes',
      'Zachte avondlucht voor fotografie',
    ],
    places: ['Langkawi', 'Pantai Cenang', 'Eilandroutes'],
  },
  {
    name: 'Kuala Lumpur',
    slug: 'kuala-lumpur',
    level: 'regio',
    region: 'asia',
    parentSlug: 'maleisie',
    heroImagePath: '/media/Batucaves-6-scaled.webp',
    gallery: ['/media/Batucaves-6-scaled.webp'],
    eyebrow: 'Stad',
    title: 'Kuala Lumpur: skyline, food en Batu Caves',
    intro:
      'Kuala Lumpur is een stad met veel tegelijk: moderne skyline, foodcourts, kleurrijke tempels en de energie van een echte Aziatische metropool.',
    mood: 'Stad, food en cultuur',
    mapLabel: 'KUALA LUMPUR',
    mapScale: 1600,
    mapCenter: [103, 4],
    markerLng: 101.6869,
    markerLat: 3.139,
    countryIds: ['458'],
    highlights: ['Batu Caves', 'Hawker food', 'Stadsenergie'],
    places: ['Kuala Lumpur', 'Batu Caves', 'Stadscentrum'],
  },
  {
    name: 'Cameron Highlands',
    slug: 'cameron-highlands',
    level: 'regio',
    region: 'asia',
    parentSlug: 'maleisie',
    heroImagePath: '/media/Cameronhighlands-1-scaled.webp',
    gallery: ['/media/Cameronhighlands-1-scaled.webp'],
    eyebrow: 'Regio',
    title: 'Cameron Highlands: theevelden boven de tropische warmte',
    intro:
      'Cameron Highlands verrast met koele lucht, eindeloze theevelden en heuvels die ver boven het tropische hittelandschap uitsteken.',
    mood: 'Natuur, thee en rust',
    mapLabel: 'CAMERON HIGHLANDS',
    mapScale: 1600,
    mapCenter: [102, 4.5],
    markerLng: 101.3781,
    markerLat: 4.4696,
    countryIds: ['458'],
    highlights: ['Theeplantages', 'Koele lucht en groen', 'Scenic routes'],
    places: ['Cameron Highlands', 'Theevelden'],
  },
  {
    name: 'Bangkok',
    slug: 'bangkok',
    level: 'stad',
    region: 'asia',
    parentSlug: 'thailand',
    heroImagePath: '/media/bangkok-scaled.webp',
    gallery: [
      '/media/bangkok-scaled.webp',
      '/media/Ayuthayya-1-9-scaled.webp',
      '/media/Ayuthayya-1-2-scaled.webp',
    ],
    eyebrow: 'Stad',
    title: 'Bangkok in tempels, verkeer en avondlicht',
    intro:
      'Bangkok is geen plek die je in één wandeling begrijpt. Juist de mix van tempels, markten, food en chaos maakt het een bestemming die blijft trekken.',
    mood: 'Streetfood en stadsenergie',
    population: '±10 miljoen',
    flightHours: '±11 uur',
    mapLabel: 'BANGKOK',
    mapScale: 1700,
    mapCenter: [101, 14],
    markerLng: 100.5018,
    markerLat: 13.7563,
    countryIds: ['764'],
    highlights: [
      'Streetfood in de avond',
      'Tempels langs de rivier',
      'Contrasten tussen rust en drukte',
    ],
    places: ['Bangkok', 'Chao Phraya', 'Tempelroutes'],
  },
  {
    name: 'Java',
    slug: 'java',
    level: 'regio',
    region: 'asia',
    parentSlug: 'indonesie',
    heroImagePath: '/media/DJI_20240517152816_0082_D-scaled.webp',
    gallery: [
      '/media/DJI_20240517152816_0082_D-scaled.webp',
      '/media/Yogya_Jungle.jpg',
      '/media/Yogya_Jungle-2.jpg',
    ],
    eyebrow: 'Eiland',
    title: 'Java als cultureel hart van Indonesië',
    intro:
      'Java voelt intens en rijk: drukke steden, tempels, treinroutes en landschappen die steeds weer veranderen.',
    mood: 'Cultuur en routes',
    population: '±145 miljoen',
    flightHours: '±14 uur',
    mapLabel: 'JAVA',
    mapScale: 1800,
    mapCenter: [112, -7],
    markerLng: 110.7122,
    markerLat: -7.6145,
    countryIds: ['360'],
    highlights: ['Treinroutes door Java', 'Tempels en lokale stops', 'Fotografie onderweg'],
    places: ['Java', 'Yogyakarta', 'Tempelroutes'],
  },
  {
    name: 'Bali',
    slug: 'bali',
    level: 'regio',
    region: 'asia',
    parentSlug: 'indonesie',
    heroImagePath: '/media/IMG_2243-scaled.jpeg',
    gallery: [
      '/media/IMG_2243-scaled.jpeg',
      '/media/DJI_20240517152816_0082_D-scaled.webp',
      '/media/image1086.jpg',
    ],
    eyebrow: 'Eiland',
    title: 'Bali voorbij alleen het perfecte plaatje',
    intro:
      'Bali is bekend, maar tussen de bekende stops zitten nog genoeg rustige momenten: rijstvelden, kleine wegen, tempels en licht dat alles zacht maakt.',
    mood: 'Rijstvelden en kust',
    population: '±4 miljoen',
    flightHours: '±14 uur',
    mapLabel: 'BALI',
    mapScale: 1800,
    mapCenter: [116, -7],
    markerLng: 115.092,
    markerLat: -8.3405,
    countryIds: ['360'],
    highlights: ['Rijstvelden in zacht licht', 'Tempels en kustplekken', 'Rustige routes buiten de drukte'],
    places: ['Bali', 'Rijstvelden', 'Kustroutes'],
  },
  {
    name: 'Lombok',
    slug: 'lombok',
    level: 'regio',
    region: 'asia',
    parentSlug: 'indonesie',
    heroImagePath: '/media/Tepus.jpg',
    gallery: [
      '/media/Tepus.jpg',
      '/media/Tepus-2.jpg',
      '/media/Tepus-5.jpg',
      '/media/Tepus-10.jpg',
    ],
    eyebrow: 'Eiland',
    title: 'Lombok met meer ruimte en minder haast',
    intro:
      'Lombok voelt ruimer en rustiger dan veel bekende eilandstops. Het is een plek voor kustwegen, open uitzichten en langzamer reizen.',
    mood: 'Rust, kust en ruimte',
    population: '±3 miljoen',
    flightHours: '±14 uur',
    mapLabel: 'LOMBOK',
    mapScale: 1800,
    mapCenter: [116, -7],
    markerLng: 116.3249,
    markerLat: -8.65,
    countryIds: ['360'],
    highlights: ['Kustwegen', 'Rustiger eilandtempo', 'Uitzichten en open landschappen'],
    places: ['Lombok', 'Kustroutes', 'Heuvels'],
  },
  {
    name: 'New York',
    slug: 'new-york',
    level: 'stad',
    region: 'north-america',
    parentSlug: 'verenigde-staten',
    heroImagePath: '/media/newyork-1-scaled.webp',
    gallery: [
      '/media/newyork-1-scaled.webp',
      '/media/newyork-1-scaled-800x532.jpg',
    ],
    eyebrow: 'Stad',
    title: 'New York in lagen van straten, licht en energie',
    intro:
      'New York is groot, direct en fotogeniek. De stad werkt vooral goed als je niet alleen naar highlights kijkt, maar naar straten, ritmes en licht.',
    mood: 'Stad, fotografie en eten',
    population: '±8 miljoen',
    flightHours: '±9 uur',
    mapLabel: 'NEW YORK',
    mapScale: 1200,
    mapCenter: [-87, 39],
    markerLng: -74.006,
    markerLat: 40.7128,
    countryIds: ['840'],
    highlights: ['Straatfotografie', 'Skyline en buurten', 'Foodspots en kleine routes'],
    places: ['New York City', 'Manhattan', 'Brooklyn'],
  },
  {
    name: 'Florida',
    slug: 'florida',
    level: 'regio',
    region: 'north-america',
    parentSlug: 'verenigde-staten',
    heroImagePath: '/media/kellys-scaled.jpg',
    gallery: [
      '/media/kellys-scaled.jpg',
      '/media/kellys-scaled-800x533.jpg',
    ],
    eyebrow: 'State',
    title: 'Florida met zon, routes en kustgevoel',
    intro:
      'Florida voelt lichter en losser: kust, zon, routes en plekken waar de reis minder om planning en meer om onderweg zijn draait.',
    mood: 'Zon, kust en roadtrip',
    population: '22 miljoen',
    flightHours: '±10 uur',
    mapLabel: 'FLORIDA',
    mapScale: 1400,
    mapCenter: [-87, 31],
    markerLng: -81.5158,
    markerLat: 27.6648,
    countryIds: ['840'],
    highlights: ['Kustwegen', 'Zon en open routes', 'Roadtripgevoel'],
    places: ['Florida', 'Kust', 'Roadtriproutes'],
  },

  // --- Italië sub-bestemmingen ---
  {
    name: 'Como',
    slug: 'como',
    level: 'regio',
    region: 'europe',
    parentSlug: 'italie',
    heroImagePath: '/media/Franksunset-scaled.webp',
    gallery: ['/media/Franksunset-scaled.webp'],
    eyebrow: 'Regio',
    title: 'Como: meer, bergen en kleine dorpjes in Lombardia',
    intro:
      'Het Comomeer is het mooiste meer van Italië, omgeven door bergwanden, pastelkleurige dorpjes en water dat afhankelijk van het licht van kleur verandert.',
    mood: 'Meer, natuur en dorpen',
    mapLabel: 'COMO',
    mapScale: 2000,
    mapCenter: [9.3, 46],
    markerLng: 9.0832,
    markerLat: 45.8118,
    countryIds: ['380'],
    highlights: ['Comomeer en omgeving', 'Kleine dorpjes langs het water', 'Rijdend berglandschap'],
    places: ['Como', 'Bellagio', 'Varenna'],
  },
  {
    name: 'Apulië',
    slug: 'apulie',
    level: 'regio',
    region: 'europe',
    parentSlug: 'italie',
    heroImagePath: '/media/woestijn-9-scaled-800x532.jpg',
    gallery: ['/media/woestijn-9-scaled-800x532.jpg'],
    eyebrow: 'Regio',
    title: 'Apulië: de hak van de laars in zon, olijven en slow food',
    intro:
      'Apulië is het zuidelijke Italië zoals het altijd had moeten zijn: trulli, witgekalkte stadjes, eindeloze olijfgaarden en een keuken die niet voor de toerist bestaat maar voor zichzelf.',
    mood: 'Zon, food en witte dorpen',
    mapLabel: 'APULIË',
    mapScale: 1800,
    mapCenter: [16.5, 41],
    markerLng: 16.5727,
    markerLat: 40.7937,
    countryIds: ['380'],
    highlights: [
      'Trulli-architectuur in de Valle d\'Itria',
      'Witgekalkte stadjes en slow food',
      'Kust van de Adriatische en Ionische Zee',
    ],
    places: ['Valle d\'Itria', 'Alberobello', 'Locorotondo', 'Ostuni', 'Lecce', 'Bari'],
  },
  {
    name: 'Emilia-Romagna',
    slug: 'emilia-romagna',
    level: 'regio',
    region: 'europe',
    parentSlug: 'italie',
    heroImagePath: '/media/image833.jpg',
    gallery: ['/media/image833.jpg'],
    eyebrow: 'Regio',
    title: 'Emilia-Romagna: van Bologna tot de kust',
    intro:
      'Emilia-Romagna heeft de beste regionale keuken van het land: verse pasta, Parmezaan, Prosciutto di Parma en een foodcultuur die alles serieus neemt.',
    mood: 'Food, cultuur en stad',
    mapLabel: 'EMILIA-ROMAGNA',
    mapScale: 1800,
    mapCenter: [11.5, 44.5],
    markerLng: 11.3426,
    markerLat: 44.4938,
    countryIds: ['380'],
    highlights: ['Bologna en de toren', 'De beste pasta van Italië', 'Food van de regio'],
    places: ['Bologna', 'Parma', 'Modena', 'Rimini'],
  },
  {
    name: 'Toscane',
    slug: 'toscane',
    level: 'regio',
    region: 'europe',
    parentSlug: 'italie',
    heroImagePath: '/media/DSC_3016-copy-scaled.webp',
    gallery: ['/media/DSC_3016-copy-scaled.webp'],
    eyebrow: 'Regio',
    title: 'Toscane: glooiende heuvels, wijn en een eigen tempo',
    intro:
      'Toscane is het Italië van de schilderijen: glooiende heuvels, cipressenrijen, middeleeuwse steden en wijn die je drinkt terwijl de avond valt.',
    mood: 'Heuvels, wijn en middeleeuwse steden',
    mapLabel: 'TOSCANE',
    mapScale: 1800,
    mapCenter: [11.5, 43.5],
    markerLng: 11.2558,
    markerLat: 43.7711,
    countryIds: ['380'],
    highlights: ['Siena en San Gimignano', 'Val d\'Orcia als rijbaan', 'Chianti-wijnroutes'],
    places: ['Florence', 'Siena', 'Lucca', 'Val d\'Orcia'],
  },
  {
    name: 'Marche',
    slug: 'marche',
    level: 'regio',
    region: 'europe',
    parentSlug: 'italie',
    heroImagePath: '/media/DSC_3088-scaled.webp',
    gallery: ['/media/DSC_3088-scaled.webp'],
    eyebrow: 'Regio',
    title: 'Marche: onbekende kust en groene heuvels',
    intro:
      'Marche is de regio die iedereen overslaat. Dat is precies waarom het de moeite waard is: groene heuvels, een rustige Adriatische kust en dorpen zonder toeristen.',
    mood: 'Onbekend, kust en heuvels',
    mapLabel: 'MARCHE',
    mapScale: 1800,
    mapCenter: [13.5, 43.5],
    markerLng: 13.2673,
    markerLat: 43.6158,
    countryIds: ['380'],
    highlights: ['Minder bezochte Adriatische kust', 'Middeleeuwse heuveldorpen', 'Rustig reistempo'],
    places: ['Urbino', 'Pesaro', 'Macerata'],
  },
  {
    name: 'Calabria',
    slug: 'calabria',
    level: 'regio',
    region: 'europe',
    parentSlug: 'italie',
    heroImagePath: '/media/image1086.jpg',
    gallery: ['/media/image1086.jpg'],
    eyebrow: 'Regio',
    title: 'Calabria: het zuidelijkste punt van de laars',
    intro:
      'Calabria is rauw, rotsig en authentic: ruige kust, piepkleine bergdorpen en een sfeer die nog niet door toerisme is aangepast aan verwachtingen.',
    mood: 'Ruige kust en authentiek zuiden',
    mapLabel: 'CALABRIA',
    mapScale: 1800,
    mapCenter: [16.5, 39],
    markerLng: 16.5503,
    markerLat: 38.9088,
    countryIds: ['380'],
    highlights: ['Ruige Tirreense kust', 'Bergdorpen in de Aspromonte', 'Authentiek zuidelijk Italië'],
    places: ['Reggio Calabria', 'Tropea', 'Aspromonte'],
  },

  // ─── Gebieden (binnen regio's) ───────────────────────────────────────────
  {
    name: 'Valle d\'Itria',
    slug: 'valle-ditria',
    level: 'gebied',
    region: 'europe',
    parentSlug: 'apulie',
    heroImagePath: '/media/woestijn-9-scaled-800x532.jpg',
    gallery: ['/media/woestijn-9-scaled-800x532.jpg'],
    eyebrow: 'Gebied',
    title: 'Valle d\'Itria: het hart van de trulli-streek',
    intro:
      'De Valle d\'Itria is een groene kom vol olijfgaarden, trulli en witte dorpen. Niet het Italië van grote steden, maar van kleine wegen die nergens naartoe lijken te leiden en er toch altijd op uitkomen.',
    mood: 'Trulli, olijven en witte dorpen',
    mapLabel: 'VALLE D\'ITRIA',
    mapScale: 2500,
    mapCenter: [17.3, 40.7],
    markerLng: 17.25,
    markerLat: 40.75,
    countryIds: ['380'],
    highlights: [
      'Trulli van Alberobello',
      'Locorotondo en zijn witte straatjes',
      'Cisternino en de lokale grillcultuur',
    ],
    places: ['Alberobello', 'Locorotondo', 'Cisternino', 'Martina Franca', 'Ostuni'],
  },

  // ─── Steden / dorpen ─────────────────────────────────────────────────────
  {
    name: 'Locorotondo',
    slug: 'locorotondo',
    level: 'stad',
    region: 'europe',
    parentSlug: 'valle-ditria',
    heroImagePath: '/media/woestijn-9-scaled-800x532.jpg',
    gallery: ['/media/woestijn-9-scaled-800x532.jpg'],
    eyebrow: 'Stad',
    title: 'Locorotondo: het witste dorp van de Valle d\'Itria',
    intro:
      'Locorotondo ligt op een heuvelrug en kijkt neer op de trulli-landschappen aan alle kanten. Het centrum is helemaal wit, de straatjes zijn smal en er zijn bijna geen toeristen.',
    mood: 'Wit, stil en lokaal',
    mapLabel: 'LOCOROTONDO',
    mapScale: 3500,
    mapCenter: [17.32, 40.75],
    markerLng: 17.3265,
    markerLat: 40.755,
    countryIds: ['380'],
    highlights: [
      'Wit historisch centrum',
      'Uitzicht over de Valle d\'Itria',
      'Lokale witte wijn (Locorotondo DOC)',
    ],
    places: ['Centro storico', 'Uitkijkpunten', 'Lokale wijnbars'],
  },
]

// --- Seed functie ---
async function run() {
  const payload = await getPayload({ config })
  const lookup = await buildImageLookup(payload)
  const fallback = lookup.get('Dansenmaloca-scaled.webp') ?? 91

  payload.logger.info(`Mediabibliotheek: ${lookup.size} bestanden geladen.`)

  // Bestaande destinations verwijderen voor schone slate
  const existing = await payload.find({ collection: 'destinations', limit: 200, depth: 0 })
  for (const doc of existing.docs) {
    await payload.delete({ collection: 'destinations', id: doc.id })
  }
  payload.logger.info(`${existing.docs.length} bestaande destinations verwijderd.`)

  // Slug → ID map opbouwen terwijl we aanmaken
  const slugToId = new Map<string, number>()

  // Twee passes: eerst landen + regio's zonder parent, dan de rest
  const sorted = [
    ...DESTINATIONS.filter((d) => !d.parentSlug),
    ...DESTINATIONS.filter((d) => d.parentSlug),
  ]

  for (const dest of sorted) {
    const heroImageId = imgId(dest.heroImagePath, lookup, fallback)
    const galleryItems_ = galleryItems(dest.gallery ?? [], lookup, fallback)

    const parentId = dest.parentSlug ? slugToId.get(dest.parentSlug) : undefined

    const created = await payload.create({
      collection: 'destinations',
      data: {
        name: dest.name,
        slug: dest.slug,
        level: dest.level,
        region: dest.region,
        parent: parentId ?? null,
        heroImage: heroImageId,
        gallery: galleryItems_,
        eyebrow: dest.eyebrow,
        title: dest.title,
        intro: dest.intro,
        mood: dest.mood,
        population: dest.population,
        flightHours: dest.flightHours,
        mapLabel: dest.mapLabel,
        mapScale: dest.mapScale ?? 1500,
        mapCenter: dest.mapCenter
          ? { longitude: dest.mapCenter[0], latitude: dest.mapCenter[1] }
          : { longitude: 0, latitude: 0 },
        coordinates: {
          longitude: dest.markerLng ?? 0,
          latitude: dest.markerLat ?? 0,
        },
        countryIds: (dest.countryIds ?? []).map((id) => ({ countryCode: id })),
        highlightList: (dest.highlights ?? []).map((text) => ({ text })),
        places: (dest.places ?? []).map((name) => ({ name })),
      },
    })

    slugToId.set(dest.slug, created.id as number)
    payload.logger.info(
      `✓ ${dest.level.padEnd(6)} ${dest.parentSlug ? `${dest.parentSlug} > ` : ''}${dest.name}`,
    )
  }

  payload.logger.info(`\nSeed klaar. ${DESTINATIONS.length} bestemmingen aangemaakt.`)
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
