# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Dev server op http://localhost:3000
pnpm build        # Production build
pnpm lint         # ESLint
pnpm payload      # Payload CLI (migraties, type-generatie)
pnpm generate:types       # Regenereer src/payload-types.ts na schema-wijziging
pnpm generate:importmap   # Regenereer Payload importmap
```

Database vereist: PostgreSQL op `localhost:5432/meetthelocals` (zie `.env`).

## Architectuur

Dit project combineert **Next.js 15 App Router** en **Payload CMS 3.x** in één proces. Payload draait als Next.js plugin — er is geen aparte CMS-server.

```
src/app/
  (frontend)/     — Publieke website (Server Components standaard)
  (payload)/      — Payload admin UI + REST/GraphQL API routes
src/collections/  — Payload data schemas (Posts, Destinations, PhotographyPosts, etc.)
src/globals/      — Payload singletons: SiteSettings, Navigation
src/components/   — React componenten (layout/, animaties, utilities)
src/payload.config.ts — Centrale Payload configuratie
src/payload-types.ts  — Gegenereerde TypeScript types (niet handmatig aanpassen)
migrations/       — WordPress naar Payload migratiescripts
```

### Data ophalen

Payload exposeert een lokale API via `import { getPayload } from 'payload'`. Gebruik dit in Server Components:

```ts
import config from '@payload-config'
import { getPayload } from 'payload'

const payload = await getPayload({ config })
const posts = await payload.find({ collection: 'posts', where: { status: { equals: 'published' } } })
```

Gebruik **nooit** de REST API (`/api/...`) vanuit server-side code. Die is voor externe clients.

### Collections en hun relaties

- **Posts** — reisblog artikelen. Hebben relaties naar `destinations`, `categories`, `tags`, en optioneel `mapPoints` (lat/lng array).
- **Destinations** — bestemmingspagina's met `region` enum, `coordinates` en `practicalInfo` groep.
- **PhotographyPosts** — foto-essays, los van reisblog.
- **PhotoGalleries** — galerijen gekoppeld aan bestemmingen of fotografie-posts.
- **Media** — centrale mediabibliotheek; alle uploads gaan hier door (Sharp voor resizing).
- `status` veld op Posts: `draft | published | scheduled`. Filter altijd op `published` in frontend queries.
- Alle collecties ondersteunen drafts via Payload versioning.

### Globals

- **SiteSettings** — sitewide instellingen (naam, social links, etc.)
- **Navigation** — header/footer navigatiestructuur

## Performance — bekende zware plekken

De site heeft scroll-lag door deze componenten. Pas ze voorzichtig aan:

- **`TextReveal`** (`src/components/TextReveal.tsx`) — maakt per woord een aparte `useTransform()`. Bij lange teksten zijn dat 50+ gelijktijdige Framer Motion transforms. Zwaarste component op de site.
- **`PageHero`** (`src/components/PageHero.tsx`) — combineert parallax (`useScroll` + `useTransform`) met een oneindige Ken Burns animatie (25s loop). Op elke subpagina actief.
- **Homepage** (`src/app/(frontend)/page.tsx`) — is volledig `use client` met 7 `whileInView` secties en meerdere losse `useScroll` hooks. Liefst opsplitsen in Server Component + client animatie-wrappers.
- **`TravelPath`** — globale SVG scroll-animatie, staat uitgecommentarieerd in de layout. Niet aanzetten zonder performance-test.
- **Noise/speckle overlays** in globals.css (`.noise-overlay`, `.speckle-overlay`) gebruiken inline SVG `fractalNoise` filters — vermijd op grote secties.
- **Lenis** (`SmoothScroll.tsx`): `touchMultiplier: 2` verdubbelt scroll-snelheid op touch. Verlagen naar `1` als animaties op mobiel achterliggen.

## Conventies

- Code en variabelen: **Engels**
- Content en UI-tekst: **Nederlands**
- Geen em-dashes (`—`) in UI-tekst of copy. Gebruik komma, dubbele punt of pipe.
- Fonts: `poleno` (display/headings, geladen via Typekit `pio7rwo.css`), `athletics` (sans-serif body, ook Typekit). Lokale webfonts staan in `public/fonts/`.
- CSS variabelen voor fonts: `--font-display`, `--font-serif`, `--font-sans` (definieerd in `globals.css` `@theme` blok).
- Tailwind 4: gebruik `@theme` in `globals.css` voor design tokens. Geen `tailwind.config.js`.
- Afbeeldingen altijd via Next.js `<Image>` met `sizes` prop. Hero-afbeeldingen krijgen `priority`.

## Payload schema wijzigen

Na elke wijziging aan een collection of global:
1. `pnpm generate:types` — hergenereert `payload-types.ts`
2. Maak een migratie aan via de Payload CLI als de database al data bevat
