import type { CollectionConfig } from 'payload'

const REGION_OPTIONS = [
  { label: 'Europa', value: 'europe' },
  { label: 'Azië', value: 'asia' },
  { label: 'Noord-Amerika', value: 'north-america' },
  { label: 'Zuid-Amerika', value: 'south-america' },
  { label: 'Afrika', value: 'africa' },
  { label: 'Oceanië', value: 'oceania' },
  { label: 'Midden-Oosten', value: 'middle-east' },
]

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

type SpotData = {
  slug?: string | null
  title?: string | null
  photo?: string | number | { id: string | number } | null
  coordinates?: { latitude?: number | null; longitude?: number | null } | null
}

export const PhotoSpots: CollectionConfig = {
  slug: 'photo-spots',
  labels: { singular: 'Fotospot', plural: 'Fotospots' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'country', 'status'],
    description:
      'Plekken op de interactieve kaart. Elke spot is één eigen foto met locatie en camera-instellingen.',
  },
  hooks: {
    beforeValidate: [
      async ({ data, req }) => {
        const spot = data as SpotData
        if (!spot) return data

        if (!spot.slug && spot.title) spot.slug = slugify(spot.title)

        const hasCoords =
          spot.coordinates?.latitude != null && spot.coordinates?.longitude != null
        if (!hasCoords && spot.photo) {
          const photoId = typeof spot.photo === 'object' ? spot.photo?.id : spot.photo
          if (photoId != null) {
            try {
              const media = await req.payload.findByID({
                collection: 'media',
                id: photoId,
                depth: 0,
              })
              const exif = (media as { exif?: { latitude?: number; longitude?: number } })?.exif
              if (typeof exif?.latitude === 'number' && typeof exif?.longitude === 'number') {
                spot.coordinates = { latitude: exif.latitude, longitude: exif.longitude }
              }
            } catch {
              // Foto nog niet beschikbaar; locatie blijft handmatig in te vullen.
            }
          }
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titel',
      admin: { description: 'Naam van de plek, bijvoorbeeld "Zonsopkomst boven Bagan".' },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Wordt automatisch gevuld op basis van de titel.',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'published',
      options: [
        { label: 'Concept', value: 'draft' },
        { label: 'Gepubliceerd', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'region',
      type: 'select',
      options: REGION_OPTIONS,
      label: 'Werelddeel',
      admin: { position: 'sidebar' },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Foto',
      admin: {
        description:
          'Jouw eigen foto van deze plek. Camera-instellingen worden automatisch uit de foto gelezen.',
      },
    },
    {
      name: 'country',
      type: 'text',
      required: true,
      label: 'Land',
      admin: { description: 'Land waar de foto is gemaakt. Wordt ook op de kaart getoond.' },
    },
    {
      name: 'coordinates',
      type: 'group',
      label: 'Locatie',
      admin: {
        description:
          'Wordt automatisch ingevuld als je foto GPS-data bevat. Anders zelf de coördinaten invullen.',
      },
      fields: [
        { name: 'latitude', type: 'number', required: true, label: 'Breedtegraad' },
        { name: 'longitude', type: 'number', required: true, label: 'Lengtegraad' },
      ],
    },
    {
      name: 'story',
      type: 'textarea',
      label: 'Verhaal',
      admin: {
        description:
          'Korte ervaring bij deze plek. Verschijnt op de kaart wanneer je over de pin hovert.',
      },
    },
    {
      name: 'relatedPost',
      type: 'relationship',
      relationTo: 'posts',
      label: 'Gekoppelde blogpost',
      admin: { description: 'Optioneel. Voegt een "lees het verhaal"-link toe aan de kaartkaart.' },
    },
    {
      name: 'relatedDestination',
      type: 'relationship',
      relationTo: 'destinations',
      label: 'Gekoppelde bestemming',
    },
  ],
}
