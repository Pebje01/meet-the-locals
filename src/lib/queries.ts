import type { Where } from 'payload'

/**
 * Zichtbaarheidsfilter voor blogposts.
 *
 * Posts kennen drie statussen: draft, published en scheduled. Tot nu toe
 * filterde elke query alleen op 'published', waardoor een ingeplande post
 * nooit vanzelf live kwam: je moest hem alsnog met de hand op 'published'
 * zetten. Nu telt 'scheduled' mee zodra de publicatiedatum is verstreken.
 *
 * De tweede tak noemt 'scheduled' bewust niet bij naam. Het Postgres-enumtype
 * kende die waarde tot migratie 20261006_130000 niet, en een query met een
 * onbekende enumwaarde laat Postgres hard falen. 'Niet draft en niet
 * published' komt op hetzelfde neer en werkt op elke databaseversie.
 *
 * Gebruik dit overal waar posts op de site komen (overzicht, detail,
 * gerelateerd, homepage, sitemap), zodat alle plekken hetzelfde beeld geven.
 */
export function publishedPostsWhere(now: Date = new Date()): Where {
  return {
    or: [
      { status: { equals: 'published' } },
      {
        and: [
          { status: { not_equals: 'draft' } },
          { status: { not_equals: 'published' } },
          { publishedDate: { less_than_equal: now.toISOString() } },
        ],
      },
    ],
  }
}
