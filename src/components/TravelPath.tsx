'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'

const ACCENT = '#d4845a'

// Pins placed at % of total page scroll
const PINS = [
  { progress: 0.05, label: 'Start', side: 'right' as const },
  { progress: 0.20, label: 'Thailand', side: 'left' as const },
  { progress: 0.38, label: 'Maleisië', side: 'right' as const },
  { progress: 0.55, label: 'Peru', side: 'left' as const },
  { progress: 0.73, label: 'Indonesië', side: 'right' as const },
  { progress: 0.90, label: 'Volgende...', side: 'left' as const },
]

/**
 * Build an SVG path that snakes through the page.
 * viewBox width = 200 (abstract units), height = measured page height.
 * The path stays in a narrow column on the right side of the viewport.
 */
function buildPath(height: number): string {
  const segments = 12
  const segH = height / segments
  const points: [number, number][] = []

  for (let i = 0; i <= segments; i++) {
    // Zigzag between x=40 and x=160 within the 200-wide viewBox
    const x = i % 2 === 0 ? 60 : 140
    points.push([x, i * segH])
  }

  // Build smooth cubic bezier path through points
  let d = `M ${points[0][0]} ${points[0][1]}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const cpY = (prev[1] + curr[1]) / 2
    d += ` C ${prev[0]} ${cpY}, ${curr[0]} ${cpY}, ${curr[0]} ${curr[1]}`
  }
  return d
}

export function TravelPath() {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const [pathLength, setPathLength] = useState(0)
  const [pageHeight, setPageHeight] = useState(0)
  const [pathD, setPathD] = useState('')
  const mouseX = useMotionValue(0)

  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 30,
    restDelta: 0.0001,
  })

  const dashOffset = useTransform(smoothProgress, [0, 1], [pathLength, 0])

  // Subtle horizontal sway on mouse
  const parallaxX = useSpring(
    useTransform(mouseX, [0, 1], [-8, 8]),
    { stiffness: 80, damping: 25 }
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => mouseX.set(e.clientX / window.innerWidth),
    [mouseX],
  )

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  // Measure page height & build path
  useEffect(() => {
    const measure = () => {
      const h = document.documentElement.scrollHeight
      setPageHeight(h)
      setPathD(buildPath(h))
    }
    measure()

    const ro = new ResizeObserver(measure)
    ro.observe(document.documentElement)
    return () => ro.disconnect()
  }, [])

  // Once path renders, measure its length
  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength())
    }
  }, [pathD])

  // Airplane follows the path
  const [planePos, setPlanePos] = useState({ x: 100, y: 0, angle: 90 })

  useEffect(() => {
    if (!pathLength) return
    const unsub = smoothProgress.on('change', (v) => {
      if (!pathRef.current) return
      const len = pathRef.current.getTotalLength()
      const pt = pathRef.current.getPointAtLength(v * len)
      const next = pathRef.current.getPointAtLength(Math.min(v * len + 3, len))
      const angle = (Math.atan2(next.y - pt.y, next.x - pt.x) * 180) / Math.PI
      setPlanePos({ x: pt.x, y: pt.y, angle })
    })
    return unsub
  }, [smoothProgress, pathLength])

  if (!pageHeight || !pathD) return null

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute top-0 right-0 z-[5]"
      style={{ width: '15vw', maxWidth: 220, minWidth: 100, height: pageHeight }}
      aria-hidden="true"
    >
      <motion.svg
        viewBox={`0 0 200 ${pageHeight}`}
        fill="none"
        preserveAspectRatio="none"
        className="w-full h-full"
        style={{ x: parallaxX }}
      >
        <defs>
          <linearGradient id="tpGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ACCENT} stopOpacity="0.45" />
            <stop offset="50%" stopColor={ACCENT} stopOpacity="0.25" />
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0.1" />
          </linearGradient>
          <filter id="tpGlow" x="-20%" y="-2%" width="140%" height="104%">
            <feGaussianBlur stdDeviation="2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ghost trace — always visible, very faint */}
        <path
          d={pathD}
          stroke={ACCENT}
          strokeWidth="1"
          strokeOpacity="0.06"
          strokeDasharray="6 14"
          fill="none"
        />

        {/* Main drawn path */}
        <motion.path
          ref={pathRef}
          d={pathD}
          stroke="url(#tpGrad)"
          strokeWidth="1.5"
          strokeDasharray={pathLength || 1}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          fill="none"
          filter="url(#tpGlow)"
        />

        {/* Dotted overlay */}
        <motion.path
          d={pathD}
          stroke={ACCENT}
          strokeWidth="1.5"
          strokeDasharray="3 10"
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          strokeOpacity="0.4"
          fill="none"
        />

        {/* Pin markers */}
        {PINS.map((pin, i) => (
          <PinMarker
            key={i}
            pin={pin}
            pathRef={pathRef}
            scrollProgress={smoothProgress}
            pathLength={pathLength}
          />
        ))}

        {/* Paper airplane */}
        {pathLength > 0 && (
          <g
            transform={`translate(${planePos.x}, ${planePos.y}) rotate(${planePos.angle}) scale(0.55)`}
            style={{ transformOrigin: '0 0' }}
          >
            <g transform="translate(-12, -12)">
              <path
                d="M2 12L22 2L16 22L12 14L2 12Z"
                fill={ACCENT}
                fillOpacity="0.75"
                stroke={ACCENT}
                strokeWidth="0.5"
                strokeLinejoin="round"
              />
            </g>
          </g>
        )}
      </motion.svg>
    </div>
  )
}

function PinMarker({
  pin,
  pathRef,
  scrollProgress,
  pathLength,
}: {
  pin: (typeof PINS)[number]
  pathRef: React.RefObject<SVGPathElement | null>
  scrollProgress: ReturnType<typeof useSpring>
  pathLength: number
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!pathRef.current || pathLength === 0) return
    const pt = pathRef.current.getPointAtLength(pin.progress * pathLength)
    setPos({ x: pt.x, y: pt.y })

    const unsub = scrollProgress.on('change', (v) => {
      setVisible(v >= pin.progress - 0.02)
    })
    return unsub
  }, [pathRef, pathLength, pin.progress, scrollProgress])

  if (pos.x === 0 && pos.y === 0) return null

  const labelX = pin.side === 'left' ? -10 : 18
  const anchor = pin.side === 'left' ? 'end' : 'start'

  return (
    <g
      transform={`translate(${pos.x}, ${pos.y})`}
      opacity={visible ? 1 : 0}
      style={{ transition: 'opacity 0.6s ease' }}
    >
      {/* Pulse */}
      <circle r="10" fill={ACCENT} fillOpacity="0.08">
        {visible && (
          <>
            <animate attributeName="r" values="6;14;6" dur="3s" repeatCount="indefinite" />
            <animate attributeName="fill-opacity" values="0.12;0;0.12" dur="3s" repeatCount="indefinite" />
          </>
        )}
      </circle>
      <circle r="3.5" fill={ACCENT} fillOpacity="0.6" />
      <circle r="1.5" fill="#faf8f4" />

      <text
        x={labelX}
        y="4"
        fill={ACCENT}
        fontSize="9"
        fontFamily="'DM Sans', sans-serif"
        fontWeight="500"
        textAnchor={anchor}
        letterSpacing="0.08em"
        fillOpacity="0.5"
      >
        {pin.label.toUpperCase()}
      </text>
    </g>
  )
}
