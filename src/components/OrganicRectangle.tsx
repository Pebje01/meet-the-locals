import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
}

// De SVG steekt met vaste pixelwaarden buiten de container uit zodat de
// blobvorm niet wordt weggeknipt door overflow of CSS filter-regio's.
// De schaduw zit in een SVG <filter> — geen CSS filter, dat knipt de overflow af.
const BLEED_X = 12  // px uitsteken links en rechts
const BLEED_Y = 6   // px uitsteken boven en onder

export default function OrganicRectangle({ children, className = '' }: Props) {
  return (
    <div className={`relative ${className}`}>
      <svg
        aria-hidden="true"
        className="pointer-events-none select-none absolute"
        style={{
          left:   -BLEED_X,
          top:    -BLEED_Y,
          width:  `calc(100% + ${BLEED_X * 2}px)`,
          height: `calc(100% + ${BLEED_Y * 2}px)`,
        }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="org-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="3" stdDeviation="7"
              floodColor="#0f1d0f" floodOpacity="0.10" />
          </filter>
        </defs>

        {/*
          Pad-uitleg (viewBox 0–100 × 0–100, gemapt op de uitgebreide SVG):
          x=0   → BLEED_X px links  van container  (= 20px buiten)
          x=100 → BLEED_X px rechts van container  (= 20px buiten)
          x=15  → ~container-linkerrand
          x=85  → ~container-rechterrand

          Vorm: smal bij hoeken, bol aan de zijkanten in het midden.
          Elke kant heeft twee bezier-segmenten met verschillende
          uitwijkposities zodat het asymmetrisch en organisch oogt.
        */}
        <path
          d="
            M 14,6
            C 38,1 64,3 86,7
            C 98,16 90,34 98,50
            C 90,66 98,84 86,94
            C 64,99 38,97 14,94
            C 2,84 10,66 2,50
            C 10,34 2,16 14,6
            Z
          "
          fill="var(--color-cream, #f5efe6)"
          filter="url(#org-shadow)"
        />
      </svg>

      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
