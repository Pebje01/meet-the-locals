import Image from 'next/image'

export function BarterDeal() {
  return (
    <section className="relative overflow-hidden bg-forest-dark noise-overlay py-20 md:py-28">
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Tekst */}
          <div className="lg:col-span-7">
            <span className="mb-5 block text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
              Barterdeal
            </span>

            <h2 className="mb-8 leading-[0.95] text-white! text-4xl md:text-6xl lg:text-7xl">
              Make me an offer
              <br />
              <span className="text-accent">I can&apos;t refuse.</span>
            </h2>

            <div className="space-y-5 text-[18px] leading-relaxed text-cream/75 md:text-[20px]">
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
