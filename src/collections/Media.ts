import path from 'path'
import { fileURLToPath } from 'url'
import type { CollectionConfig } from 'payload'
import { extractExif } from '../hooks/extractExif'

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
    beforeChange: [extractExif],
  },
  upload: {
    staticDir: mediaDir,
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
