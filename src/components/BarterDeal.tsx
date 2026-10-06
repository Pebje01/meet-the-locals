import Image from 'next/image'
import { OrganicEdge } from '@/components/OrganicEdge'
import { Eyebrow } from '@/components/ui/Eyebrow'

/**
 * Donkere sectie over barterdeals. `above` en `below` zijn de kleuren van de
 * secties eromheen: de golven nemen die over, zodat er geen harde naad is.
 */
export function BarterDeal({
  above = 'var(--color-cream)',
  below = 'var(--color-cream)',
}: {
  above?: string
  below?: string
}) {
  return (
    <section className="relative overflow-hidden bg-forest-dark noise-overlay py-28 md:py-36">
      {/* Boven de korrel, zodat de golven effen blijven */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
        <OrganicEdge position="top" fill={above} className="h-[36px] md:h-[56px]" />
        <OrganicEdge fill={below} className="h-[36px] md:h-[56px]" />
      </div>
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Tekst */}
          <div className="lg:col-span-7">
            <Eyebrow className="mb-5">Barterdeal</Eyebrow>

            <h2 className="t-h2 mb-8 text-cream">
              Make me an offer
              <br />
              <span className="text-accent">I can&apos;t refuse.</span>
            </h2>

            <div className="t-lead space-y-5 text-cream/75">
              <p>
                Werk je bij een bedrijf in de reisbranche of alles eromheen, en wil je graag
                samenwerken? Dan sta ik open voor een goede barterdeal. Meestal niet, eerlijk is
                eerlijk, maar wel als het echt om een uitzonderlijk goede ruil gaat. ;)
              </p>
              <p>
                Want voor niets gaat de zon op, en mijn rekeningen betaal ik echt niet van
                zichtbaarheid. Maar tegen een mooie ruil zeg ik geen nee. Make me an offer I
                can&apos;t refuse?
              </p>
              <p className="text-cream/90">
                En het bedrijf zelf? Dat krijgt natuurlijk gewoon professionele, hoogwaardige
                kwaliteit van een professional.
              </p>
            </div>
          </div>

          {/* Foto */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[3/4] organic-img natural-shadow-box mx-auto max-w-[460px] lg:max-w-none">
              <Image
                src="/media/barterdeal-daley.webp"
                alt="Daley ontspannen op een rooftop terras tijdens een reis"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 460px, 40vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
