import Image from 'next/image'
import Link from 'next/link'

import { FAQJsonLd } from '@/components/JsonLd'

const quickLinks = [
  { label: 'Samenwerken?', href: '#samenwerken' },
  { label: 'Bekijk fotografie', href: '/fotografie' },
  { label: 'Mijn fotospots', href: '/kaart' },
  { label: 'Neem contact op', href: '/contact' },
]

const services = [
  'Reisfotografie voor bestemmingen en campagnes',
  'Hotel- en accommodatiefotografie',
  'Food, horeca en sfeerbeelden',
  'Redactionele reiscontent voor blogs en socials',
  'Fotospots en visuele reisgidsen',
]

const logoCards = ['Hotels', 'Horeca', 'Toerisme', 'Reismerken', 'Campagnes', 'Editorial']

const faqItems = [
  {
    category: 'Samenwerken',
    question: 'Kan ik samenwerken met Meet the Locals?',
    answer:
      'Ja, als je merk, bestemming, hotel of horecazaak past bij reizen, sfeer en plekken met karakter. Ik werk het liefst aan samenwerkingen die visueel sterk zijn en inhoudelijk logisch voelen voor Meet the Locals.',
  },
  {
    category: 'Fotografie',
    question: 'Wat voor fotografie maak je in opdracht?',
    answer:
      'Ik fotografeer bestemmingen, accommodaties, restaurants, food, interieurs en details die de sfeer van een plek laten zien. De beelden zijn warm, natuurlijk en geschikt voor websites, socials, campagnes en redactionele content.',
  },
  {
    category: 'Content',
    question: 'Kan mijn plek of bestemming op de website komen?',
    answer:
      'Dat kan, maar alleen wanneer ik de plek zelf bezoek en het verhaal past bij de site. Content op Meet the Locals blijft persoonlijk, eerlijk en gebaseerd op eigen ervaring.',
  },
  {
    category: 'Werkwijze',
    question: 'Wat lever je op na een samenwerking?',
    answer:
      'Dat hangt af van het project. Denk aan een selectie bewerkte foto’s, blogcontent, social visuals, korte teksten of een combinatie daarvan. Vooraf stemmen we helder af wat je nodig hebt en waar de beelden gebruikt worden.',
  },
  {
    category: 'Reizen',
    question: 'Werk je ook buiten Nederland?',
    answer:
      'Ja. Juist reis- en bestemmingsprojecten buiten Nederland passen goed bij Meet the Locals. Voor internationale opdrachten kijken we samen naar planning, reisdata, briefing en praktische productie.',
  },
  {
    category: 'Publicatie',
    question: 'Gebruik je altijd eigen foto’s?',
    answer:
      'Ja, de visuele basis van Meet the Locals is eigen fotografie. Daardoor blijven de verhalen persoonlijk en herkenbaar, en sluiten de beelden aan op de sfeer van de site.',
  },
  {
    category: 'Contact',
    question: 'Hoe vraag ik een samenwerking aan?',
    answer:
      'Stuur een bericht via de contactpagina met je idee, bestemming of locatie, gewenste timing en wat je ongeveer nodig hebt. Dan kijk ik of het past en kom ik terug met een concrete insteek.',
  },
]

const faqColumns = [faqItems.slice(0, 4), faqItems.slice(4)]

export default function OverPage() {
  return (
    <main className="bg-[#f8f5ef]">
      <FAQJsonLd questions={faqItems} />

      <section className="relative overflow-hidden px-6 pb-20 pt-32 md:pb-28 md:pt-40 lg:px-10">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <span className="mb-4 block text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
              Over Meet the Locals
            </span>
            <h1 className="mb-7 text-5xl leading-[0.98] text-forest md:text-7xl lg:text-8xl">
              Hey, ik ben Daley.
            </h1>
            <div className="space-y-5 text-[19px] leading-relaxed text-text-muted md:text-[21px]">
              <p>
                Fotograaf, designer en foodie met een zwak voor plekken die je niet meteen op de
                eerste pagina van een reisgids vindt.
              </p>
              <p>
                Meet the Locals is mijn persoonlijke verzameling van reisverhalen, fotospots,
                lokale adressen en beelden die laten zien hoe een plek echt voelt.
              </p>
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-full border border-forest/10 bg-white/70 px-5 py-3 text-sm font-semibold text-forest shadow-sm transition-colors hover:border-accent hover:text-accent"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="grid grid-cols-12 items-end gap-4">
              <div className="col-span-7">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] bg-cream">
                  <Image
                    src="/media/portretje.webp"
                    alt="Daley Jansen"
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 60vw, 34vw"
                  />
                </div>
              </div>
              <div className="col-span-5 space-y-4 pb-5">
                <div className="relative aspect-square overflow-hidden rounded-[2.25rem] bg-cream">
                  <Image
                    src="/media/Franksunset-scaled.webp"
                    alt="Zonsondergang onderweg"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 40vw, 18vw"
                  />
                </div>
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2.25rem] bg-cream">
                  <Image
                    src="/media/langkawi-scaled.webp"
                    alt="Langkawi vanuit de lucht"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 40vw, 18vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8f5ef] py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="mb-12">
            <span className="mb-4 block text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
              Waarom ik reis
            </span>
            <h2 className="text-4xl leading-[1.05] text-forest md:text-6xl">
              Niet afvinken, maar blijven kijken.
            </h2>
          </div>

          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] bg-cream">
                <Image
                  src="/media/Ayuthayya-1-9-scaled.webp"
                  alt="Reisfotografie in Thailand"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 38vw"
                />
              </div>
            </div>

            <div className="space-y-5 text-[19px] leading-relaxed text-text-muted md:text-[20px] lg:col-span-7">
              <p>
                Ik loop graag net iets verder. Een zijstraat in, een markt op, een restaurant
                binnen waar geen perfecte menukaart buiten hangt. Juist daar begint vaak het verhaal.
              </p>
              <p>
                Op deze site verzamel ik de plekken waar ik echt ben geweest: bestemmingen,
                eettips, fotospots en kleine observaties die je helpen om een bestemming minder
                gehaast te beleven.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="samenwerken" className="mt-16 bg-[#ece7de] py-20 md:mt-24 md:py-28">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <span className="mb-4 block text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
            Contact & samenwerken
          </span>
          <h2 className="mb-6 text-4xl leading-[1.04] text-forest md:text-6xl">
            Laten we samenwerken.
          </h2>
          <p className="mb-8 max-w-4xl text-[19px] leading-relaxed text-text-muted md:text-[21px]">
            Ik maak visuele content voor plekken waar mensen naartoe willen: hotels, restaurants,
            bestemmingen en reismerken. Altijd met aandacht voor sfeer, licht en het verhaal achter
            de plek.
          </p>

          <ul className="mb-12 grid max-w-4xl grid-cols-1 gap-3 text-[17px] text-text-muted md:grid-cols-2">
            {services.map((service) => (
              <li key={service} className="flex gap-3">
                <span className="mt-2 h-2 w-2 flex-none rounded-full bg-accent" />
                <span>{service}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/contact"
            className="inline-flex rounded-full bg-accent px-8 py-4 text-sm font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-accent-dark"
          >
            Neem contact op
          </Link>
        </div>
      </section>

      <section className="bg-[#f8f5ef] py-20 md:py-24">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-10">
          <h2 className="mb-8 text-3xl leading-tight text-forest md:text-4xl">
            Waar ik voor fotografeer
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {logoCards.map((item) => (
              <div
                key={item}
                className="flex min-h-[150px] items-center justify-center rounded-[1.5rem] bg-white px-6 text-center text-xl font-semibold uppercase tracking-[0.08em] text-forest/45 shadow-sm md:min-h-[180px]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-6">
              <span className="mb-4 block text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
                Veelgestelde vragen
              </span>
              <h2 className="text-5xl leading-[1.02] text-forest md:text-7xl">
                Vragen over samenwerken en fotografie.
              </h2>
            </div>
            <p className="max-w-3xl text-[20px] leading-relaxed text-forest/65 lg:col-span-6 lg:pt-10">
              Antwoorden op de vragen die meestal terugkomen rond fotografie, reiscontent en
              samenwerkingen met Meet the Locals. Kort, praktisch en zonder omwegen.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {faqColumns.map((column, columnIndex) => (
              <div key={columnIndex} className="self-start border border-forest/25 bg-white">
                {column.map((item) => (
                  <details
                    key={item.question}
                    className="group border-b border-forest/25 last:border-b-0"
                  >
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 px-6 py-6 text-left md:px-8 [&::-webkit-details-marker]:hidden">
                      <div>
                        <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-accent/80">
                          {item.category}
                        </span>
                        <h3 className="text-xl leading-tight text-forest md:text-2xl">
                          {item.question}
                        </h3>
                      </div>
                      <span className="relative mt-1 flex h-8 w-8 flex-none items-center justify-center text-forest/80">
                        <span className="absolute h-0.5 w-5 rounded-full bg-current" />
                        <span className="absolute h-5 w-0.5 rounded-full bg-current transition-opacity group-open:opacity-0" />
                      </span>
                    </summary>
                    <div className="border-t border-forest/15 px-6 pb-7 pt-5 md:px-8">
                      <p className="max-w-3xl text-[17px] leading-relaxed text-forest/65 md:text-[18px]">
                        {item.answer}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
