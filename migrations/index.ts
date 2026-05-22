import * as migration_20260521_114859 from './20260521_114859';
import * as migration_backfill-blog-taxonomy from './backfill-blog-taxonomy';
import * as migration_seed-photo-spots from './seed-photo-spots';
import * as migration_seed-stories from './seed-stories';
import * as migration_wp-migrate from './wp-migrate';

export const migrations = [
  {
    up: migration_20260521_114859.up,
    down: migration_20260521_114859.down,
    name: '20260521_114859',
  },
  {
    up: migration_backfill-blog-taxonomy.up,
    down: migration_backfill-blog-taxonomy.down,
    name: 'backfill-blog-taxonomy',
  },
  {
    up: migration_seed-photo-spots.up,
    down: migration_seed-photo-spots.down,
    name: 'seed-photo-spots',
  },
  {
    up: migration_seed-stories.up,
    down: migration_seed-stories.down,
    name: 'seed-stories',
  },
  {
    up: migration_wp-migrate.up,
    down: migration_wp-migrate.down,
    name: 'wp-migrate'
  },
];
