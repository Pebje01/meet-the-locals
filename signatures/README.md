# E-mailhandtekening voor Spark

`spark-signature.html` is een e-mailhandtekening in de Meet the Locals huisstijl (bosgroen, terracotta-accent, zandkleurige divider). Getest op tabel-gebaseerde layout die betrouwbaar rendert in Spark, Apple Mail, Gmail en Outlook.

## Voor gebruik: placeholders vervangen

Open `spark-signature.html` en pas aan:

1. **`{{LOGO_URL}}`** (2 keer niet nodig, staat 1 keer). Zet hier een **publiek bereikbare** absolute URL naar het logo. E-mailclients laden geen lokale of relatieve paden.
   - Productie-site: `https://meetthelocals.nl/media/logo.webp`
   - Of direct vanaf S3: `https://fsn1.your-objectstorage.com/meetthelocals-media/logo.webp`
2. **Telefoonnummer** (`+31 6 12 34 56 78` en de `tel:`-link)
3. **Functie** (nu: "Oprichter | Meet the Locals")
4. **Socials** (Instagram, Facebook, YouTube URL's)

## Installeren in Spark (desktop, Mac/Windows)

1. Open `spark-signature.html` in een browser (dubbelklik het bestand).
2. Selecteer de hele handtekening op de pagina (Cmd/Ctrl + A) en kopieer (Cmd/Ctrl + C).
3. In Spark: **Instellingen** (Settings) > **Handtekeningen** (Signatures).
4. Klik **+** om een nieuwe handtekening te maken, en **plak** (Cmd/Ctrl + V) in het bewerkvlak.
5. Koppel de handtekening aan het juiste account en zet hem als standaard.

> Tip: rendert de handtekening zonder opmaak, gebruik dan in stap 2 de knop "Rich text"/"opgemaakt plakken" van Spark, of plak in Apple Mail (die accepteert de HTML rechtstreeks) en synchroniseer.

## Installeren in Spark (iOS / Android)

De mobiele app ondersteunt alleen platte-tekst handtekeningen. Gebruik daar een tekstversie:

```
Daley Jansen
Oprichter | Meet the Locals
daleyjansen@gmail.com | +31 6 12 34 56 78
meetthelocals.nl
```

## Voorvertoning

Open het `.html`-bestand in een browser om te controleren hoe het eruitziet voordat je het in Spark plakt. Zolang `{{LOGO_URL}}` nog niet vervangen is, toont het logo als een gebroken afbeelding, dat is normaal.
