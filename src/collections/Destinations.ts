import type { CollectionConfig } from 'payload'

export const Destinations: CollectionConfig = {
  slug: 'destinations',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'region'],
  },
  fields: [
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
      admin: {
        position: 'sidebar',
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
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'highlights',
      type: 'richText',
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
    {
      name: 'coordinates',
      type: 'group',
      fields: [
        { name: 'latitude', type: 'number', required: true },
        { name: 'longitude', type: 'number', required: true },
      ],
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
