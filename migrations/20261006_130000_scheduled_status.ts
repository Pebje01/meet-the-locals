import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * De collecties Posts en PhotographyPosts kennen in hun schema de status
 * 'scheduled', maar het Postgres-enumtype uit de eerste migratie kent alleen
 * 'draft' en 'published'. Daardoor faalde opslaan met status Ingepland in de
 * admin, en faalde elke query die op 'scheduled' filtert.
 *
 * Een enumwaarde toevoegen is additief en veilig; verwijderen kan in Postgres
 * niet, vandaar dat down() niets doet.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`ALTER TYPE "public"."enum_posts_status" ADD VALUE IF NOT EXISTS 'scheduled';`)
  await db.execute(sql`ALTER TYPE "public"."enum_photography_posts_status" ADD VALUE IF NOT EXISTS 'scheduled';`)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Postgres kan geen enumwaarde verwijderen. Bestaande rijen blijven geldig.
}
