/**
 * De organische sectierand van Meet the Locals.
 *
 * Op de site stonden zeven verschillende met de hand getekende golven, elk met
 * een eigen viewBox, hoogte en amplitude. Hierdoor liep geen enkele overgang
 * hetzelfde. Dit component legt één huisvorm vast, in twee standen:
 *
 *   vullen   De golf wordt geschilderd in de kleur van de sectie eronder en
 *            steekt omhoog de bovenliggende sectie in. Gebruik dit wanneer
 *            de sectie eronder een effen achtergrond heeft.
 *
 *   knippen  De sectie krijgt zelf een golvende rand via clip-path, zodat
 *            alles wat eronder ligt gewoon doorloopt. Nodig wanneer daar een
 *            foto staat: een gevulde golf zou daar als een gekleurde strook
 *            overheen liggen, en dat is precies wat er misging op /verhalen.
 */

/** De huisgolf: drie rustige bergen en dalen over de volle breedte. */
const CURVE = 'C160,29 320,62 540,42 C760,21 900,58 1100,37 C1300,17 1380,46 1440,33'

/** Zelfde vorm, maar omgekeerd getekend voor een rand aan de bovenkant. */
const CURVE_OMGEKEERD = 'C1300,17 1380,46 1440,33'

export type OrganicEdgeProps = {
  /** Aan welke kant van de sectie de rand komt. */
  position?: 'top' | 'bottom'
  /** Kleur van de sectie aan de andere kant, bijvoorbeeld 'var(--color-warm-white)'. */
  fill: string
  /** Hoogte van de golf. Standaard loopt mee met het scherm. */
  className?: string
}

/**
 * Golf die de kleur van de aangrenzende sectie de huidige sectie in trekt.
 * Zet hem in een sectie met `position: relative`.
 */
export function OrganicEdge({
  position = 'bottom',
  fill,
  className = 'h-[40px] md:h-[70px]',
}: OrganicEdgeProps) {
  const isTop = position === 'top'

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 z-[2] ${isTop ? 'top-0' : 'bottom-0'}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className={`block w-full ${className} ${isTop ? 'rotate-180' : ''}`}
      >
        <path d={`M0,100 L0,50 ${CURVE} L1440,100 Z`} fill={fill} />
      </svg>
    </div>
  )
}

/**
 * De huisgolf als clip-path, in verhoudingen van de sectie zelf.
 *
 * `diepte` is welk deel van de sectiehoogte de golf beslaat. Bij een hoge hero
 * mag dat klein zijn, bij een lage sectie groter, zodat de golf overal
 * ongeveer even diep oogt in pixels.
 */
export function organicClipPath(diepte = 0.09): string {
  const top = 1 - diepte
  const y = (v: number) => (top + (v / 100) * diepte).toFixed(4)

  // Van rechts naar links, want een clip-path houdt vast wat erbínnen valt.
  return (
    `M 0,0 L 1,0 L 1,${y(33)} ` +
    `C 0.958,${y(46)} 0.903,${y(17)} 0.764,${y(37)} ` +
    `C 0.625,${y(58)} 0.528,${y(21)} 0.375,${y(42)} ` +
    `C 0.222,${y(62)} 0.111,${y(29)} 0,${y(50)} Z`
  )
}

/**
 * Plaats dit één keer in de sectie die je wilt knippen, en verwijs ernaar met
 * `style={{ clipPath: 'url(#<id>)' }}`.
 */
export function OrganicClipDefs({ id, diepte = 0.09 }: { id: string; diepte?: number }) {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <defs>
        <clipPath id={id} clipPathUnits="objectBoundingBox">
          <path d={organicClipPath(diepte)} />
        </clipPath>
      </defs>
    </svg>
  )
}

export { CURVE as ORGANIC_CURVE, CURVE_OMGEKEERD }
