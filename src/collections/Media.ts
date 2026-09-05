import path from 'path'
import { fileURLToPath } from 'url'
import type { CollectionConfig } from 'payload'
import { extractExif } from '../hooks/extractExif'
import { writeCredit } from '../hooks/writeCredit'

// Absoluut pad naar public/media, los van de werkmap waarvandaan Payload draait.
const mediaDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../public/media')

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'alt',
  },
  hooks: {
    // writeCredit moet vóór het resizen draaien, anders krijgen de
    // maatvarianten geen credit. Payload roept generateFileData aan tussen
    // beforeOperation en beforeChange in.
    beforeOperation: [writeCredit],
    beforeChange: [extractExif],
  },
  upload: {
    staticDir: mediaDir,
    // Zorgt dat sharp de XMP, IPTC en EXIF meeneemt naar elke maatvariant.
    // Standaard staat dit op false en strijkt sharp alle metadata weg, waardoor
    // je thumbnails en hero-beelden anoniem de deur uit gaan.
    // Let op: hiermee blijven ook de GPS-coördinaten in de gepubliceerde
    // beelden staan. Voor reisfoto's is dat gewenst, voor beelden dicht bij huis
    // iets om bewust van te zijn.
    withMetadata: true,
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'medium', width: 800, height: undefined, position: 'centre' },
      { name: 'large', width: 1200, height: undefined, position: 'centre' },
      { name: 'hero', width: 1920, height: undefined, position: 'centre' },
    ],
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'exif',
      type: 'group',
      label: 'Camera-instellingen (EXIF)',
      admin: {
        description:
          'Wordt automatisch uitgelezen bij het uploaden. Vul handmatig aan als een veld leeg blijft.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'camera', type: 'text', label: 'Camera' },
            { name: 'lens', type: 'text', label: 'Lens' },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'aperture', type: 'text', label: 'Diafragma' },
            { name: 'shutterSpeed', type: 'text', label: 'Sluitertijd' },
            { name: 'iso', type: 'text', label: 'ISO' },
            { name: 'focalLength', type: 'text', label: 'Brandpuntsafstand' },
          ],
        },
        { name: 'takenAt', type: 'date', label: 'Gemaakt op' },
        {
          type: 'row',
          fields: [
            {
              name: 'latitude',
              type: 'number',
              label: 'GPS breedtegraad',
              admin: { description: 'Uit de foto gelezen. Wordt gebruikt om de pin te plaatsen.' },
            },
            { name: 'longitude', type: 'number', label: 'GPS lengtegraad' },
          ],
        },
      ],
    },
  ],
}
