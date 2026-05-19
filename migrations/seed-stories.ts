/**
 * Seed: voegt drie fictieve verhalen toe om het Verhalen-design te demonstreren.
 * Draaien:  node --env-file=.env --import tsx ./migrations/seed-stories.ts
 *
 * Veilig opnieuw te draaien: slaat over als slug al bestaat.
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

function richText(paragraphs: string[]) {
  return {
    root: {
      children: paragraphs.map((text) => ({
        children: [{ detail: 0, format: 0, mode: 'normal', style: '', text, type: 'text', version: 1 }],
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

const STORIES = [
  {
    slug: 'verloren-in-de-sahara',
    title: 'Verloren in de Sahara',
    eyebrow: 'Zes dagen door Marokko',
    heroImageFilename: 'woestijn-9-scaled.jpg',
    intro:
      'Van Marrakech naar Merzouga, door berberdorpen en over zandduinen die bij zonsondergang oplichten als oranje vuur. Geen reisgids, geen schema.',
    publishedDate: '2026-03-12T00:00:00.000Z',
    werelddeel: 'africa',
    thema: ['reisverhalen-routes'],
    content: richText([
      'Het begon met een misgelopen bus in Marrakech. Niet erg, bleek achteraf. De beste reizen beginnen altijd met een fout.',
      'We vonden een lokale chauffeur, Hassan, die ons voor een lachwekkend bedrag drie dagen lang door het zuiden wilde rijden. Zijn auto rook naar sinaasappel en motorolie. Hij kende elk dorp, elke bocht.',
      'De eerste nacht sliepen we in een berberfort met muren van oker. Het was zo stil dat ik het zand hoorde bewegen.',
      'Op dag twee reden we door de Dadès-kloof. De rotsen kleuren er bordeauxrood en de weg slingert langs afgronden zonder vangrails. Hassan floot de hele weg.',
      'Merzouga bereikte je pas bij schemering. De duinen strekten zich uit als een slapende reus. We namen kamelen en reden het kamp in. Theeglaasjes bij een vuur, geen wifi, geen plannen voor de volgende dag. Precies goed.',
    ]),
  },
  {
    slug: 'boven-de-wolken-in-de-andes',
    title: 'Boven de wolken in de Andes',
    eyebrow: 'Inca-routes en bergpaden',
    heroImageFilename: 'Ayuthayya-1-2-scaled.webp',
    intro:
      'Vier dagen lopen op de Inca Trail, langs vergeten ruïnes en door mistwolken die halverwege de bergflanken hangen. Elke stap een beetje dichter bij iets ouds.',
    publishedDate: '2026-01-28T00:00:00.000Z',
    werelddeel: 'south-america',
    thema: ['reisverhalen-routes'],
    content: richText([
      'Op 4.200 meter hoogte denk je niet aan fotografie. Je denkt alleen aan de volgende stap.',
      'De Inca Trail begint onschuldig. Een paadje door een vallei, maïsvelden, een paar toeristen met te grote rugzakken. Maar al snel klimt hij omhoog, en houdt hij niet meer op.',
      'De gidsen hier kennen de paden zoals jij je eigen straat kent. Elke steen heeft een naam, elke pas een verhaal. Ze lopen in sandalen. Wij in dure wandelschoenen en toch hijgen we.',
      "Dead Woman's Pass is de naam van de hoogste doorgang. Op 4.215 meter staan er wolken die van geen wijken willen weten. Je ziet niets, maar je voelt dat je ergens aankomt.",
      'Op de ochtend van dag vier kijk je door de Zonnepoort naar Machu Picchu in de diepte, half verborgen in ochtendmist. Even snap je waarom mensen hun leven wijden aan het lopen van dit pad.',
    ]),
  },
  {
    slug: 'de-keuken-van-cartagena',
    title: 'De keuken van Cartagena',
    eyebrow: 'Colombia, kust en kleur',
    heroImageFilename: 'Dansenmaloca-scaled.webp',
    intro:
      'Arepas op de markt, ceviche bij een vrouw die al dertig jaar op dezelfde hoek staat. De echte smaak van de Colombiaanse kust zit niet in een restaurant.',
    publishedDate: '2025-11-05T00:00:00.000Z',
    werelddeel: 'south-america',
    thema: ['food', 'reisverhalen-routes'],
    content: richText([
      'Cartagena ruikt naar zout, frituur en jasmijn. Soms tegelijk.',
      'De oude stad heeft muren van drie meter dik en straten zo smal dat twee mensen elkaar nauwelijks kunnen passeren. Daartussen verkoopt iedereen iets: fruit, sappen, vis, gebakken banaan met kaas.',
      'De beste maaltijd van de reis kostte minder dan twee euro. Een vrouw genaamd Rosario maakte aan een karretje in de Getsemaní-wijk arepas con huevo: maïsbrood gevuld met ei, gebakken in een pan die ze elke dag schoon poets. Dertig jaar doet ze dit al, vertelde ze zonder opkijken.',
      'Ceviche eet je aan het strand bij Playa de la Boquilla. De vis is van die ochtend, het limoensap is van de dag zelf, en de man die het maakt heeft er zin in.',
      'Eten in Colombia is geen restaurant-ervaring, het is een straatgesprek. Elke hap een beetje achtergrond over wie het maakte en waarom.',
    ]),
  },
]

async function run() {
  const payload = await getPayload({ config })

  for (const story of STORIES) {
    const existing = await payload.find({
      collection: 'stories',
      where: { slug: { equals: story.slug } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      payload.logger.info(`Verhaal "${story.slug}" bestaat al, overgeslagen.`)
      continue
    }

    const media = await payload.find({
      collection: 'media',
      where: { filename: { equals: story.heroImageFilename } },
      limit: 1,
    })

    const heroImageId = media.docs[0]?.id
    if (!heroImageId) {
      payload.logger.warn(`Media "${story.heroImageFilename}" niet gevonden, verhaal overgeslagen.`)
      continue
    }

    await payload.create({
      collection: 'stories',
      data: {
        title: story.title,
        slug: story.slug,
        eyebrow: story.eyebrow,
        heroImage: heroImageId,
        intro: story.intro,
        content: story.content,
        publishedDate: story.publishedDate,
        werelddeel: story.werelddeel,
        thema: story.thema,
        status: 'published',
      },
    })
    payload.logger.info(`Verhaal "${story.title}" aangemaakt.`)
  }

  payload.logger.info('Seed klaar.')
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
