/**
 * Seed: maakt een volledig geschreven blog aan over de leukste dorpjes van Apulië.
 * Draaien: node --env-file=.env --import tsx ./scripts/seed-apulie-dorpjes.ts
 *
 * Maakt de post als 'draft' aan. Voeg een hero-afbeelding toe en publiceer vanuit de admin.
 * Slaat over als slug al bestaat.
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

type LexNode = { type: string; version: number; [k: string]: unknown }

function paragraph(text: string): LexNode {
  return {
    type: 'paragraph',
    version: 1,
    children: [{ detail: 0, format: 0, mode: 'normal', style: '', text, type: 'text', version: 1 }],
    direction: 'ltr',
    format: '',
    indent: 0,
  }
}

function heading(tag: 'h2' | 'h3', text: string): LexNode {
  return {
    type: 'heading',
    version: 1,
    children: [{ detail: 0, format: 0, mode: 'normal', style: '', text, type: 'text', version: 1 }],
    direction: 'ltr',
    format: '',
    indent: 0,
    tag,
  }
}

function richText(nodes: LexNode[]) {
  return {
    root: {
      children: nodes,
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      type: 'root',
      version: 1,
    },
  }
}

async function main() {
  const payload = await getPayload({ config })

  const slug = 'apulie-leukste-dorpjes'

  const existing = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
  })

  if (existing.totalDocs > 0) {
    console.log(`Overgeslagen: slug '${slug}' bestaat al.`)
    process.exit(0)
  }

  // Placeholder hero-afbeelding (vervang later via admin)
  const mediaResult = await payload.find({ collection: 'media', limit: 100 })
  const mediaMap = new Map<string, number>()
  for (const doc of mediaResult.docs) {
    if (doc.filename) mediaMap.set(doc.filename, doc.id as number)
  }
  const heroId =
    mediaMap.get('woestijn-9-scaled-800x532.jpg') ??
    mediaMap.get('kellys-scaled.jpg') ??
    mediaMap.get('Dansenmaloca-scaled.webp') ??
    91

  // Destination IDs ophalen
  const destResult = await payload.find({
    collection: 'destinations',
    where: { slug: { in: ['apulie', 'italie', 'valle-ditria'] } },
    limit: 10,
  })
  const destMap = new Map<string, number>()
  for (const d of destResult.docs) {
    destMap.set(d.slug as string, d.id as number)
  }

  const destinations = [destMap.get('apulie'), destMap.get('italie'), destMap.get('valle-ditria')]
    .filter(Boolean) as number[]

  const content = richText([
    paragraph(
      'Apulië is niet het Italië van de grote musea of de beroemde skyline. Het is het Italië van de kleine straten, de witte kalkstenen muren, de olijfgaarden die zo oud zijn dat ze eigenlijk al erfgoed zijn, en de tafels die pas laat op de avond leegkomen. Wie hier naartoe gaat, gaat niet om te doen, maar om er te zijn.',
    ),
    paragraph(
      'De regio heeft een handvol dorpjes die je niet gauw vergeet. Niet omdat ze op een lijst staan, maar omdat ze precies het juiste formaat hebben: klein genoeg om in een uur te lopen, groot genoeg om er de rest van de dag te blijven hangen.',
    ),

    heading('h2', 'Locorotondo: het witste dorp van de vallei'),
    paragraph(
      "Locorotondo ligt als een witte cirkel op een heuvel midden in de Valle d'Itria. De naam betekent letterlijk 'ronde plek', en dat klopt: het historische centrum is een lus van smalle straatjes met witte huizen, bloemdecoraties en vlaggetjes die bijna te mooi zijn voor een gewone dinsdagmiddag.",
    ),
    paragraph(
      "Wat Locorotondo anders maakt dan Alberobello, dat een dorp verderop ligt, is de rust. Geen busgroepen, geen magneetjeswinkelkjes op elke hoek. Wel een lokale bar op het plein, een stel oude mannen die schaak spelen en een uitzicht over de vlakte vol trulli dat elke ochtend anders is.",
    ),
    paragraph(
      'Tip: kom vroeg in de ochtend of laat op de avond. Dan is het licht goed en zijn de smalle straatjes helemaal voor jezelf.',
    ),

    heading('h2', "Alberobello: trulli van dichtbij"),
    paragraph(
      "Alberobello is de bekendste plek in Apulië, en terecht: nergens anders ter wereld staan zoveel trulli als hier. Die kegeldakhuisjes, gebouwd van droge stenen zonder mortel, geven de valleikant van de stad het gevoel van een sprookje dat ook echt werkt als hotel, restaurant en wijnkelder.",
    ),
    paragraph(
      "Is het toeristisch? Ja. Is dat een reden om het over te slaan? Nee. De trulli zijn gewoon indrukwekkend, ook als er toeristen bij staan. De kunst is om vroeg te gaan, de drukte te vermijden en de zijstraatjes in te lopen waar mensen echt wonen en de deuren openstaan.",
    ),
    paragraph(
      "De wijk Rione Monti is het meest gefotografeerd, maar de Aia Piccola aan de andere kant van de straat is rustiger en net zo mooi. Daar staan zo'n 400 trulli en wonen er ook nog echte mensen in.",
    ),

    heading('h2', "Cisternino: de geheime tip van de vallei"),
    paragraph(
      "Wie de Valle d'Itria kent, kent Alberobello. Wie de vallei echt wil kennen, gaat ook naar Cisternino. Dit dorp heeft geen trulli, geen grote trekpleisters en eigenlijk ook geen reden om er naartoe te gaan, behalve dat het geweldig is.",
    ),
    paragraph(
      "Cisternino staat bekend om zijn bracerie, kleine grillrestaurantjes waar je je eigen vlees uitzoekt uit de vitrine en het ter plekke wordt gegrild. Geen menukaart, geen poespas, gewoon goed eten aan een lange tafel. Het dorp zelf is klein, rustig en heeft het gevoel van een plek die nog niet ontdekt wil worden.",
    ),

    heading('h2', "Ostuni: La Città Bianca"),
    paragraph(
      "Ostuni wordt 'La Città Bianca' genoemd, de Witte Stad, en dat is geen marketingpraatje. Gezien vanuit de omgeving is het een wit silhouet op een heuvel, de koepel van de kathedraal als middelpunt. Van binnen is het een labyrint van stegen, trappen en doorkijkjes die nergens naartoe leiden maar altijd ergens op uitkomen.",
    ),
    paragraph(
      "Ostuni is iets drukker dan Locorotondo of Cisternino, maar groot genoeg om de drukte kwijt te raken. De omgeving, met olijfgaarden die al eeuwen oud zijn, is ook een reden om er langer dan een halve dag te blijven.",
    ),

    heading('h2', "Polignano a Mare: huizen op kliffen"),
    paragraph(
      "Polignano a Mare is technisch gezien een kustplaats, maar het hoort toch in elk Apulisch dorpenlijstje. Het dorp hangt letterlijk op kliffen boven de Adriatische Zee en de huizen, bars en restaurants kijken uit over open water. Het is een van die plekken die je hebt gezien op foto's en die toch nog mooier blijkt als je er zelf staat.",
    ),
    paragraph(
      "Het meest beroemde uitzicht is het terras van café Grotta Palazzese, dat deels in een zeegrot hangt. Het is er duur en altijd vol, maar er is ook gewoon een openbaar uitkijkpunt naast: gratis en net zo fotogeniek. Het oude centrum is klein maar goed: lekkere gelato, smalle straatjes en de zee aan alle kanten.",
    ),

    heading('h2', "Praktisch: hoe pak je dit aan?"),
    paragraph(
      "Een huurwagen is essentieel. De Valle d'Itria-dorpen liggen op korte rijafstand van elkaar, maar zijn slecht bereikbaar met openbaar vervoer. Een auto geeft je de vrijheid om ook de kleine wegen tussen de trulli-velden te rijden en de dorpjes op je eigen tempo te doen.",
    ),
    paragraph(
      "Beste periode: mei tot juni of september tot oktober. Juli en augustus zijn warm, druk en duur. Het voorjaar en najaar zijn perfect voor fotografie, wandelen en buiten eten zonder een reservering drie weken van tevoren.",
    ),
    paragraph(
      "Verblijf: overnacht in een trullo als je de kans hebt, al is het maar voor één nacht. Er zijn veel goed opgeknapte trulli te huren via Airbnb en lokale verhuurders, vaak voor minder dan een gewone hotelkamer in een toeristenstad. Je slaapt letterlijk in een stenen kegel die honderden jaren oud is.",
    ),
  ])

  await payload.create({
    collection: 'posts',
    draft: true,
    data: {
      title: "Apulië: de leukste dorpjes in de hak van Italië",
      slug,
      heroImage: heroId,
      excerpt:
        "Van het witste dorp ter wereld tot een stadje met kegeldakjes die geen architect heeft bedacht: Apulië heeft een handvol dorpjes die je niet gauw vergeet.",
      publishedDate: new Date().toISOString(),
      content,
      status: 'draft',
      werelddeel: 'europe',
      thema: ['reisverhalen-routes', 'reistips-praktisch'],
      destinations,
    },
  })

  console.log("Blog aangemaakt als draft: 'Apulië: de leukste dorpjes in de hak van Italië'")
  console.log("Voeg een hero-afbeelding toe en publiceer vanuit de Payload admin (localhost:3007/admin).")
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
