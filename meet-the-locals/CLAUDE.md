# Meet the Locals

## Project
Persoonlijke reisblog + fotografie website. Migratie van WordPress naar Next.js 15 + Payload CMS 3.x.

## Tech Stack
- **Framework:** Next.js 15 (App Router, React Server Components)
- **CMS:** Payload CMS 3.x (als Next.js plugin)
- **Database:** PostgreSQL 16 (via Coolify)
- **Styling:** Tailwind CSS 4
- **Animaties:** Framer Motion
- **Kaarten:** Mapbox GL JS
- **AI:** Anthropic Claude API via Payload hooks
- **Hosting:** Hetzner CX23 + Coolify (Docker)

## Commands
- `pnpm dev` — Start development server
- `pnpm build` — Production build
- `pnpm lint` — Run linter

## Structure
- `src/app/(frontend)/` — Publieke pagina's (homepage, blog, bestemmingen, fotografie, kaart)
- `src/app/(payload)/` — Payload admin routes
- `src/collections/` — Payload collection configs
- `src/globals/` — Payload globals (SiteSettings, Navigation)
- `src/components/` — React componenten
- `src/lib/` — Utilities en API helpers
- `migrations/` — WordPress → Payload migratiescripts

## Conventions
- Taal in code: Engels (variabelen, componenten, comments)
- Taal content/UI: Nederlands
- URL-structuur: /blog, /bestemmingen, /fotografie, /kaart, /over, /contact
