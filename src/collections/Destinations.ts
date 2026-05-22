import type { CollectionConfig } from 'payload'

export const Destinations: CollectionConfig = {
  slug: 'destinations',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'parent', 'region'],
  },
  fields: [
    // --- Kern ---
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'level',
      type: 'select',
      defaultValue: 'land',
      options: [
        { label: 'Land', value: 'land' },
        { label: 'Regio', value: 'regio' },
        { label: 'Gebied', value: 'gebied' },
        { label: 'Stad / dorp', value: 'stad' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'destinations',
      admin: {
        position: 'sidebar',
        description: 'Bovenliggende bestemming, bijv. Italië voor Apulië.',
      },
    },
    {
      name: 'region',
      type: 'select',
      required: true,
      options: [
        { label: 'Europa', value: 'europe' },
        { label: 'Azië', value: 'asia' },
        { label: 'Noord-Amerika', value: 'north-america' },
        { label: 'Zuid-Amerika', value: 'south-america' },
        { label: 'Afrika', value: 'africa' },
        { label: 'Oceanië', value: 'oceania' },
        { label: 'Midden-Oosten', value: 'middle-east' },
      ],
      admin: { position: 'sidebar' },
    },

    // --- Afbeeldingen ---
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },

    // --- Tekst ---
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Kleine koptekst boven de titel, bijv. "Regio" of "Overview".',
      },
    },
    {
      name: 'title',
      type: 'text',
      admin: {
        description: 'Uitgebreide paginatitel voor de detailpagina.',
      },
    },
    {
      name: 'intro',
      type: 'textarea',
      admin: {
        description: 'Lead-tekst: zichtbaar in de hero van de detailpagina en op kaarten.',
      },
    },
    {
      name: 'mood',
      type: 'text',
      admin: {
        description: 'Sfeerwoorden, bijv. "Food, dorpen en routes".',
      },
    },
    {
      name: 'description',
      type: 'richText',
      admin: {
        description: 'Uitgebreide beschrijving (optioneel, voor redactionele pagina\'s).',
      },
    },

    // --- Highlights en gebieden ---
    {
      name: 'highlightList',
      type: 'array',
      admin: { description: 'Genummerde highlights op de detailpagina.' },
      fields: [
        { name: 'text', type: 'text', required: true },
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Optionele foto onderaan het highlight-kaartje.' },
        },
      ],
    },
    {
      name: 'places',
      type: 'array',
      admin: { description: 'Gebieden of plekken als pills op de detailpagina.' },
      fields: [{ name: 'name', type: 'text', required: true }],
    },

    // --- Praktische info ---
    {
      name: 'population',
      type: 'text',
      admin: { position: 'sidebar' },
    },
    {
      name: 'flightHours',
      type: 'text',
      admin: { position: 'sidebar', description: 'Reistijd, bijv. "±2,5 uur".' },
    },
    {
      name: 'countryCode',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'ISO 3166-1 alpha-2 code, bijv. JP, FR, PE. Gebruikt voor automatische data-updates via n8n.',
      },
    },
    {
      name: 'practicalInfo',
      type: 'group',
      fields: [
        { name: 'budget', type: 'textarea' },
        { name: 'visa', type: 'textarea' },
        { name: 'bestTime', type: 'textarea' },
      ],
    },

    // --- Reisinfo-strip (wordt bijgewerkt via n8n automatisering) ---
    {
      name: 'travelInfo',
      type: 'group',
      admin: {
        description: 'Getoond als scrollende balk onder de fotoslider. Kan automatisch bijgewerkt worden via n8n.',
      },
      fields: [
        {
          name: 'language',
          type: 'text',
          admin: { description: 'bijv. Japans, Engels' },
        },
        {
          name: 'currency',
          type: 'text',
          admin: { description: 'bijv. Japanse Yen (JPY)' },
        },
        {
          name: 'climate',
          type: 'text',
          admin: { description: 'bijv. Subtropisch, warm en vochtig' },
        },
        {
          name: 'timezone',
          type: 'text',
          admin: { description: 'bijv. UTC+9' },
        },
        {
          name: 'plugType',
          type: 'text',
          admin: { description: 'bijv. Type A/B, 110V' },
        },
        {
          name: 'safetyLevel',
          type: 'select',
          options: [
            { label: 'Groen — veilig reizen', value: 'green' },
            { label: 'Geel — let op', value: 'yellow' },
            { label: 'Oranje — wees waakzaam', value: 'orange' },
            { label: 'Rood — niet reizen', value: 'red' },
          ],
          admin: { description: 'Reisadvies kleurcode (rijksoverheid.nl).' },
        },
        {
          name: 'safetyNote',
          type: 'text',
          admin: { description: 'bijv. Normale waakzaamheid, geen specifieke risicos' },
        },
        {
          name: 'visaNote',
          type: 'text',
          admin: { description: 'bijv. Visumvrij tot 90 dagen voor NL-paspoort' },
        },
      ],
    },

    // --- Kaartdata ---
    {
      name: 'mapLabel',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Tekst op de kaart in hoofdletters, bijv. "ITALIË".',
      },
    },
    {
      name: 'mapScale',
      type: 'number',
      defaultValue: 1500,
      admin: { position: 'sidebar', description: 'Zoomniveau van de kaart (bijv. 1400).' },
    },
    {
      name: 'mapCenter',
      type: 'group',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'longitude', type: 'number' },
        { name: 'latitude', type: 'number' },
      ],
    },
    {
      name: 'coordinates',
      type: 'group',
      admin: { position: 'sidebar', description: 'Markerpositie op de kaart.' },
      fields: [
        { name: 'latitude', type: 'number', required: true },
        { name: 'longitude', type: 'number', required: true },
      ],
    },
    {
      name: 'countryIds',
      type: 'array',
      admin: {
        position: 'sidebar',
        description: 'ISO-3166 numerieke landcodes voor de kaart, bijv. "380" voor Italië.',
      },
      fields: [{ name: 'countryCode', type: 'text', required: true }],
    },

    // --- SEO ---
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
