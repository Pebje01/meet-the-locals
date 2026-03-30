import type { CollectionConfig } from 'payload'

export const PhotographyPosts: CollectionConfig = {
  slug: 'photography-posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'photoCategory', 'status', 'publishedDate'],
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
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
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
      name: 'photoCategory',
      type: 'select',
      required: true,
      options: [
        { label: 'Tips & Tutorials', value: 'tips-tutorials' },
        { label: 'Gear Reviews', value: 'gear-reviews' },
        { label: 'Behind the Lens', value: 'behind-the-lens' },
        { label: 'Editing & Post-processing', value: 'editing-post-processing' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
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
      name: 'exifData',
      type: 'group',
      fields: [
        { name: 'camera', type: 'text' },
        { name: 'lens', type: 'text' },
        { name: 'settings', type: 'text' },
      ],
    },
    {
      name: 'relatedPosts',
      type: 'relationship',
      relationTo: ['posts', 'photography-posts'],
      hasMany: true,
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
        { label: 'Scheduled', value: 'scheduled' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
