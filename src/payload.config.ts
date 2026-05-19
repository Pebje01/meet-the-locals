import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

import { Posts } from './collections/Posts'
import { Stories } from './collections/Stories'
import { Destinations } from './collections/Destinations'
import { PhotoSpots } from './collections/PhotoSpots'
import { PhotographyPosts } from './collections/PhotographyPosts'
import { PhotoGalleries } from './collections/PhotoGalleries'
import { Categories } from './collections/Categories'
import { Tags } from './collections/Tags'
import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { SiteSettings } from './globals/SiteSettings'
import { Navigation } from './globals/Navigation'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  editor: lexicalEditor(),
  collections: [
    Posts,
    Stories,
    Destinations,
    PhotoSpots,
    PhotographyPosts,
    PhotoGalleries,
    Categories,
    Tags,
    Media,
    Users,
  ],
  globals: [SiteSettings, Navigation],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [],
})
