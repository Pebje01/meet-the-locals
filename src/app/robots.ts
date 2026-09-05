import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://meetthelocals.nl'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/'],
      },
      // AI-crawlers expliciet toestaan. De regel voor '*' hierboven staat alles
      // al toe, dus dit blokkeert niets extra's. Het staat er om ondubbelzinnig
      // te zijn: een bot met een eigen groep negeert de '*' groep volledig.
      //
      // Onderscheid dat ertoe doet:
      //   training      voedt het model, levert geen link op
      //   zoekindex     bepaalt of je geciteerd wordt mét bron. Dit is de winst.
      //   op verzoek    haalt de pagina op als een gebruiker ernaar vraagt

      // OpenAI
      { userAgent: 'GPTBot', allow: '/' }, // training
      { userAgent: 'OAI-SearchBot', allow: '/' }, // zoekindex ChatGPT
      { userAgent: 'ChatGPT-User', allow: '/' }, // op verzoek

      // Anthropic
      { userAgent: 'ClaudeBot', allow: '/' }, // training
      { userAgent: 'Claude-SearchBot', allow: '/' }, // zoekindex
      { userAgent: 'Claude-User', allow: '/' }, // op verzoek

      // Google
      { userAgent: 'Googlebot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' }, // Gemini

      // Overig
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Perplexity-User', allow: '/' },
      { userAgent: 'Applebot', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'meta-externalagent', allow: '/' },
      { userAgent: 'Amazonbot', allow: '/' },
      { userAgent: 'Bytespider', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
