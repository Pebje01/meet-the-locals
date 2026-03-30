'use client'

import { useRef, Children } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

function extractText(node: React.ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (node && typeof node === 'object' && 'props' in node) {
    return extractText(node.props.children)
  }
  return ''
}

/**
 * Scroll-triggered text reveal with highlight mask (Benasy Travel style).
 * Words reveal progressively as you scroll through the element.
 */
export function TextReveal({
  children,
  className = '',
  highlightColor = 'rgba(212, 132, 90, 0.15)',
}: {
  children: React.ReactNode
  className?: string
  highlightColor?: string
}) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 85%', 'start 35%'],
  })

  const text = extractText(children)
  const words = text.split(/\s+/).filter(Boolean)

  return (
    <p ref={ref} className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => (
        <Word
          key={`${word}-${i}`}
          word={word}
          index={i}
          total={words.length}
          progress={scrollYProgress}
          highlightColor={highlightColor}
        />
      ))}
    </p>
  )
}

function Word({
  word,
  index,
  total,
  progress,
  highlightColor,
}: {
  word: string
  index: number
  total: number
  progress: ReturnType<typeof useScroll>['scrollYProgress']
  highlightColor: string
}) {
  const start = index / total
  const end = (index + 1) / total
  const opacity = useTransform(progress, [start, end], [0.2, 1])
  const bgOpacity = useTransform(progress, [start, end, end + 0.05], [0, 1, 0])
  const bg = useTransform(bgOpacity, (v) =>
    v > 0.05 ? highlightColor : 'transparent',
  )

  return (
    <motion.span
      style={{ opacity, backgroundColor: bg }}
      className="mr-[0.3em] inline-block py-0.5 px-0.5 rounded-sm transition-colors"
    >
      {word}
    </motion.span>
  )
}

/**
 * Scroll-triggered line reveal — a single line of text slides in
 * from behind a colored mask as you scroll.
 */
export function LineReveal({
  children,
  className = '',
  direction = 'left',
}: {
  children: React.ReactNode
  className?: string
  direction?: 'left' | 'right'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'start 45%'],
  })
  const maskWidth = useTransform(scrollYProgress, [0, 1], ['100%', '0%'])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {children}
      <motion.div
        style={{
          width: maskWidth,
          [direction === 'left' ? 'right' : 'left']: 0,
        }}
        className="absolute inset-y-0 bg-warm-white z-10"
      />
    </div>
  )
}
