import Image from 'next/image'

import { BarterDeal } from '@/components/BarterDeal'
import { FAQJsonLd } from '@/components/JsonLd'
import { OrganicEdge } from '@/components/OrganicEdge'
import { PhotoWithInfo } from '@/components/PhotoWithInfo'
import { Button } from '@/components/ui/Button'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { photoMeta } from '@/data/photoMeta'

const quickLinks = [
  { label: 'Samenwerken?', href: '/werk-in-opdracht#samenwerken' },
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

const sectors = ['Hotels', 'Horeca', 'Toerisme', 'Reismerken', 'Campagnes', 'Editorial']

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
    <main className="bg-cream">
      <FAQJsonLd questions={faqItems} />

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Dark green top */}
        <div className="relative bg-forest-dark">
          <div aria-hidden className="grain-layer opacity-60" />
          <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-24 pt-32 md:pb-28 md:pt-40 lg:px-10">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <Breadcrumbs items={[{ name: 'Over mij', href: '/over' }]} className="mb-5" />
                <h1 className="t-h1 mb-7 text-white">
                  Hi, ik ben Daley.
                </h1>
                <div className="mt-9 flex flex-wrap gap-3">
                  {quickLinks.map((link) => (
                    <Button key={link.href} href={link.href} variant="glass" size="sm">
                      {link.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="flex justify-center lg:col-span-5 lg:justify-end">
                <div className="relative aspect-[3/4] w-full max-w-[340px] overflow-hidden organic-img natural-shadow-box lg:max-w-[420px]">
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
          <OrganicEdge fill="var(--color-accent)" className="h-[36px] md:h-[56px]" />
        </div>

        {/* Orange stats strip */}
        <div className="relative -mt-px overflow-hidden bg-accent">
          <div aria-hidden className="grain-layer" />
          <div className="relative mx-auto max-w-[1400px] px-6 pb-16 pt-10 md:pb-20 lg:px-10">
            <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
              <div>
                <p className="font-display text-[52px] leading-none text-white md:text-[64px]">1988</p>
                <p className="mx-auto mt-3 max-w-[16rem] text-[13px] font-medium leading-snug text-white/80">Het jaar dat ik de wereld kwam verkennen</p>
              </div>
              <div>
                <p className="font-display text-[52px] leading-none text-white md:text-[64px]">30+</p>
                <p className="mx-auto mt-3 max-w-[16rem] text-[13px] font-medium leading-snug text-white/80">Jaar computernerd. Photoshop, websites maken, ontwerpen.</p>
              </div>
              <div>
                <p className="font-display text-[52px] leading-none text-white md:text-[64px]">6+</p>
                <p className="mx-auto mt-3 max-w-[16rem] text-[13px] font-medium leading-snug text-white/80">Jaar fotograaf</p>
              </div>
              <div>
                <p className="font-display text-[52px] leading-none text-white md:text-[64px]">5</p>
                <p className="mx-auto mt-3 max-w-[16rem] text-[13px] font-medium leading-snug text-white/80">Jaar was ik toen ik mijn eerste ervaring al deelde in een schoolkrant.</p>
              </div>
            </div>
          </div>
          <OrganicEdge fill="var(--color-cream)" className="h-[36px] md:h-[56px]" />
        </div>
      </section>

      {/* INTRO — photo grid + daughter paragraph */}
      <section className="relative overflow-hidden px-6 py-20 md:py-28 lg:px-10">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <h2 className="t-h2 mb-5 text-forest">
              Over mij
            </h2>
            <div className="t-lead space-y-5 text-text-muted">
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
                <div className="relative aspect-[4/5] overflow-hidden organic-img bg-cream-dark">
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
                <div className="relative aspect-square overflow-hidden organic-img-alt bg-cream-dark">
                  <Image
                    src="/media/over-tempel-lantaarns.webp"
                    alt="Chinese tempel, Maleisie"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 40vw, 18vw"
                  />
                </div>
                <div className="relative aspect-[4/5] overflow-hidden organic-img bg-cream-dark">
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
            <cite className="t-eyebrow mt-6 block not-italic text-accent">
              Daley Jansen
            </cite>
          </blockquote>
        </div>
      </section>

      <section className="bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="mb-12">
            <h2 className="t-h2 max-w-4xl text-forest">
              Reisobsessie? Zo kun je het wel noemen, ja.
            </h2>
          </div>

          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden organic-img-alt bg-cream-dark">
                <Image
                  src="/media/over-fotograaf-kust.webp"
                  alt="Aan het fotograferen op de kust"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 38vw"
                />
              </div>
            </div>

            <div className="t-lead space-y-5 text-text-muted lg:col-span-7">
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

      <section className="bg-cream py-4">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-6">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
            {[
              { src: '/media/over-zwembad-lezen.webp', alt: 'Lezen bij het zwembad', key: 'over-zwembad-lezen' },
              { src: '/media/over-peru-klooster.webp', alt: 'Santa Catalina klooster, Peru', key: 'over-peru-klooster' },
              { src: '/media/over-kleur-trappen.webp', alt: 'Kleurrijke trappen', key: 'over-kleur-trappen' },
              { src: '/media/over-tempel-lantaarns.webp', alt: 'Chinese tempel, Maleisie', key: 'over-tempel-lantaarns' },
            ].map((photo) => (
              <div key={photo.src} className="relative aspect-[3/4] overflow-hidden rounded-2xl">
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

      <section id="samenwerken" className="mt-16 scroll-mt-20 bg-cream-dark py-20 md:mt-24 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <h2 className="t-h2 mb-6 text-forest">
            Laten we samenwerken.
          </h2>
          <p className="t-lead mb-8 max-w-4xl text-text-muted">
            Dit kunnen hotels, B&amp;B&apos;s, reisbureaus, touroperators, caravan- en tentmerken,
            verkeersbureaus en andere reismerken zijn. Als professioneel fotograaf en brand designer
            kan ik je helpen met authentieke content, een converterende website of andere
            merkversterkende uitingen.
          </p>

          <ul className="t-lead mb-8 grid grid-cols-1 gap-3 text-text-muted md:grid-cols-2">
            {services.map((service) => (
              <li key={service} className="flex gap-3">
                <span aria-hidden className="mt-[0.6em] h-2 w-2 flex-none rounded-full bg-accent" />
                <span>{service}</span>
              </li>
            ))}
          </ul>

          <p className="t-lead mb-12 text-text-muted">
            Ik ben ervaren in het maken van en het werken met bestaande huisstijlen en tone-of-voice.
          </p>

          <Button href="/contact" arrow="right">
            Neem contact op
          </Button>
        </div>
      </section>

      <BarterDeal above="var(--color-cream-dark)" />

      {/* Sectoren als rustige tekstregel. Zodra er echte klantlogo's zijn,
          kunnen die hier in dezelfde rij komen te staan. */}
      <section className="bg-cream pb-4 pt-20 md:pt-28">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-6 md:flex-row md:items-center md:gap-10 lg:px-10">
          <h2 className="t-h3 shrink-0 text-forest">Waar ik voor fotografeer</h2>
          <ul className="flex flex-wrap gap-2.5">
            {sectors.map((item) => (
              <li key={item} className="pill border border-forest/15 bg-white/60 text-forest/75">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-6">
              <Eyebrow className="mb-4">Veelgestelde vragen</Eyebrow>
              <h2 className="t-h2 text-forest">
                Vragen over samenwerken en fotografie.
              </h2>
            </div>
            <p className="t-lead max-w-3xl text-forest/65 lg:col-span-6 lg:pt-10">
              Antwoorden op de vragen die meestal terugkomen rond fotografie, reiscontent en
              samenwerkingen met Meet the Locals. Kort, praktisch en zonder omwegen.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {faqColumns.map((column, columnIndex) => (
              <div key={columnIndex} className="self-start overflow-hidden rounded-3xl border border-forest/15 bg-white">
                {column.map((item) => (
                  <details
                    key={item.question}
                    className="group border-b border-forest/15 last:border-b-0"
                  >
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 px-6 py-6 text-left md:px-8 [&::-webkit-details-marker]:hidden">
                      <div>
                        <span className="t-meta mb-2 block font-semibold text-accent">
                          {item.category}
                        </span>
                        <h3 className="t-card text-forest">
                          {item.question}
                        </h3>
                      </div>
                      <span className="relative mt-1 flex h-8 w-8 flex-none items-center justify-center text-forest/80">
                        <span className="absolute h-0.5 w-5 rounded-full bg-current" />
                        <span className="absolute h-5 w-0.5 rounded-full bg-current transition-opacity group-open:opacity-0" />
                      </span>
                    </summary>
                    <div className="border-t border-forest/15 px-6 pb-7 pt-5 md:px-8">
                      <p className="t-body max-w-3xl text-forest/70">
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
      <section className="relative overflow-hidden bg-forest-dark noise-overlay py-28 md:py-36">
        <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
          <OrganicEdge position="top" fill="var(--color-cream)" className="h-[36px] md:h-[56px]" />
          <OrganicEdge fill="var(--color-cream-dark)" className="h-[36px] md:h-[56px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Eyebrow className="mb-5">Naast dit blog</Eyebrow>
              <h2 className="t-h2 mb-6 text-cream">
                Brand designer, fotograaf en webdesigner.
              </h2>
              <div className="t-lead space-y-4 text-cream/75">
                <p>
                  Naast Meet the Locals run ik The Daley Edit: mijn creatieve bureau waar ik
                  merken help met hun uitstraling, marketing en online aanwezigheid.
                </p>
                <p>
                  Ik combineer een goed gevoel voor esthetiek en design met slim en strategisch
                  merkinzicht. Het resultaat: merken die er niet alleen goed uitzien, maar ook
                  echt werken.
                </p>
                <p className="text-[16px] text-cream/55">
                  &quot;Ik vind het zo zonde als bedrijven hun potentie laten liggen.&quot;
                </p>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative aspect-[3/4] max-w-[340px] overflow-hidden organic-img-alt lg:max-w-full">
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
      <section className="bg-cream-dark py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <Eyebrow className="mb-4">The Daley Edit</Eyebrow>
          <h2 className="t-h2 mb-4 text-forest">
            Waar ik bij kan helpen.
          </h2>
          <p className="t-lead mb-12 max-w-2xl text-text-muted">
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
                className="rounded-3xl bg-white p-8 natural-shadow-box"
              >
                <h3 className="t-card mb-3 text-forest">
                  {item.title}
                </h3>
                <p className="t-body text-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mijn werk */}
      <section className="bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
          <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Eyebrow className="mb-4">Portfolio</Eyebrow>
              <h2 className="t-h2 text-forest">
                Bekijk mijn werk.
              </h2>
            </div>
            <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
              <Button href="/werk-in-opdracht" variant="forest">
                Bekijk portfolio
              </Button>
              <Button href="https://thedaleyedit.nl" shape="organic-btn-alt" arrow="diagonal">
                Naar The Daley Edit
              </Button>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
            {['Merkidentiteit', 'Websites', 'Campagnebeelden', 'Portretfotografie', 'Branding shoots', 'Dronebeelden', 'Folders & DTP', 'Social content'].map((item) => (
              <a
                key={item}
                href="https://thedaleyedit.nl"
                target="_blank"
                rel="noopener noreferrer"
                className="t-eyebrow flex min-h-[130px] items-center justify-center rounded-3xl bg-white px-4 text-center text-forest/55 natural-shadow-box transition-colors hover:text-accent md:min-h-[160px]"
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
