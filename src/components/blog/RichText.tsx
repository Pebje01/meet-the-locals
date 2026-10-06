import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * Rendert de Lexical-JSON uit Payload naar JSX, in de huisstijl van de blog.
 *
 * Eén renderer voor alle artikeltypen (korte verhalen, fotografieposts), zodat
 * koppen, lijsten en afbeeldingen overal hetzelfde ogen. Koppen krijgen een id
 * zodat de inhoudsopgave in de zijbalk ernaartoe kan springen.
 */

export type LexicalNode = {
  type: string
  tag?: string
  text?: string
  format?: number | string
  listType?: string
  value?: unknown
  relationTo?: string
  fields?: {
    url?: string
    newTab?: boolean
    linkType?: 'custom' | 'internal'
    doc?: { relationTo?: string; value?: unknown }
  }
  children?: LexicalNode[]
}

type LexicalRoot = { root?: { children?: LexicalNode[] } }

/* Lexical zet tekstopmaak als bitvlaggen in `format`. */
const IS_BOLD = 1
const IS_ITALIC = 2
const IS_STRIKETHROUGH = 4
const IS_UNDERLINE = 8
const IS_CODE = 16
const IS_SUBSCRIPT = 32
const IS_SUPERSCRIPT = 64

export function headingSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function nodeText(node: LexicalNode): string {
  if (node.type === 'text') return node.text ?? ''
  return (node.children ?? []).map(nodeText).join('')
}

export type Heading = { id: string; text: string; tag: string }

/** Koppen op het hoogste niveau, voor de inhoudsopgave. */
export function extractHeadings(data: unknown): Heading[] {
  const root = (data as LexicalRoot | null)?.root
  if (!root?.children) return []

  const seen = new Map<string, number>()
  const headings: Heading[] = []
  for (const node of root.children) {
    if (node.type !== 'heading') continue
    const text = nodeText(node).trim()
    if (!text) continue
    headings.push({ id: uniqueId(headingSlug(text), seen), text, tag: node.tag ?? 'h2' })
  }
  return headings
}

function uniqueId(base: string, seen: Map<string, number>): string {
  const count = seen.get(base) ?? 0
  seen.set(base, count + 1)
  return count === 0 ? base : `${base}-${count + 1}`
}

function renderText(node: LexicalNode): ReactNode {
  let el: ReactNode = node.text ?? ''
  const fmt = typeof node.format === 'number' ? node.format : 0
  if (fmt & IS_BOLD) el = <strong>{el}</strong>
  if (fmt & IS_ITALIC) el = <em>{el}</em>
  if (fmt & IS_UNDERLINE) el = <u>{el}</u>
  if (fmt & IS_STRIKETHROUGH) el = <s>{el}</s>
  if (fmt & IS_SUBSCRIPT) el = <sub>{el}</sub>
  if (fmt & IS_SUPERSCRIPT) el = <sup>{el}</sup>
  if (fmt & IS_CODE) {
    el = (
      <code className="bg-cream-dark/60 px-1.5 py-0.5 rounded text-[0.88em] font-mono text-forest">
        {el}
      </code>
    )
  }
  return el
}

function linkHref(node: LexicalNode): { href: string; external: boolean; newTab: boolean } {
  const fields = node.fields ?? {}
  if (fields.linkType === 'internal' && fields.doc) {
    const doc = fields.doc.value
    const slug = doc && typeof doc === 'object' ? (doc as { slug?: string }).slug : undefined
    const base =
      fields.doc.relationTo === 'stories'
        ? '/verhalen'
        : fields.doc.relationTo === 'destinations'
          ? '/bestemmingen'
          : '/blog'
    return { href: slug ? `${base}/${slug}` : base, external: false, newTab: Boolean(fields.newTab) }
  }
  const href = fields.url ?? '#'
  const external = /^https?:\/\//.test(href)
  return { href, external, newTab: fields.newTab ?? external }
}

function uploadMedia(node: LexicalNode): { url: string; alt: string; width?: number; height?: number; caption?: string } | null {
  const value = node.value
  if (!value || typeof value !== 'object') return null
  const media = value as { url?: string | null; alt?: string | null; width?: number | null; height?: number | null; caption?: string | null }
  if (!media.url) return null
  return {
    url: media.url,
    alt: media.alt ?? '',
    width: media.width ?? undefined,
    height: media.height ?? undefined,
    caption: media.caption ?? undefined,
  }
}

function renderNodes(nodes: LexicalNode[], seen: Map<string, number>): ReactNode[] {
  return nodes.map((node, i) => <RenderNode key={i} node={node} seen={seen} />)
}

function RenderNode({ node, seen }: { node: LexicalNode; seen: Map<string, number> }): ReactNode {
  const children = node.children ? renderNodes(node.children, seen) : null

  switch (node.type) {
    case 'text':
      return renderText(node)

    case 'linebreak':
      return <br />

    case 'paragraph':
      if (!node.children?.length) return null
      return <p className="mb-6 leading-[1.85] text-[17px] text-forest/80">{children}</p>

    case 'heading': {
      const tag = node.tag ?? 'h2'
      const id = uniqueId(headingSlug(nodeText(node).trim()), seen)
      if (tag === 'h2') {
        return (
          <h2 id={id} className="scroll-mt-28 text-2xl md:text-3xl text-forest leading-snug mt-12 mb-4 pb-3 border-b border-forest/10">
            {children}
          </h2>
        )
      }
      if (tag === 'h3') {
        return (
          <h3 id={id} className="scroll-mt-28 text-xl md:text-2xl text-forest leading-snug mt-8 mb-3">
            {children}
          </h3>
        )
      }
      return (
        <h4 id={id} className="scroll-mt-28 text-forest text-lg mt-6 mb-2">
          {children}
        </h4>
      )
    }

    case 'list': {
      const isOrdered = node.listType === 'number'
      if (isOrdered) {
        return <ol className="list-decimal pl-6 mb-6 space-y-2 text-[17px] text-forest/80">{children}</ol>
      }
      return <ul className="mb-6 space-y-2 text-[17px] text-forest/80">{children}</ul>
    }

    case 'listitem': {
      const isNested = node.children?.[0]?.type === 'list'
      return (
        <li className="flex items-start gap-2.5 leading-relaxed">
          {!isNested && <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-[9px]" />}
          <span className="min-w-0">{children}</span>
        </li>
      )
    }

    case 'quote':
      return (
        <blockquote className="my-8 pl-6 border-l-4 border-accent/50 bg-cream-dark/40 py-4 pr-6 rounded-r-xl">
          <p className="text-forest/75 text-[17px] italic leading-relaxed">{children}</p>
        </blockquote>
      )

    case 'horizontalrule':
      return <hr className="my-10 border-forest/10" />

    case 'link':
    case 'autolink': {
      const { href, external, newTab } = linkHref(node)
      const className = 'text-accent underline underline-offset-2 hover:text-accent-dark transition-colors'
      if (external || newTab) {
        return (
          <a href={href} target={newTab ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className={className}>
            {children}
          </a>
        )
      }
      return (
        <Link href={href} className={className}>
          {children}
        </Link>
      )
    }

    case 'upload': {
      const media = uploadMedia(node)
      if (!media) return null
      return (
        <figure className="my-10">
          <div className="relative organic-img overflow-hidden bg-cream-dark">
            {media.width && media.height ? (
              <Image
                src={media.url}
                alt={media.alt}
                width={media.width}
                height={media.height}
                className="w-full h-auto"
                sizes="(max-width: 1024px) 100vw, 800px"
              />
            ) : (
              <div className="relative aspect-[3/2]">
                <Image src={media.url} alt={media.alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 800px" />
              </div>
            )}
          </div>
          {media.caption && (
            <figcaption className="mt-3 text-[12px] uppercase tracking-[0.1em] text-text-muted/70">{media.caption}</figcaption>
          )}
        </figure>
      )
    }

    default:
      return children ? <>{children}</> : null
  }
}

export function RichText({ data }: { data: unknown }) {
  const root = (data as LexicalRoot | null)?.root
  if (!root?.children) return null
  // Dezelfde teller als extractHeadings, zodat de ids in de tekst en in de
  // inhoudsopgave bij dubbele koppen op elkaar blijven passen.
  const seen = new Map<string, number>()
  return <>{renderNodes(root.children, seen)}</>
}
