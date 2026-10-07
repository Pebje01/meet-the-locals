import type { Media } from '@/payload-types'

type MediaRef = number | Media | null | undefined

/** URL van een Payload-upload, of een lege string als de relatie niet is uitgeladen. */
export function imageUrl(media: MediaRef): string {
  if (!media || typeof media !== 'object') return ''
  return media.url ?? ''
}

/** Zelfde als imageUrl, maar met voorkeur voor een maatvariant als die bestaat. */
export function imageUrlSized(media: MediaRef, size: 'thumbnail' | 'medium' | 'large' | 'hero'): string {
  if (!media || typeof media !== 'object') return ''
  return media.sizes?.[size]?.url ?? media.url ?? ''
}

export function imageAlt(media: MediaRef, fallback = ''): string {
  if (!media || typeof media !== 'object') return fallback
  return media.alt || fallback
}
