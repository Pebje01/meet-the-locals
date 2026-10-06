import * as migration_20260521_114859 from './20260521_114859';
import * as migration_backfill_blog_taxonomy from './backfill-blog-taxonomy';
import * as migration_seed_photo_spots from './seed-photo-spots';
import * as migration_seed_stories from './seed-stories';
import * as migration_20261006_130000_scheduled_status from './20261006_130000_scheduled_status';

export const migrations = [
  {
    up: migration_20260521_114859.up,
    down: migration_20260521_114859.down,
    name: '20260521_114859',
  },
  {
    up: migration_backfill_blog_taxonomy.up,
    down: migration_backfill_blog_taxonomy.down,
    name: 'backfill-blog-taxonomy',
  },
  {
    up: migration_seed_photo_spots.up,
    down: migration_seed_photo_spots.down,
    name: 'seed-photo-spots',
  },
  {
    up: migration_seed_stories.up,
    down: migration_seed_stories.down,
    name: 'seed-stories',
  },
  {
    up: migration_20261006_130000_scheduled_status.up,
    down: migration_20261006_130000_scheduled_status.down,
    name: '20261006_130000_scheduled_status',
  },
];
