import type { CollectionConfig } from 'payload'
import { WERELDDEEL_OPTIONS, THEMA_OPTIONS } from '../lib/taxonomy'

export const Stories: CollectionConfig = {
  slug: 'stories',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedDate'],
  },
  versions: {
    drafts: true,
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
      name: 'eyebrow',
      type: 'text',
      admin: {
        description: 'Kleine koptekst boven de titel, bijv. "De smaken van Georgië" of "Drie weken onderweg".',
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
      name: 'intro',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Korte lead-tekst. Zichtbaar op de kaart én bovenaan het verhaal zelf.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'werelddeel',
      type: 'select',
      options: WERELDDEEL_OPTIONS,
      admin: {
        position: 'sidebar',
        description: 'Werelddeel waar dit verhaal over gaat.',
      },
    },
    {
      name: 'thema',
      type: 'select',
      hasMany: true,
      options: THEMA_OPTIONS,
      admin: {
        position: 'sidebar',
        description: "Eén of meer thema's.",
      },
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
        {
          name: 'caption',
          type: 'text',
        },
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
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
