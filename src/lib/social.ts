import { PROFILES } from './credit'

/**
 * Sociale kanalen voor header, footer en contactpagina.
 *
 * De URL's komen uit credit.json, dezelfde bron als het schema op de pagina.
 * Daarmee staat een profiel nooit op drie plekken net iets anders, en wijst
 * een icoon nooit naar een lege placeholder zoals 'https://instagram.com'.
 * Alleen kanalen met een bekend profiel worden getoond.
 */
export type SocialNetwork = 'instagram' | 'linkedin' | 'behance' | 'tiktok' | 'youtube'

export type SocialLink = {
  network: SocialNetwork
  label: string
  url: string
  /** Handle zonder @, voor plekken waar de naam leesbaar naast het icoon staat. */
  handle: string
}

const MATCHERS: { network: SocialNetwork; label: string; host: RegExp }[] = [
  { network: 'instagram', label: 'Instagram', host: /instagram\.com/ },
  { network: 'linkedin', label: 'LinkedIn', host: /linkedin\.com/ },
  { network: 'behance', label: 'Behance', host: /behance\.net/ },
  { network: 'tiktok', label: 'TikTok', host: /tiktok\.com/ },
  { network: 'youtube', label: 'YouTube', host: /youtube\.com/ },
]

function handleFromUrl(url: string): string {
  const path = new URL(url).pathname.replace(/\/+$/, '')
  return path.split('/').filter(Boolean).pop() ?? ''
}

/** Volgorde van MATCHERS, zodat Instagram vooraan staat en Behance achteraan. */
export const SOCIAL_LINKS: readonly SocialLink[] = MATCHERS.flatMap((m) => {
  const url = PROFILES.find((profile) => m.host.test(profile))
  if (!url) return []
  return [{ network: m.network, label: m.label, url, handle: handleFromUrl(url) }]
})

export const INSTAGRAM = SOCIAL_LINKS.find((s) => s.network === 'instagram')
