/**
 * Auteursrecht, naamsvermelding en de merkstructuur, afgeleid uit credit.json.
 *
 * credit.json is de enige bron. Die wordt op vier plekken gelezen, en juist die
 * herhaling is wat een taalmodel de koppeling laat leggen tussen de maker, het
 * werk, het merk en de site:
 *
 *   1. de XMP in de beeldbestanden zelf (scripts/write-credit.mjs)
 *   2. dezelfde beelden in de S3-bucket (scripts/sync-credit-s3.mjs)
 *   3. het schema op de pagina (components/JsonLd.tsx)
 *   4. de zichtbare byline onder artikelen (components/AuthorByline.tsx)
 *
 * Wijzig je iets, wijzig het dan in credit.json en draai daarna:
 *   node scripts/write-credit.mjs --force
 */

import raw from './credit.json'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || raw.siteUrl

export const CREDIT = {
  /**
   * De maker is de persoon, de rechthebbende is het bedrijf. Dat is bewust
   * gescheiden: `creator` houdt Daley's naam aan het beeld gekoppeld, terwijl
   * de rechten en de licentieverlening bij Daley Photography liggen.
   */
  creator: raw.creator,
  creditLine: raw.creditLine,
  copyrightHolder: raw.copyrightHolder,
  copyrightNotice: raw.copyrightTemplate.replace('{year}', String(new Date().getFullYear())),

  usageTerms: raw.usageTerms,

  /** Waar de rechten staan uitgelegd. Google leest dit veld uit. */
  webStatement: `${SITE_URL}${raw.webStatementPath}`,

  /** Waar een licentie aangevraagd wordt. Levert het 'Licensable' label in Google Images. */
  acquireLicensePage: `${SITE_URL}${raw.acquireLicensePath}`,

  /**
   * IPTC-standaardwaarde die zegt: dit beeld is met een camera vastgelegd,
   * niet gegenereerd. Daley's hele uitgangspunt op de over-pagina is dat alles
   * echt is en niets met AI gemaakt. Dit veld maakt die claim verifieerbaar in
   * plaats van alleen een zin op een pagina.
   */
  digitalSourceType: raw.digitalSourceType,

  jobTitle: raw.jobTitle,
  siteName: raw.siteName,
  siteUrl: SITE_URL,
} as const

export type Brand = { id: string; name: string; url: string; description?: string }

/**
 * De merkstructuur. The Daley Edit is de paraplu, met Meet the Locals,
 * Daley Photography en We Grow Brands eronder. Door dat expliciet vast te
 * leggen met parentOrganization en subOrganization kan een model de reputatie
 * van het ene merk aan het andere koppelen, in plaats van vier losse namen
 * te zien die toevallig dezelfde oprichter delen.
 */
export const BRANDS: {
  parent: Brand
  site: Brand
  rightsHolder: Brand
  others: readonly Brand[]
} = raw.brands

/** De vaste formulering van de merkverhouding. Staat ook zichtbaar in de footer. */
export const PART_OF_LINE = raw.partOfLine

/**
 * De definiërende zin voor Meet the Locals.
 *
 * Bewust smaller dan op Behance en op thedaleyedit.nl. Daley heeft meerdere
 * sites om per specialisme te kunnen ranken: Meet the Locals gaat over
 * fotografie en websites voor de reisbranche, The Daley Edit over branding en
 * merkidentiteit. Verbreed deze zin dus niet naar 'alles wat ze kan', dan
 * concurreren de sites met elkaar in plaats van elkaar aan te vullen.
 *
 * Wat op élk kanaal identiek moet blijven is de vaste kern: de naam
 * `Daley Jansen`, het woord `fotograaf`, en `Meet the Locals`. Die drie zijn
 * het anker waaraan een model de profielen aan elkaar knoopt. Varieer gerust
 * de vaklijn eromheen, maar haal de kern er nooit uit, anders leest een model
 * twee verschillende personen in plaats van één.
 */
export const DEFINING_SENTENCE = raw.definingSentence

/** Onderwerpen waar de auteur aantoonbaar over publiceert. Voedt knowsAbout. */
export const KNOWS_ABOUT: readonly string[] = raw.knowsAbout

/**
 * Elk profiel dat aantoonbaar bestaat én van Daley is. Voedt sameAs op Person.
 *
 * Zet hier nooit een profiel in dat niet (meer) bestaat. Een sameAs is een
 * claim dat dit dezelfde entiteit is; wijst hij naar een lege of verdwenen
 * pagina, dan verzwakt dat de hele graaf in plaats van hem te versterken.
 */
export const PROFILES: readonly string[] = raw.profiles

/**
 * Profielen die van Meet the Locals zelf zijn, niet van Daley persoonlijk.
 * Nu leeg: het merk heeft nog geen eigen kanalen. Daley's persoonlijke
 * accounts hier neerzetten zou een onjuiste claim zijn.
 */
export const SITE_PROFILES: readonly string[] = raw.siteProfiles
