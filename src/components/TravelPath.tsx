'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'

// SVG path that weaves through the full page — designed for 1440px viewport width
// This path snakes left-right through each section
const TRAVEL_PATH =
  'M 720 0 C 720 80 720 120 680 200 C 620 320 300 380 280 500 C 260 620 500 680 700 740 C 900 800 1100 860 1080 1000 C 1060 1140 700 1200 500 1300 C 300 1400 200 1500 320 1640 C 440 1780 800 1800 900 1940 C 1000 2080 700 2200 500 2340 C 300 2480 380 2600 600 2720 C 820 2840 1000 2900 900 3060 C 800 3220 400 3300 360 3460 C 320 3620 600 3700 720 3800 C 840 3900 720 4000 720 4200'

// Location pins along the route
const PINS = [
  { progress: 0.08, label: 'Start', side: 'left' as const },
  { progress: 0.22, label: 'Thailand', side: 'right' as const },
  { progress: 0.38, label: 'Maleisië', side: 'left' as const },
  { progress: 0.55, label: 'Peru', side: 'right' as const },
  { progress: 0.72, label: 'Indonesië', side: 'left' as const },
  { progress: 0.88, label: 'Volgende...', side: 'right' as const },
]

export function TravelPath() {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const [pathLength, setPathLength] = useState(0)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Scroll progress for the entire page
  const { scrollYProgress } = useScroll()

  // Smooth the scroll progress for a buttery feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 30,
    restDelta: 0.0001,
  })

  // Path drawing: dashoffset goes from pathLength to 0
  const dashOffset = useTransform(smoothProgress, [0, 1], [pathLength, 0])

  // Parallax shift based on mouse position
  const parallaxX = useSpring(
    useTransform(mouseX, [0, 1], [-15, 15]),
    { stiffness: 100, damping: 30 }
  )
  const parallaxY = useSpring(
    useTransform(mouseY, [0, 1], [-10, 10]),
    { stiffness: 100, damping: 30 }
  )

  // Track mouse position (normalized 0–1)
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth)
      mouseY.set(e.clientY / window.innerHeight)
    },
    [mouseX, mouseY],
  )

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  // Measure the SVG path length + container
  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength())
    }

    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Airplane position along path
  const [planePos, setPlanePos] = useState({ x: 720, y: 0, angle: 90 })

  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (v) => {
      if (!pathRef.current) return
      const len = pathRef.current.getTotalLength()
      const point = pathRef.current.getPointAtLength(v * len)
      // Get next point for angle calculation
      const nextPoint = pathRef.current.getPointAtLength(
        Math.min(v * len + 2, len),
      )
      const angle =
        (Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180) /
        Math.PI
      setPlanePos({ x: point.x, y: point.y, angle })
    })
    return unsubscribe
  }, [smoothProgress])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-[5] overflow-hidden"
      aria-hidden="true"
    >
      <motion.svg
        viewBox="0 0 1440 4200"
        fill="none"
        preserveAspectRatio="xMidYMin slice"
        className="absolute inset-0 h-full w-full"
        style={{ x: parallaxX, y: parallaxY }}
      >
        <defs>
          {/* Gradient along the path */}
          <linearGradient id="pathGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c45a3c" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#c45a3c" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#c45a3c" stopOpacity="0.1" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="pathGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background trace (very subtle) */}
        <path
          d={TRAVEL_PATH}
          stroke="#c45a3c"
          strokeWidth="1"
          strokeOpacity="0.08"
          strokeDasharray="8 16"
          fill="none"
        />

        {/* Animated main path (drawn on scroll) */}
        <motion.path
          ref={pathRef}
          d={TRAVEL_PATH}
          stroke="url(#pathGradient)"
          strokeWidth="2"
          strokeDasharray={`${pathLength}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          fill="none"
          filter="url(#pathGlow)"
        />

        {/* Dotted overlay for the "drawn" portion */}
        <motion.path
          d={TRAVEL_PATH}
          stroke="#c45a3c"
          strokeWidth="2"
          strokeDasharray="4 12"
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          strokeOpacity="0.5"
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

        {/* Airplane icon */}
        <motion.g
          style={{
            translateX: planePos.x,
            translateY: planePos.y,
          }}
        >
          <g
            transform={`rotate(${planePos.angle}, 0, 0) scale(0.7)`}
            style={{ transformOrigin: '0 0' }}
          >
            <g transform="translate(-12, -12)">
              {/* Paper airplane / minimal plane icon */}
              <path
                d="M2 12L22 2L16 22L12 14L2 12Z"
                fill="#c45a3c"
                fillOpacity="0.8"
                stroke="#c45a3c"
                strokeWidth="0.5"
                strokeLinejoin="round"
              />
              <path
                d="M12 14L22 2"
                stroke="#1a2e1a"
                strokeWidth="0.5"
                strokeOpacity="0.3"
              />
            </g>
          </g>
        </motion.g>
      </motion.svg>
    </div>
  )
}

// Individual pin marker with appear animation
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

    // Calculate static position
    const point = pathRef.current.getPointAtLength(pin.progress * pathLength)
    setPos({ x: point.x, y: point.y })

    const unsubscribe = scrollProgress.on('change', (v) => {
      setVisible(v >= pin.progress - 0.02)
    })
    return unsubscribe
  }, [pathRef, pathLength, pin.progress, scrollProgress])

  if (pos.x === 0 && pos.y === 0) return null

  const labelX = pin.side === 'left' ? -60 : 20
  const labelAnchor = pin.side === 'left' ? 'end' : 'start'

  return (
    <g
      transform={`translate(${pos.x}, ${pos.y})`}
      opacity={visible ? 1 : 0}
      style={{ transition: 'opacity 0.6s ease' }}
    >
      {/* Pulse ring */}
      <circle r="12" fill="#c45a3c" fillOpacity="0.1">
        {visible && (
          <animate
            attributeName="r"
            values="8;18;8"
            dur="3s"
            repeatCount="indefinite"
          />
        )}
        {visible && (
          <animate
            attributeName="fill-opacity"
            values="0.15;0;0.15"
            dur="3s"
            repeatCount="indefinite"
          />
        )}
      </circle>

      {/* Pin dot */}
      <circle r="4" fill="#c45a3c" fillOpacity="0.7" />
      <circle r="2" fill="#f5f2eb" />

      {/* Label */}
      <text
        x={labelX}
        y="4"
        fill="#c45a3c"
        fontSize="11"
        fontFamily="'DM Sans', sans-serif"
        fontWeight="500"
        textAnchor={labelAnchor}
        letterSpacing="0.1em"
        textTransform="uppercase"
        fillOpacity="0.6"
      >
        {pin.label}
      </text>
    </g>
  )
}
