import type { CollectionConfig } from 'payload'

export const PhotoGalleries: CollectionConfig = {
  slug: 'photo-galleries',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'destination'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'photos',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
        {
          name: 'location',
          type: 'text',
        },
        {
          name: 'exif',
          type: 'group',
          fields: [
            { name: 'camera', type: 'text' },
            { name: 'lens', type: 'text' },
            { name: 'focalLength', type: 'text' },
            { name: 'aperture', type: 'text' },
            { name: 'shutterSpeed', type: 'text' },
            { name: 'iso', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'destination',
      type: 'relationship',
      relationTo: 'destinations',
    },
    {
      name: 'gear',
      type: 'group',
      fields: [
        { name: 'camera', type: 'text' },
        { name: 'lenses', type: 'textarea' },
      ],
    },
  ],
}
