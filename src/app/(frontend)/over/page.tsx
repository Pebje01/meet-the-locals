import Image from 'next/image'
import Link from 'next/link'

import { FAQJsonLd } from '@/components/JsonLd'
import { PhotoWithInfo } from '@/components/PhotoWithInfo'
import { photoMeta } from '@/data/photoMeta'

const quickLinks = [
  { label: 'Samenwerken?', href: '#samenwerken' },
  { label: 'Bekijk fotografie', href: '/fotografie' },
  { label: 'Portfolio', href: '/werk-in-opdracht' },
  { label: 'Mijn fotospots', href: '/kaart' },
  { label: 'Neem contact op', href: '/contact' },
]

const services = [
  'Reisfotografie voor bestemmingen en campagnes',
  'Dronefotografie en video',
  'Food en horeca fotografie',
  "Interieurfotografie, fotografie voor hotels, B&B's en andere accommodaties",
  'Websites bouwen en beheren',
  'Branding en marketing voor reismerken',
  'Ontwerpen voor brochures, folders, banners en beursstands',
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
    <main className="bg-[#F5EFE8]">
      <FAQJsonLd questions={faqItems} />

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Dark green top */}
        <div className="relative bg-forest-dark">
          <div className="absolute inset-0 pointer-events-none z-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(15,29,15,0.55) 100%)' }} />
          <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-16 pt-32 md:pt-40 lg:px-10">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <span className="mb-5 block text-[12px] font-semibold uppercase tracking-[0.16em] text-white/60">
                  Over mij
                </span>
                <h1 className="mb-7 text-5xl leading-[0.98] text-white! md:text-7xl lg:text-8xl">
                  Hi, ik ben Daley.
                </h1>
                <div className="mt-9 flex flex-wrap gap-3">
                  {quickLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-white/60 hover:bg-white/20"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex justify-center lg:col-span-5 lg:justify-end">
                <div className="relative w-full max-w-[340px] aspect-[3/4] overflow-hidden rounded-[2.5rem] shadow-2xl lg:max-w-[420px]">
                  <Image
                    src="/media/over-hero-daley.webp"
                    alt="Daley Jansen, Manhattan Bridge New York"
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 340px, (max-width: 1024px) 340px, 420px"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <svg viewBox="0 0 1440 50" preserveAspectRatio="none" className="block h-[35px] w-full md:h-[50px]">
              <path d="M0,50 L0,35 C240,45 480,22 720,35 C960,48 1200,28 1440,40 L1440,50 Z" fill="#bd6a3a" />
            </svg>
          </div>
        </div>

        {/* Orange stats strip */}
        <div className="relative -mt-px overflow-hidden bg-accent">
          <div className="mx-auto max-w-[1400px] px-6 py-12 lg:px-10">
            <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
              <div>
                <p className="font-display text-[52px] leading-none text-white md:text-[64px]">1988</p>
                <p className="mt-2 text-[11px] font-semibold uppercase leading-snug tracking-[0.08em] text-white/70">Het jaar dat ik de wereld kwam verkennen</p>
              </div>
              <div>
                <p className="font-display text-[52px] leading-none text-white md:text-[64px]">30+</p>
                <p className="mt-2 text-[11px] font-semibold uppercase leading-snug tracking-[0.08em] text-white/70">Jaar computernerd. Photoshop, websites maken, ontwerpen.</p>
              </div>
              <div>
                <p className="font-display text-[52px] leading-none text-white md:text-[64px]">6+</p>
                <p className="mt-2 text-[11px] font-semibold uppercase leading-snug tracking-[0.08em] text-white/70">Jaar fotograaf</p>
              </div>
              <div>
                <p className="font-display text-[52px] leading-none text-white md:text-[64px]">5</p>
                <p className="mt-2 text-[11px] font-semibold uppercase leading-snug tracking-[0.08em] text-white/70">Jaar was ik toen ik mijn eerste ervaring al deelde in een schoolkrant.</p>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 50" preserveAspectRatio="none" className="block h-[35px] w-full md:h-[50px]">
              <path d="M0,50 L0,35 C240,25 480,42 720,32 C960,22 1200,38 1440,30 L1440,50 Z" fill="#F5EFE8" />
            </svg>
          </div>
        </div>
      </section>

      {/* INTRO — photo grid + daughter paragraph */}
      <section className="relative overflow-hidden px-6 py-20 md:py-28 lg:px-10">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <h2 className="mb-5 text-4xl leading-[1.0] text-forest md:text-5xl lg:text-6xl">
              Over mij
            </h2>
            <div className="space-y-5 text-[19px] leading-relaxed text-text-muted md:text-[21px]">
              <p className="font-medium text-forest/80">Hi, ik ben Daley.</p>
              <p>
                Moeder van mijn dochter Abby en partner van Frank. Ik beschrijf mezelf het best als
                een professionele creatieveling. Ik kan hier wel een heel verhaal vertellen over hoe
                ik als 2-jarig meisje al achter de computer zat te tikken... maar daar kom je niet voor.
              </p>
              <p>
                Slaan we even 35 jaar over, dan zijn we in 2026. Inmiddels ben ik freelancer. Ik
                fotografeer, maak websites, doe vormgeving en marketing. Vandaar: professionele
                creatieveling. Ik ben ook ineens moeder. Dat was even schakelen, want ik was gewend
                om te werken waar ik wilde en te reizen wanneer ik wilde. Toch heeft dat geen roet
                in het reizen gegooid ;)
              </p>
              <p>
                Mijn dochter Abby reist gewoon mee. Haar eerste reis? Een rondreis door Noorwegen
                in een caravan. Ze was toen slechts 2,5 maand oud. Inmiddels is ze al in 6 landen
                geweest. Kleine globetrotter ;)
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="grid grid-cols-12 items-end gap-4">
              <div className="col-span-7">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] bg-cream">
                  <Image
                    src="/media/over-peru-klooster.webp"
                    alt="Santa Catalina klooster, Peru"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 60vw, 34vw"
                  />
                </div>
              </div>
              <div className="col-span-5 space-y-4 pb-5">
                <div className="relative aspect-square overflow-hidden rounded-[2.25rem] bg-cream">
                  <Image
                    src="/media/over-tempel-lantaarns.webp"
                    alt="Chinese tempel, Maleisie"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 40vw, 18vw"
                  />
                </div>
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2.25rem] bg-cream">
                  <Image
                    src="/media/over-puglia-steeg.webp"
                    alt="Wit steegje, Locorotondo"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 40vw, 18vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pull quote */}
        <div className="mx-auto mt-16 max-w-[1400px] border-t border-forest/10 pt-14 lg:mt-20 lg:pt-16">
          <blockquote className="mx-auto max-w-[780px] text-center">
            <p className="font-display text-[26px] font-light italic leading-[1.4] text-forest md:text-[32px] lg:text-[38px]">
              &ldquo;Niet alleen wat mooi is, maar wat echt is. Want echt is zoveel mooier.&rdquo;
            </p>
            <cite className="mt-6 block not-italic text-[13px] font-semibold uppercase tracking-[0.16em] text-accent">
              Daley Jansen
            </cite>
          </blockquote>
        </div>
      </section>


<section className="bg-[#F5EFE8] py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="mb-12">
            <h2 className="text-4xl leading-[1.05] text-forest md:text-6xl">
              Reisobsessie? Zo kun je het wel noemen, ja.
            </h2>
          </div>

          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] bg-cream">
                <Image
                  src="/media/over-fotograaf-kust.webp"
                  alt="Aan het fotograferen op de kust"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 38vw"
                />
              </div>
            </div>

            <div className="space-y-5 text-[19px] leading-relaxed text-text-muted md:text-[20px] lg:col-span-7">
              <p>
                Reizen heeft me altijd in de greep gehad. Dit begon voor het eerst toen ik Floortje
                bij 3 op reis keek en zij naar Palau ging. En daarna een aflevering over Nieuw-Zeeland.
                Vanaf dat moment - en ik denk dat ik een jaar of 14 was - ontdekte ik dat de wereld
                zo groot was. Dat er zulke mooie en afgelegen plekken bestonden. Die obsessie is nooit
                meer weggegaan.
              </p>
              <p>
                In 2011 kreeg ik de kans om Nieuw-Zeeland te bezoeken. Mijn droombestemming. Nog altijd
                heb ik heimwee.
              </p>
              <p>
                Al jaren wil ik daarom een reisblog starten. En nu heb ik hem dan eindelijk doorgezet.
                Want na vier jaar met Meet the Locals in mijn hoofd, staat deze website er.
              </p>
              <p>
                In iets ander formaat misschien, want de traditionele reisblog is niet meer. Daarom
                wil ik dit uitbouwen naar een persoonlijke bundeling van mijn reizen en ervaringen.
                Een reisplatform met alle ins-and-outs over reizen en de reisbranche. Maar met
                hoofdfocus op: echte beelden, rauwe fotografie en echte ervaringen.
              </p>
              <p>
                Waarom nu? Ik denk juist omdat, ondanks alle drukte en dat ik net moeder ben
                geworden, in de wereld van AI en niet meer weten wat echt is, ik juist dingen wil
                laten zien die echt zijn.
              </p>
              <p>
                En zelfs als AI-gebruiker voor veel facetten van mijn werk, ook deze website, vind ik
                dat fotografie en ervaringen niet te duiden zijn in AI, niet uit te leggen in AI. Dat
                moet echt blijven. Alles wat je hier ziet, alle foto&apos;s die je ziet, zijn door mij gemaakt
                en minimaal bewerkt. Gewoon zoals je als fotograaf altijd je foto&apos;s alleen mooier maakt.
                Of schaduwen of lichten, maar niks is met AI gegenereerd.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F5EFE8] py-4">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
            {[
              { src: '/media/over-zwembad-lezen.webp', alt: 'Lezen bij het zwembad', key: 'over-zwembad-lezen' },
              { src: '/media/over-peru-klooster.webp', alt: 'Santa Catalina klooster, Peru', key: 'over-peru-klooster' },
              { src: '/media/over-kleur-trappen.webp', alt: 'Kleurrijke trappen', key: 'over-kleur-trappen' },
              { src: '/media/over-tempel-lantaarns.webp', alt: 'Chinese tempel, Maleisie', key: 'over-tempel-lantaarns' },
            ].map((photo) => (
              <div key={photo.src} className="relative aspect-[3/4] overflow-hidden rounded-xl md:rounded-2xl">
                <PhotoWithInfo
                  src={photo.src}
                  alt={photo.alt}
                  meta={photoMeta[photo.key]}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="samenwerken" className="mt-16 bg-[#ece7de] py-20 md:mt-24 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <h2 className="mb-6 text-4xl leading-[1.04] text-forest md:text-6xl">
            Laten we samenwerken.
          </h2>
          <p className="mb-8 text-[19px] leading-relaxed text-text-muted md:text-[21px]">
            Dit kunnen hotels, B&amp;B&apos;s, reisbureaus, touroperators, caravan- en tentmerken,
            verkeersbureaus en andere reismerken zijn. Als professioneel fotograaf en brand designer
            kan ik je helpen met authentieke content, een converterende website of andere
            merkversterkende uitingen.
          </p>

          <ul className="mb-8 grid grid-cols-1 gap-3 text-[19px] text-text-muted md:grid-cols-2 md:text-[19px]">
            {services.map((service) => (
              <li key={service} className="flex gap-3">
                <span className="mt-2 h-2 w-2 flex-none rounded-full bg-accent" />
                <span>{service}</span>
              </li>
            ))}
          </ul>

          <p className="mb-12 text-[19px] leading-relaxed text-text-muted">
            Ik ben ervaren in het maken van en het werken met bestaande huisstijlen en tone-of-voice.
          </p>

          <Link
            href="/contact"
            className="inline-flex rounded-full bg-accent px-8 py-4 text-sm font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-accent-dark"
          >
            Neem contact op
          </Link>
        </div>
      </section>

      <section className="bg-[#F5EFE8] py-20 md:py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <h2 className="mb-8 text-3xl leading-tight text-forest md:text-4xl">
            Waar ik voor fotografeer
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {logoCards.map((item) => (
              <div
                key={item}
                className="flex min-h-[150px] items-center justify-center rounded-[1.5rem] bg-white px-6 text-center text-xl font-semibold uppercase tracking-[0.08em] text-forest/45 natural-shadow-box md:min-h-[180px]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F5EFE8] py-20 md:py-28">
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

      {/* THE DALEY EDIT — professional intro */}
      <section className="relative bg-forest-dark noise-overlay py-20 md:py-28">
        <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <span className="mb-5 block text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
                Naast dit blog
              </span>
              <h2 className="mb-6 text-4xl leading-[1.04] text-white md:text-6xl">
                Brand designer, fotograaf en webdesigner.
              </h2>
              <div className="space-y-4 text-[18px] leading-relaxed text-cream/75 md:text-[20px]">
                <p>
                  Naast Meet the Locals run ik The Daley Edit: mijn creatieve bureau waar ik
                  merken help met hun uitstraling, marketing en online aanwezigheid.
                </p>
                <p>
                  Ik combineer een goed gevoel voor esthetiek en design met slim en strategisch
                  merkinzicht. Het resultaat: merken die er niet alleen goed uitzien, maar ook
                  echt werken.
                </p>
                <p className="text-cream/50 text-[16px]">
                  "Ik vind het zo zonde als bedrijven hun potentie laten liggen."
                </p>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative aspect-[3/4] max-w-[340px] overflow-hidden rounded-[2.5rem] shadow-2xl lg:max-w-full">
                <Image
                  src="/media/over-hero-daley.webp"
                  alt="Daley Jansen"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 340px, 33vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Diensten — waar ik bij kan helpen */}
      <section className="bg-[#ece7de] py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <span className="mb-4 block text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
            The Daley Edit
          </span>
          <h2 className="mb-4 text-4xl leading-[1.04] text-forest md:text-6xl">
            Waar ik bij kan helpen.
          </h2>
          <p className="mb-12 max-w-2xl text-[18px] leading-relaxed text-text-muted md:text-[20px]">
            Van merkidentiteit tot webdesign en van fotografie tot marketing. Alles onder één dak,
            zonder meerdere ZZP&apos;ers.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Branding',
                desc: 'Merkstrategie, visuele identiteit, brand guidelines en templates. Een merk dat staat.',
              },
              {
                title: 'Fotografie',
                desc: 'Bedrijfsfotografie, branding- en portretfotografie, productfotografie en drone.',
              },
              {
                title: 'Webdesign',
                desc: 'Maatwerk websites in huisstijl. Snel, SEO-klaar, met hosting en onderhoud inbegrepen.',
              },
              {
                title: 'Marketing',
                desc: 'Maandelijkse samenwerking voor brand design, content en online zichtbaarheid.',
              },
              {
                title: 'Vormgeving',
                desc: 'DTP, brochures, folders, flyers en alle andere merkuitingen die je nodig hebt.',
              },
              {
                title: 'AI & Automations',
                desc: 'Leadgeneratie, AI-contentprocessen en efficiëntere marketing zonder extra handen.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] bg-white px-8 py-8 natural-shadow-box"
              >
                <h3 className="mb-3 text-xl font-semibold uppercase tracking-[0.06em] text-forest">
                  {item.title}
                </h3>
                <p className="text-[16px] leading-relaxed text-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mijn werk */}
      <section className="bg-[#F5EFE8] py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <span className="mb-4 block text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
                Portfolio
              </span>
              <h2 className="text-4xl leading-[1.04] text-forest md:text-6xl">
                Bekijk mijn werk.
              </h2>
            </div>
            <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
              <Link
                href="/werk-in-opdracht"
                className="inline-flex items-center gap-2 rounded-full bg-forest px-8 py-4 text-sm font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-forest-dark"
              >
                Bekijk portfolio
              </Link>
              <a
                href="https://thedaleyedit.nl"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-accent-dark"
              >
                Naar The Daley Edit
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </a>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
            {['Merkidentiteit', 'Websites', 'Campagnebeelden', 'Portretfotografie', 'Branding shoots', 'Dronebeelden', 'Folders & DTP', 'Social content'].map((item) => (
              <a
                key={item}
                href="https://thedaleyedit.nl"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-[130px] items-center justify-center rounded-[1.5rem] bg-white px-4 text-center text-base font-semibold uppercase tracking-[0.07em] text-forest/45 natural-shadow-box transition-all hover:text-forest/80 md:min-h-[160px]"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
