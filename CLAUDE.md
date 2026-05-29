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

## Fotosliders: EXIF op hover

In **alle fotosliders** op de site geldt: toon EXIF-metadata bij hover over een foto. Verplicht in elke slider-component die je aanmaakt of aanpast.

Wat tonen (als de data beschikbaar is in de Media-collectie of als prop):
- Camera (Make + Model)
- Lens
- Sluitertijd, diafragma (f/), ISO
- Brandpuntsafstand
- Locatie (GPS of tekstuele naam)

Implementatie: een absoluut gepositioneerde overlay (`opacity-0 group-hover:opacity-100 transition-opacity`) onderaan of rechtsboven de foto. Gebruik `text-[11px]` of kleiner, lichte achtergrond (`bg-black/50 backdrop-blur-sm`) of donkere glasmorfiek stijl passend bij de context. De overlay mag subtiel zijn maar moet leesbaar zijn op zowel lichte als donkere foto's.

## CSS utilities

### Schaduwen
Gebruik **nooit** standaard Tailwind `shadow-sm` / `shadow-md` (grauwe rgba(0,0,0,...) schaduwen). Gebruik altijd de huisstijl-schaduwklassen die zijn gedefinieerd in `globals.css`:

| Klasse | Wanneer gebruiken |
|---|---|
| `.natural-shadow` | Losse elementen zonder `overflow: hidden`. Gebruikt `::after` pseudo-element met `mix-blend-mode: multiply` en blur. |
| `.natural-shadow-box` | Kaartjes en elementen met `overflow: hidden`. Directe `box-shadow` in huisstijlkleur. |

De schaduwkleur is `rgba(15, 29, 15, ...)` (donker bosgroen), afgeleid van `--color-forest-dark`. Dit geeft een warme, natuurlijke schaduw die past bij elke achtergrondkleur op de site.

```css
/* Beiden gedefinieerd in globals.css, rond regel 278 */
.natural-shadow      { /* ::after blur ellips */ }
.natural-shadow-box  { /* directe box-shadow */ }
```

### Noise texture
Noise via grain texture (`/textures/grain.webp`) werkt het best met `mix-blend-mode: overlay` en `opacity: 0.6–0.85`. Gebruik **niet** de combinatie van `filter: grayscale/brightness` met `mix-blend-mode` op hetzelfde element: dat breekt de rendering.

De `.noise-overlay` CSS klasse gebruikt `::before` met `top: -80px` — dit wordt afgeknipt door `overflow: hidden` containers. Gebruik in dat geval een inline `<div>` met dezelfde stijl als directe child.

## Media importeren (foto's en video's toevoegen aan sliders/pagina's)

**Standaard workflow** wanneer Daley vraagt om foto's of video's toe te voegen aan de website, slider of bestemming:

1. **Zoek bestanden** in `~/Developer/` (root of submap die Daley noemt). Controleer ook `~/Downloads/` als ze er niet staan.
2. **Converteer naar WebP** (foto's) of **AVI/WebM** (video's):
   - Foto: `cwebp -resize 1920 0 -q 78 input.jpg -o public/media/naam.webp`
   - Te groot voor cwebp (> 30MP panorama): Python PIL resize eerst naar 1920px breed, dan cwebp
   - Genereer ook maatversies: 400x300 (thumbnail), 800px breed (medium), 1200px breed (large)
   - Naamgeving variants: `naam-400x300.webp`, `naam-800x532.webp`, `naam-1200x799.webp`
3. **Verplaats origineel** naar `public/media/` (JPG/PNG worden genegeerd door git via `.gitignore`)
4. **Upload naar S3**: alle webp-bestanden (origineel + variants) via AWS CLI of script naar `meetthelocals-media` bucket op `fsn1.your-objectstorage.com`
5. **EXIF extracten** uit het origineel (PIL of exiftool): camera, lens, diafragma, sluitertijd, ISO, brandpuntsafstand, datum
6. **Media-record aanmaken** in BEIDE databases (lokaal + productie via SSH/docker exec):
   - Gebruik volgende beschikbare ID (check `SELECT max(id) FROM media`)
   - Sla alle size-variant gegevens op (breedte, hoogte, bestandsgrootte, bestandsnaam)
   - Vul EXIF-velden in, voeg caption toe als locatienaam
   - Update de sequence: `SELECT setval(pg_get_serial_sequence('media', 'id'), <nieuw_max>)`
7. **Toevoegen aan gallery/slider**: `INSERT INTO destinations_gallery` of de relevante koppeltabel, met `_parent_id` van de bestemming en oplopende `_order`
8. **Verificeer live**: curl de productiepagina en check of de S3-URL's en het juiste aantal dots/items aanwezig zijn

**Productie DB** bereiken via:
```bash
ssh root@178.104.41.26 "docker cp script.cjs <container_id>:/app/script.cjs && docker exec -w /app <container_id> node script.cjs"
```
Container ID vinden: `ssh root@178.104.41.26 "docker ps"` — zoek op PAYLOAD_SECRET in env.

**Let op**: gebruik altijd `.cjs` extensie voor scripts in de container (package.json heeft `"type": "module"`).

## Payload schema wijzigen

Na elke wijziging aan een collection of global:
1. `pnpm generate:types` — hergenereert `payload-types.ts`
2. Maak een migratie aan via de Payload CLI als de database al data bevat
