'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

const COLOR = 'rgba(26, 46, 26, 0.12)'

export function TravelPath() {
  const pathRef = useRef<SVGPathElement>(null)
  const [pathLength, setPathLength] = useState(0)
  const [pageHeight, setPageHeight] = useState(0)
  const [pathD, setPathD] = useState('')

  const { scrollYProgress } = useScroll()
  const laggy = useSpring(scrollYProgress, { stiffness: 30, damping: 50 })
  const progress = useTransform(laggy, [0, 1], [0, 0.85])

  useEffect(() => {
    const build = () => {
      const h = document.documentElement.scrollHeight
      setPageHeight(h)

      // Wide sweeping curves across the full page width
      // viewBox will be 0 0 1440 h, so we use real page coordinates
      const p = [
        [1200, 0],
        [400, h * 0.08],
        [1100, h * 0.18],
        [300, h * 0.28],
        [900, h * 0.38],
        [200, h * 0.48],
        [1000, h * 0.58],
        [350, h * 0.68],
        [1100, h * 0.78],
        [500, h * 0.88],
        [800, h],
      ]

      let d = `M ${p[0][0]} ${p[0][1]}`
      for (let i = 1; i < p.length; i++) {
        const prev = p[i - 1]
        const curr = p[i]
        const midY = (prev[1] + curr[1]) / 2
        d += ` C ${prev[0]} ${midY}, ${curr[0]} ${midY}, ${curr[0]} ${curr[1]}`
      }
      setPathD(d)
    }
    build()
    const ro = new ResizeObserver(build)
    ro.observe(document.documentElement)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (pathRef.current) setPathLength(pathRef.current.getTotalLength())
  }, [pathD])

  const dashOffset = useTransform(progress, (p) => pathLength * (1 - p))

  // Airplane position
  const [plane, setPlane] = useState({ x: 1200, y: 0, angle: 90 })

  useEffect(() => {
    if (!pathLength) return
    const unsub = progress.on('change', (p) => {
      if (!pathRef.current) return
      const at = p * pathLength
      const pt = pathRef.current.getPointAtLength(at)
      const ahead = pathRef.current.getPointAtLength(Math.min(at + 15, pathLength))
      const angle = (Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180) / Math.PI
      setPlane({ x: pt.x, y: pt.y, angle })
    })
    return unsub
  }, [progress, pathLength])

  if (!pageHeight || !pathD) return null

  return (
    <div
      className="pointer-events-none absolute top-0 left-0 right-0 z-[5]"
      style={{ height: pageHeight }}
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 1440 ${pageHeight}`}
        fill="none"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Solid line drawn on scroll (clipped by dashoffset) */}
        <motion.path
          ref={pathRef}
          d={pathD}
          stroke="#1a2e1a"
          strokeWidth="3"
          strokeOpacity="0.15"
          strokeDasharray={pathLength || 1}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          fill="none"
        />

        {/* Visible dashed dots on top (also clipped by dashoffset) */}
        <motion.path
          d={pathD}
          stroke="#1a2e1a"
          strokeWidth="3.5"
          strokeOpacity="0.12"
          strokeDasharray="8 16"
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          fill="none"
        />

        {/* Airplane ✈ — simple, clear, rotated in direction of travel */}
        {pathLength > 0 && (
          <g transform={`translate(${plane.x}, ${plane.y})`}>
            <g transform={`rotate(${plane.angle + 90})`}>
              {/* Simple top-down airplane */}
              <g transform="translate(-18, -18) scale(1.5)">
                {/* Body */}
                <ellipse cx="12" cy="12" rx="1.8" ry="9" fill="#1a2e1a" fillOpacity="0.25" />
                {/* Left wing */}
                <path d="M12 9 L2 13 L12 12Z" fill="#1a2e1a" fillOpacity="0.2" />
                {/* Right wing */}
                <path d="M12 9 L22 13 L12 12Z" fill="#1a2e1a" fillOpacity="0.2" />
                {/* Left tail */}
                <path d="M12 19 L8 22 L12 20Z" fill="#1a2e1a" fillOpacity="0.18" />
                {/* Right tail */}
                <path d="M12 19 L16 22 L12 20Z" fill="#1a2e1a" fillOpacity="0.18" />
              </g>
            </g>
          </g>
        )}
      </svg>
    </div>
  )
}
