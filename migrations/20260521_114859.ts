import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_posts_thema" AS ENUM('reisfotografie', 'food', 'accommodaties', 'reisverhalen-routes', 'reistips-praktisch', 'natuur-buiten');
  CREATE TYPE "public"."enum_posts_werelddeel" AS ENUM('europe', 'asia', 'north-america', 'south-america', 'africa', 'oceania', 'middle-east');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_thema" AS ENUM('reisfotografie', 'food', 'accommodaties', 'reisverhalen-routes', 'reistips-praktisch', 'natuur-buiten');
  CREATE TYPE "public"."enum__posts_v_version_werelddeel" AS ENUM('europe', 'asia', 'north-america', 'south-america', 'africa', 'oceania', 'middle-east');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_stories_thema" AS ENUM('reisfotografie', 'food', 'accommodaties', 'reisverhalen-routes', 'reistips-praktisch', 'natuur-buiten');
  CREATE TYPE "public"."enum_stories_werelddeel" AS ENUM('europe', 'asia', 'north-america', 'south-america', 'africa', 'oceania', 'middle-east');
  CREATE TYPE "public"."enum_stories_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__stories_v_version_thema" AS ENUM('reisfotografie', 'food', 'accommodaties', 'reisverhalen-routes', 'reistips-praktisch', 'natuur-buiten');
  CREATE TYPE "public"."enum__stories_v_version_werelddeel" AS ENUM('europe', 'asia', 'north-america', 'south-america', 'africa', 'oceania', 'middle-east');
  CREATE TYPE "public"."enum__stories_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_destinations_type" AS ENUM('land', 'regio', 'gebied', 'stad');
  CREATE TYPE "public"."enum_destinations_region" AS ENUM('europe', 'asia', 'north-america', 'south-america', 'africa', 'oceania', 'middle-east');
  CREATE TYPE "public"."enum_photo_spots_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_photo_spots_region" AS ENUM('europe', 'asia', 'north-america', 'south-america', 'africa', 'oceania', 'middle-east');
  CREATE TYPE "public"."enum_photography_posts_photo_category" AS ENUM('tips-tutorials', 'gear-reviews', 'behind-the-lens', 'editing-post-processing');
  CREATE TYPE "public"."enum_photography_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__photography_posts_v_version_photo_category" AS ENUM('tips-tutorials', 'gear-reviews', 'behind-the-lens', 'editing-post-processing');
  CREATE TYPE "public"."enum__photography_posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "posts_thema" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_posts_thema",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "posts_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "posts_map_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"latitude" numeric,
  	"longitude" numeric
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"hero_image_id" integer,
  	"content" jsonb,
  	"excerpt" varchar,
  	"published_date" timestamp(3) with time zone,
  	"werelddeel" "enum_posts_werelddeel",
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"status" "enum_posts_status" DEFAULT 'draft',
  	"ai_draft" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"destinations_id" integer,
  	"categories_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "_posts_v_version_thema" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__posts_v_version_thema",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_posts_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v_version_map_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"latitude" numeric,
  	"longitude" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_hero_image_id" integer,
  	"version_content" jsonb,
  	"version_excerpt" varchar,
  	"version_published_date" timestamp(3) with time zone,
  	"version_werelddeel" "enum__posts_v_version_werelddeel",
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"version_ai_draft" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"destinations_id" integer,
  	"categories_id" integer,
  	"tags_id" integer
  );
  
  CREATE TABLE "stories_thema" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_stories_thema",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "stories_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "stories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"eyebrow" varchar,
  	"hero_image_id" integer,
  	"intro" varchar,
  	"content" jsonb,
  	"published_date" timestamp(3) with time zone,
  	"werelddeel" "enum_stories_werelddeel",
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"status" "enum_stories_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_stories_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_stories_v_version_thema" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__stories_v_version_thema",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_stories_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_stories_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_eyebrow" varchar,
  	"version_hero_image_id" integer,
  	"version_intro" varchar,
  	"version_content" jsonb,
  	"version_published_date" timestamp(3) with time zone,
  	"version_werelddeel" "enum__stories_v_version_werelddeel",
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_status" "enum__stories_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__stories_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "destinations_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "destinations_highlight_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "destinations_places" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "destinations_country_ids" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "destinations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"type" "enum_destinations_type" DEFAULT 'land',
  	"parent_id" integer,
  	"region" "enum_destinations_region" NOT NULL,
  	"hero_image_id" integer NOT NULL,
  	"eyebrow" varchar,
  	"title" varchar,
  	"intro" varchar,
  	"mood" varchar,
  	"description" jsonb,
  	"population" varchar,
  	"flight_hours" varchar,
  	"practical_info_budget" varchar,
  	"practical_info_visa" varchar,
  	"practical_info_best_time" varchar,
  	"map_label" varchar,
  	"map_scale" numeric DEFAULT 1500,
  	"map_center_longitude" numeric,
  	"map_center_latitude" numeric,
  	"coordinates_latitude" numeric NOT NULL,
  	"coordinates_longitude" numeric NOT NULL,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "photo_spots" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"status" "enum_photo_spots_status" DEFAULT 'published',
  	"region" "enum_photo_spots_region",
  	"photo_id" integer NOT NULL,
  	"country" varchar NOT NULL,
  	"coordinates_latitude" numeric NOT NULL,
  	"coordinates_longitude" numeric NOT NULL,
  	"story" varchar,
  	"related_post_id" integer,
  	"related_destination_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "photography_posts_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "photography_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"hero_image_id" integer,
  	"content" jsonb,
  	"excerpt" varchar,
  	"published_date" timestamp(3) with time zone,
  	"photo_category" "enum_photography_posts_photo_category",
  	"exif_data_camera" varchar,
  	"exif_data_lens" varchar,
  	"exif_data_settings" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"status" "enum_photography_posts_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_photography_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "photography_posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer,
  	"posts_id" integer,
  	"photography_posts_id" integer
  );
  
  CREATE TABLE "_photography_posts_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_photography_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_hero_image_id" integer,
  	"version_content" jsonb,
  	"version_excerpt" varchar,
  	"version_published_date" timestamp(3) with time zone,
  	"version_photo_category" "enum__photography_posts_v_version_photo_category",
  	"version_exif_data_camera" varchar,
  	"version_exif_data_lens" varchar,
  	"version_exif_data_settings" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_status" "enum__photography_posts_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__photography_posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_photography_posts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer,
  	"posts_id" integer,
  	"photography_posts_id" integer
  );
  
  CREATE TABLE "photo_galleries_photos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar,
  	"location" varchar,
  	"exif_camera" varchar,
  	"exif_lens" varchar,
  	"exif_focal_length" varchar,
  	"exif_aperture" varchar,
  	"exif_shutter_speed" varchar,
  	"exif_iso" varchar
  );
  
  CREATE TABLE "photo_galleries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" jsonb,
  	"cover_image_id" integer NOT NULL,
  	"destination_id" integer,
  	"gear_camera" varchar,
  	"gear_lenses" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"exif_camera" varchar,
  	"exif_lens" varchar,
  	"exif_aperture" varchar,
  	"exif_shutter_speed" varchar,
  	"exif_iso" varchar,
  	"exif_focal_length" varchar,
  	"exif_taken_at" timestamp(3) with time zone,
  	"exif_latitude" numeric,
  	"exif_longitude" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_medium_url" varchar,
  	"sizes_medium_width" numeric,
  	"sizes_medium_height" numeric,
  	"sizes_medium_mime_type" varchar,
  	"sizes_medium_filesize" numeric,
  	"sizes_medium_filename" varchar,
  	"sizes_large_url" varchar,
  	"sizes_large_width" numeric,
  	"sizes_large_height" numeric,
  	"sizes_large_mime_type" varchar,
  	"sizes_large_filesize" numeric,
  	"sizes_large_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"posts_id" integer,
  	"stories_id" integer,
  	"destinations_id" integer,
  	"photo_spots_id" integer,
  	"photography_posts_id" integer,
  	"photo_galleries_id" integer,
  	"categories_id" integer,
  	"tags_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'Meet the Locals' NOT NULL,
  	"logo_id" integer,
  	"social_links_instagram" varchar,
  	"social_links_youtube" varchar,
  	"social_links_tiktok" varchar,
  	"social_links_pinterest" varchar,
  	"footer_text" varchar,
  	"default_seo_meta_title" varchar,
  	"default_seo_meta_description" varchar,
  	"default_seo_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "navigation_items_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "posts_thema" ADD CONSTRAINT "posts_thema_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_gallery" ADD CONSTRAINT "posts_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_gallery" ADD CONSTRAINT "posts_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_map_points" ADD CONSTRAINT "posts_map_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_destinations_fk" FOREIGN KEY ("destinations_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_thema" ADD CONSTRAINT "_posts_v_version_thema_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_gallery" ADD CONSTRAINT "_posts_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_version_gallery" ADD CONSTRAINT "_posts_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_version_map_points" ADD CONSTRAINT "_posts_v_version_map_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_destinations_fk" FOREIGN KEY ("destinations_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_thema" ADD CONSTRAINT "stories_thema_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories_gallery" ADD CONSTRAINT "stories_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories_gallery" ADD CONSTRAINT "stories_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "stories" ADD CONSTRAINT "stories_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "stories" ADD CONSTRAINT "stories_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v_version_thema" ADD CONSTRAINT "_stories_v_version_thema_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v_version_gallery" ADD CONSTRAINT "_stories_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v_version_gallery" ADD CONSTRAINT "_stories_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_stories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_stories_v" ADD CONSTRAINT "_stories_v_parent_id_stories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."stories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v" ADD CONSTRAINT "_stories_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_stories_v" ADD CONSTRAINT "_stories_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "destinations_gallery" ADD CONSTRAINT "destinations_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "destinations_gallery" ADD CONSTRAINT "destinations_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destinations_highlight_list" ADD CONSTRAINT "destinations_highlight_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destinations_places" ADD CONSTRAINT "destinations_places_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destinations_country_ids" ADD CONSTRAINT "destinations_country_ids_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destinations" ADD CONSTRAINT "destinations_parent_id_destinations_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."destinations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "destinations" ADD CONSTRAINT "destinations_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "destinations" ADD CONSTRAINT "destinations_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "photo_spots" ADD CONSTRAINT "photo_spots_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "photo_spots" ADD CONSTRAINT "photo_spots_related_post_id_posts_id_fk" FOREIGN KEY ("related_post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "photo_spots" ADD CONSTRAINT "photo_spots_related_destination_id_destinations_id_fk" FOREIGN KEY ("related_destination_id") REFERENCES "public"."destinations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "photography_posts_gallery" ADD CONSTRAINT "photography_posts_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "photography_posts_gallery" ADD CONSTRAINT "photography_posts_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."photography_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "photography_posts" ADD CONSTRAINT "photography_posts_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "photography_posts" ADD CONSTRAINT "photography_posts_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "photography_posts_rels" ADD CONSTRAINT "photography_posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."photography_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "photography_posts_rels" ADD CONSTRAINT "photography_posts_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "photography_posts_rels" ADD CONSTRAINT "photography_posts_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "photography_posts_rels" ADD CONSTRAINT "photography_posts_rels_photography_posts_fk" FOREIGN KEY ("photography_posts_id") REFERENCES "public"."photography_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_photography_posts_v_version_gallery" ADD CONSTRAINT "_photography_posts_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_photography_posts_v_version_gallery" ADD CONSTRAINT "_photography_posts_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_photography_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_photography_posts_v" ADD CONSTRAINT "_photography_posts_v_parent_id_photography_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."photography_posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_photography_posts_v" ADD CONSTRAINT "_photography_posts_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_photography_posts_v" ADD CONSTRAINT "_photography_posts_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_photography_posts_v_rels" ADD CONSTRAINT "_photography_posts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_photography_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_photography_posts_v_rels" ADD CONSTRAINT "_photography_posts_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_photography_posts_v_rels" ADD CONSTRAINT "_photography_posts_v_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_photography_posts_v_rels" ADD CONSTRAINT "_photography_posts_v_rels_photography_posts_fk" FOREIGN KEY ("photography_posts_id") REFERENCES "public"."photography_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "photo_galleries_photos" ADD CONSTRAINT "photo_galleries_photos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "photo_galleries_photos" ADD CONSTRAINT "photo_galleries_photos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."photo_galleries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "photo_galleries" ADD CONSTRAINT "photo_galleries_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "photo_galleries" ADD CONSTRAINT "photo_galleries_destination_id_destinations_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_stories_fk" FOREIGN KEY ("stories_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_destinations_fk" FOREIGN KEY ("destinations_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_photo_spots_fk" FOREIGN KEY ("photo_spots_id") REFERENCES "public"."photo_spots"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_photography_posts_fk" FOREIGN KEY ("photography_posts_id") REFERENCES "public"."photography_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_photo_galleries_fk" FOREIGN KEY ("photo_galleries_id") REFERENCES "public"."photo_galleries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_default_seo_og_image_id_media_id_fk" FOREIGN KEY ("default_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_items_children" ADD CONSTRAINT "navigation_items_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_items" ADD CONSTRAINT "navigation_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_thema_order_idx" ON "posts_thema" USING btree ("order");
  CREATE INDEX "posts_thema_parent_idx" ON "posts_thema" USING btree ("parent_id");
  CREATE INDEX "posts_gallery_order_idx" ON "posts_gallery" USING btree ("_order");
  CREATE INDEX "posts_gallery_parent_id_idx" ON "posts_gallery" USING btree ("_parent_id");
  CREATE INDEX "posts_gallery_image_idx" ON "posts_gallery" USING btree ("image_id");
  CREATE INDEX "posts_map_points_order_idx" ON "posts_map_points" USING btree ("_order");
  CREATE INDEX "posts_map_points_parent_id_idx" ON "posts_map_points" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_hero_image_idx" ON "posts" USING btree ("hero_image_id");
  CREATE INDEX "posts_seo_seo_og_image_idx" ON "posts" USING btree ("seo_og_image_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_destinations_id_idx" ON "posts_rels" USING btree ("destinations_id");
  CREATE INDEX "posts_rels_categories_id_idx" ON "posts_rels" USING btree ("categories_id");
  CREATE INDEX "posts_rels_tags_id_idx" ON "posts_rels" USING btree ("tags_id");
  CREATE INDEX "_posts_v_version_thema_order_idx" ON "_posts_v_version_thema" USING btree ("order");
  CREATE INDEX "_posts_v_version_thema_parent_idx" ON "_posts_v_version_thema" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_gallery_order_idx" ON "_posts_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_posts_v_version_gallery_parent_id_idx" ON "_posts_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_version_gallery_image_idx" ON "_posts_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_posts_v_version_map_points_order_idx" ON "_posts_v_version_map_points" USING btree ("_order");
  CREATE INDEX "_posts_v_version_map_points_parent_id_idx" ON "_posts_v_version_map_points" USING btree ("_parent_id");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_hero_image_idx" ON "_posts_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_posts_v_version_seo_version_seo_og_image_idx" ON "_posts_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "_posts_v_rels_order_idx" ON "_posts_v_rels" USING btree ("order");
  CREATE INDEX "_posts_v_rels_parent_idx" ON "_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_posts_v_rels_path_idx" ON "_posts_v_rels" USING btree ("path");
  CREATE INDEX "_posts_v_rels_destinations_id_idx" ON "_posts_v_rels" USING btree ("destinations_id");
  CREATE INDEX "_posts_v_rels_categories_id_idx" ON "_posts_v_rels" USING btree ("categories_id");
  CREATE INDEX "_posts_v_rels_tags_id_idx" ON "_posts_v_rels" USING btree ("tags_id");
  CREATE INDEX "stories_thema_order_idx" ON "stories_thema" USING btree ("order");
  CREATE INDEX "stories_thema_parent_idx" ON "stories_thema" USING btree ("parent_id");
  CREATE INDEX "stories_gallery_order_idx" ON "stories_gallery" USING btree ("_order");
  CREATE INDEX "stories_gallery_parent_id_idx" ON "stories_gallery" USING btree ("_parent_id");
  CREATE INDEX "stories_gallery_image_idx" ON "stories_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "stories_slug_idx" ON "stories" USING btree ("slug");
  CREATE INDEX "stories_hero_image_idx" ON "stories" USING btree ("hero_image_id");
  CREATE INDEX "stories_seo_seo_og_image_idx" ON "stories" USING btree ("seo_og_image_id");
  CREATE INDEX "stories_updated_at_idx" ON "stories" USING btree ("updated_at");
  CREATE INDEX "stories_created_at_idx" ON "stories" USING btree ("created_at");
  CREATE INDEX "stories__status_idx" ON "stories" USING btree ("_status");
  CREATE INDEX "_stories_v_version_thema_order_idx" ON "_stories_v_version_thema" USING btree ("order");
  CREATE INDEX "_stories_v_version_thema_parent_idx" ON "_stories_v_version_thema" USING btree ("parent_id");
  CREATE INDEX "_stories_v_version_gallery_order_idx" ON "_stories_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_stories_v_version_gallery_parent_id_idx" ON "_stories_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_stories_v_version_gallery_image_idx" ON "_stories_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_stories_v_parent_idx" ON "_stories_v" USING btree ("parent_id");
  CREATE INDEX "_stories_v_version_version_slug_idx" ON "_stories_v" USING btree ("version_slug");
  CREATE INDEX "_stories_v_version_version_hero_image_idx" ON "_stories_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_stories_v_version_seo_version_seo_og_image_idx" ON "_stories_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_stories_v_version_version_updated_at_idx" ON "_stories_v" USING btree ("version_updated_at");
  CREATE INDEX "_stories_v_version_version_created_at_idx" ON "_stories_v" USING btree ("version_created_at");
  CREATE INDEX "_stories_v_version_version__status_idx" ON "_stories_v" USING btree ("version__status");
  CREATE INDEX "_stories_v_created_at_idx" ON "_stories_v" USING btree ("created_at");
  CREATE INDEX "_stories_v_updated_at_idx" ON "_stories_v" USING btree ("updated_at");
  CREATE INDEX "_stories_v_latest_idx" ON "_stories_v" USING btree ("latest");
  CREATE INDEX "destinations_gallery_order_idx" ON "destinations_gallery" USING btree ("_order");
  CREATE INDEX "destinations_gallery_parent_id_idx" ON "destinations_gallery" USING btree ("_parent_id");
  CREATE INDEX "destinations_gallery_image_idx" ON "destinations_gallery" USING btree ("image_id");
  CREATE INDEX "destinations_highlight_list_order_idx" ON "destinations_highlight_list" USING btree ("_order");
  CREATE INDEX "destinations_highlight_list_parent_id_idx" ON "destinations_highlight_list" USING btree ("_parent_id");
  CREATE INDEX "destinations_places_order_idx" ON "destinations_places" USING btree ("_order");
  CREATE INDEX "destinations_places_parent_id_idx" ON "destinations_places" USING btree ("_parent_id");
  CREATE INDEX "destinations_country_ids_order_idx" ON "destinations_country_ids" USING btree ("_order");
  CREATE INDEX "destinations_country_ids_parent_id_idx" ON "destinations_country_ids" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "destinations_slug_idx" ON "destinations" USING btree ("slug");
  CREATE INDEX "destinations_parent_idx" ON "destinations" USING btree ("parent_id");
  CREATE INDEX "destinations_hero_image_idx" ON "destinations" USING btree ("hero_image_id");
  CREATE INDEX "destinations_seo_seo_og_image_idx" ON "destinations" USING btree ("seo_og_image_id");
  CREATE INDEX "destinations_updated_at_idx" ON "destinations" USING btree ("updated_at");
  CREATE INDEX "destinations_created_at_idx" ON "destinations" USING btree ("created_at");
  CREATE UNIQUE INDEX "photo_spots_slug_idx" ON "photo_spots" USING btree ("slug");
  CREATE INDEX "photo_spots_photo_idx" ON "photo_spots" USING btree ("photo_id");
  CREATE INDEX "photo_spots_related_post_idx" ON "photo_spots" USING btree ("related_post_id");
  CREATE INDEX "photo_spots_related_destination_idx" ON "photo_spots" USING btree ("related_destination_id");
  CREATE INDEX "photo_spots_updated_at_idx" ON "photo_spots" USING btree ("updated_at");
  CREATE INDEX "photo_spots_created_at_idx" ON "photo_spots" USING btree ("created_at");
  CREATE INDEX "photography_posts_gallery_order_idx" ON "photography_posts_gallery" USING btree ("_order");
  CREATE INDEX "photography_posts_gallery_parent_id_idx" ON "photography_posts_gallery" USING btree ("_parent_id");
  CREATE INDEX "photography_posts_gallery_image_idx" ON "photography_posts_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "photography_posts_slug_idx" ON "photography_posts" USING btree ("slug");
  CREATE INDEX "photography_posts_hero_image_idx" ON "photography_posts" USING btree ("hero_image_id");
  CREATE INDEX "photography_posts_seo_seo_og_image_idx" ON "photography_posts" USING btree ("seo_og_image_id");
  CREATE INDEX "photography_posts_updated_at_idx" ON "photography_posts" USING btree ("updated_at");
  CREATE INDEX "photography_posts_created_at_idx" ON "photography_posts" USING btree ("created_at");
  CREATE INDEX "photography_posts__status_idx" ON "photography_posts" USING btree ("_status");
  CREATE INDEX "photography_posts_rels_order_idx" ON "photography_posts_rels" USING btree ("order");
  CREATE INDEX "photography_posts_rels_parent_idx" ON "photography_posts_rels" USING btree ("parent_id");
  CREATE INDEX "photography_posts_rels_path_idx" ON "photography_posts_rels" USING btree ("path");
  CREATE INDEX "photography_posts_rels_tags_id_idx" ON "photography_posts_rels" USING btree ("tags_id");
  CREATE INDEX "photography_posts_rels_posts_id_idx" ON "photography_posts_rels" USING btree ("posts_id");
  CREATE INDEX "photography_posts_rels_photography_posts_id_idx" ON "photography_posts_rels" USING btree ("photography_posts_id");
  CREATE INDEX "_photography_posts_v_version_gallery_order_idx" ON "_photography_posts_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_photography_posts_v_version_gallery_parent_id_idx" ON "_photography_posts_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_photography_posts_v_version_gallery_image_idx" ON "_photography_posts_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_photography_posts_v_parent_idx" ON "_photography_posts_v" USING btree ("parent_id");
  CREATE INDEX "_photography_posts_v_version_version_slug_idx" ON "_photography_posts_v" USING btree ("version_slug");
  CREATE INDEX "_photography_posts_v_version_version_hero_image_idx" ON "_photography_posts_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_photography_posts_v_version_seo_version_seo_og_image_idx" ON "_photography_posts_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_photography_posts_v_version_version_updated_at_idx" ON "_photography_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_photography_posts_v_version_version_created_at_idx" ON "_photography_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_photography_posts_v_version_version__status_idx" ON "_photography_posts_v" USING btree ("version__status");
  CREATE INDEX "_photography_posts_v_created_at_idx" ON "_photography_posts_v" USING btree ("created_at");
  CREATE INDEX "_photography_posts_v_updated_at_idx" ON "_photography_posts_v" USING btree ("updated_at");
  CREATE INDEX "_photography_posts_v_latest_idx" ON "_photography_posts_v" USING btree ("latest");
  CREATE INDEX "_photography_posts_v_rels_order_idx" ON "_photography_posts_v_rels" USING btree ("order");
  CREATE INDEX "_photography_posts_v_rels_parent_idx" ON "_photography_posts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_photography_posts_v_rels_path_idx" ON "_photography_posts_v_rels" USING btree ("path");
  CREATE INDEX "_photography_posts_v_rels_tags_id_idx" ON "_photography_posts_v_rels" USING btree ("tags_id");
  CREATE INDEX "_photography_posts_v_rels_posts_id_idx" ON "_photography_posts_v_rels" USING btree ("posts_id");
  CREATE INDEX "_photography_posts_v_rels_photography_posts_id_idx" ON "_photography_posts_v_rels" USING btree ("photography_posts_id");
  CREATE INDEX "photo_galleries_photos_order_idx" ON "photo_galleries_photos" USING btree ("_order");
  CREATE INDEX "photo_galleries_photos_parent_id_idx" ON "photo_galleries_photos" USING btree ("_parent_id");
  CREATE INDEX "photo_galleries_photos_image_idx" ON "photo_galleries_photos" USING btree ("image_id");
  CREATE UNIQUE INDEX "photo_galleries_slug_idx" ON "photo_galleries" USING btree ("slug");
  CREATE INDEX "photo_galleries_cover_image_idx" ON "photo_galleries" USING btree ("cover_image_id");
  CREATE INDEX "photo_galleries_destination_idx" ON "photo_galleries" USING btree ("destination_id");
  CREATE INDEX "photo_galleries_updated_at_idx" ON "photo_galleries" USING btree ("updated_at");
  CREATE INDEX "photo_galleries_created_at_idx" ON "photo_galleries" USING btree ("created_at");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "tags_slug_idx" ON "tags" USING btree ("slug");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_medium_sizes_medium_filename_idx" ON "media" USING btree ("sizes_medium_filename");
  CREATE INDEX "media_sizes_large_sizes_large_filename_idx" ON "media" USING btree ("sizes_large_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_stories_id_idx" ON "payload_locked_documents_rels" USING btree ("stories_id");
  CREATE INDEX "payload_locked_documents_rels_destinations_id_idx" ON "payload_locked_documents_rels" USING btree ("destinations_id");
  CREATE INDEX "payload_locked_documents_rels_photo_spots_id_idx" ON "payload_locked_documents_rels" USING btree ("photo_spots_id");
  CREATE INDEX "payload_locked_documents_rels_photography_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("photography_posts_id");
  CREATE INDEX "payload_locked_documents_rels_photo_galleries_id_idx" ON "payload_locked_documents_rels" USING btree ("photo_galleries_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_default_seo_default_seo_og_image_idx" ON "site_settings" USING btree ("default_seo_og_image_id");
  CREATE INDEX "navigation_items_children_order_idx" ON "navigation_items_children" USING btree ("_order");
  CREATE INDEX "navigation_items_children_parent_id_idx" ON "navigation_items_children" USING btree ("_parent_id");
  CREATE INDEX "navigation_items_order_idx" ON "navigation_items" USING btree ("_order");
  CREATE INDEX "navigation_items_parent_id_idx" ON "navigation_items" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "posts_thema" CASCADE;
  DROP TABLE "posts_gallery" CASCADE;
  DROP TABLE "posts_map_points" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "_posts_v_version_thema" CASCADE;
  DROP TABLE "_posts_v_version_gallery" CASCADE;
  DROP TABLE "_posts_v_version_map_points" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "_posts_v_rels" CASCADE;
  DROP TABLE "stories_thema" CASCADE;
  DROP TABLE "stories_gallery" CASCADE;
  DROP TABLE "stories" CASCADE;
  DROP TABLE "_stories_v_version_thema" CASCADE;
  DROP TABLE "_stories_v_version_gallery" CASCADE;
  DROP TABLE "_stories_v" CASCADE;
  DROP TABLE "destinations_gallery" CASCADE;
  DROP TABLE "destinations_highlight_list" CASCADE;
  DROP TABLE "destinations_places" CASCADE;
  DROP TABLE "destinations_country_ids" CASCADE;
  DROP TABLE "destinations" CASCADE;
  DROP TABLE "photo_spots" CASCADE;
  DROP TABLE "photography_posts_gallery" CASCADE;
  DROP TABLE "photography_posts" CASCADE;
  DROP TABLE "photography_posts_rels" CASCADE;
  DROP TABLE "_photography_posts_v_version_gallery" CASCADE;
  DROP TABLE "_photography_posts_v" CASCADE;
  DROP TABLE "_photography_posts_v_rels" CASCADE;
  DROP TABLE "photo_galleries_photos" CASCADE;
  DROP TABLE "photo_galleries" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "tags" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "navigation_items_children" CASCADE;
  DROP TABLE "navigation_items" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TYPE "public"."enum_posts_thema";
  DROP TYPE "public"."enum_posts_werelddeel";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_thema";
  DROP TYPE "public"."enum__posts_v_version_werelddeel";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum_stories_thema";
  DROP TYPE "public"."enum_stories_werelddeel";
  DROP TYPE "public"."enum_stories_status";
  DROP TYPE "public"."enum__stories_v_version_thema";
  DROP TYPE "public"."enum__stories_v_version_werelddeel";
  DROP TYPE "public"."enum__stories_v_version_status";
  DROP TYPE "public"."enum_destinations_type";
  DROP TYPE "public"."enum_destinations_region";
  DROP TYPE "public"."enum_photo_spots_status";
  DROP TYPE "public"."enum_photo_spots_region";
  DROP TYPE "public"."enum_photography_posts_photo_category";
  DROP TYPE "public"."enum_photography_posts_status";
  DROP TYPE "public"."enum__photography_posts_v_version_photo_category";
  DROP TYPE "public"."enum__photography_posts_v_version_status";`)
}
