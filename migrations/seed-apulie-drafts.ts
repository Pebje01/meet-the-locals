/**
 * Seed: maakt drie blog-concepten aan voor de Apulië-hiërarchie.
 * Draaien: node --env-file=.env --import tsx ./migrations/seed-apulie-drafts.ts
 *
 * Slaat over als slug al bestaat. Veilig opnieuw te draaien.
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

function richText(paragraphs: string[]) {
  return {
    root: {
      children: paragraphs.map((text) => ({
        children: [
          { detail: 0, format: 0, mode: 'normal', style: '', text, type: 'text', version: 1 },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      })),
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  }
}

async function main() {
  const payload = await getPayload({ config })

  // --- Media lookup ---
  const mediaResult = await payload.find({ collection: 'media', limit: 100 })
  const mediaMap = new Map<string, number>()
  for (const doc of mediaResult.docs) {
    if (doc.filename) mediaMap.set(doc.filename, doc.id as number)
  }

  // Beste beschikbare afbeelding als placeholder voor Italië posts
  const heroId =
    mediaMap.get('kellys-scaled.jpg') ??
    mediaMap.get('image3344.jpg') ??
    mediaMap.get('Dansenmaloca-scaled.webp') ??
    91

  // --- Destination IDs ---
  const destResult = await payload.find({
    collection: 'destinations',
    where: { slug: { in: ['italie', 'apulie', 'valle-ditria', 'locorotondo'] } },
    limit: 10,
  })
  const destMap = new Map<string, number>()
  for (const d of destResult.docs) {
    destMap.set(d.slug as string, d.id as number)
  }

  const apulieId = destMap.get('apulie')
  const valleId = destMap.get('valle-ditria')
  const locorotondoId = destMap.get('locorotondo')
  const italieId = destMap.get('italie')

  // --- Draft posts ---
  const drafts = [
    {
      slug: 'apulie-regio-overzicht',
      title: 'Apulië: de hak van de laars in slow motion',
      excerpt:
        'Apulië is geen bestemming voor wie alles wil zien. Het is een regio voor wie bereid is te vertragen: lange tafels, olijfgaarden, witte stadjes en een kust die niet om aandacht schreeuwt.',
      publishedDate: new Date().toISOString(),
      werelddeel: 'europe',
      thema: ['reisverhalen-routes'],
      destinations: [apulieId, italieId].filter(Boolean) as number[],
      content: richText([
        'Vul hier je intro aan over Apulië als regio. Wat maakt het anders dan de rest van Italië? Wat is de eerste indruk als je aankomt?',
        'Sfeer en ritme: hoe voelt het om hier te zijn? Vertel over de dorpen, de mensen, het licht in de namiddag.',
        'Praktisch: hoe kom je hier? Bari of Brindisi als vliegveld. Huurwagen vs. openbaar vervoer. Beste periode.',
        'Wat mis je niet: de trulli, de gegrilde groenten, het lokale bier Peroni vs. lokale wijnen, olijfolie van hier.',
        'Tips voor wie voor het eerst komt: waar verblijf je, wat skip je, wat is een absolute aanrader?',
      ]),
    },
    {
      slug: 'valle-ditria-trulli-en-olijfbomen',
      title: "Valle d'Itria: trulli, olijfbomen en het tempo van een dinsdag",
      excerpt:
        "De Valle d'Itria is een dal vol witte kegeldakhuisjes, olijfgaarden en steden die eruitzien alsof ze nooit zijn afgemaakt. En dat is precies de bedoeling.",
      publishedDate: new Date().toISOString(),
      werelddeel: 'europe',
      thema: ['reisverhalen-routes', 'reisfotografie'],
      destinations: [valleId, apulieId].filter(Boolean) as number[],
      content: richText([
        "Schrijf hier je eerste impressie van de Valle d'Itria. De trulli van Alberobello zijn het meest bekend, maar wat zag je nog meer?",
        'Fotografie: de conische daken, de licht in de ochtend vs. avond, de details van de stenen muren. Wat werkte, wat niet?',
        'De plaatsen in de vallei: Alberobello (toeristisch), Locorotondo (rustiger), Cisternino (lokaal gevoel). Hoe verhoudt het zich?',
        'Eten en drinken: orecchiette, burrata, de lokale rosé. Waar heb je gegeten, wat was goed, wat was teleurstellend?',
        'Conclusie: voor wie is dit dal? Wie kun je het aanraden, wie zou het niets vinden?',
      ]),
    },
    {
      slug: 'locorotondo-wit-en-stil',
      title: 'Locorotondo: het witste stadsdorp dat ik ken',
      excerpt:
        'Locorotondo is een cirkelrond stadje op een heuvel met muren zo wit dat je zonnebril geen optie is. Hier ga je niet om iets te doen. Je gaat er gewoon zijn.',
      publishedDate: new Date().toISOString(),
      werelddeel: 'europe',
      thema: ['reisverhalen-routes', 'reisfotografie'],
      destinations: [locorotondoId, valleId, apulieId].filter(Boolean) as number[],
      content: richText([
        "Locorotondo betekent 'ronde plek'. Vertel hoe de stad er van een afstand uitziet, op die heuvel in de vallei.",
        'De witte straatjes: wat zie je als je door het centrum loopt? De bloempotten, de vlaggetjes, de mensen die op de stoep zitten.',
        'Wanneer ga je er: vroeg in de ochtend, als de dagjesmensen er nog niet zijn. Of avond, als alles verlicht is en rustiger.',
        "Praktisch: loopafstand van/naar andere Valle d'Itria-plaatsen? Parkeren? Verblijf in een trullo vlakbij?",
        'Eerlijk advies: wat overtuigde je, wat viel iets tegen, en zou je hier een nacht blijven of is het een halve dag?',
      ]),
    },
  ]

  let created = 0
  let skipped = 0

  for (const draft of drafts) {
    const existing = await payload.find({
      collection: 'posts',
      where: { slug: { equals: draft.slug } },
    })

    if (existing.totalDocs > 0) {
      console.log(`Overgeslagen (bestaat al): ${draft.slug}`)
      skipped++
      continue
    }

    await payload.create({
      collection: 'posts',
      draft: true,
      data: {
        title: draft.title,
        slug: draft.slug,
        heroImage: heroId,
        excerpt: draft.excerpt,
        publishedDate: draft.publishedDate,
        content: draft.content,
        status: 'draft',
        werelddeel: draft.werelddeel,
        thema: draft.thema,
        destinations: draft.destinations,
      },
    })

    console.log(`Aangemaakt: ${draft.title}`)
    created++
  }

  console.log(`\nKlaar: ${created} aangemaakt, ${skipped} overgeslagen.`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
