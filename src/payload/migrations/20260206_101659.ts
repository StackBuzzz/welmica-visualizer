import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('super-admin', 'admin');
  CREATE TYPE "public"."enum_scenes_segments_gravity" AS ENUM('center', 'centre', 'north', 'east', 'south', 'west', 'northeast', 'southeast', 'southwest', 'northwest');
  CREATE TYPE "public"."enum_scenes_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__scenes_v_version_segments_gravity" AS ENUM('center', 'centre', 'north', 'east', 'south', 'west', 'northeast', 'southeast', 'southwest', 'northwest');
  CREATE TYPE "public"."enum__scenes_v_version_status" AS ENUM('draft', 'published');
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
  	"role" "enum_users_role" DEFAULT 'super-admin' NOT NULL,
  	"totp_secret" varchar,
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
  
  CREATE TABLE "responsive_media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"prefix" varchar DEFAULT 'payload-media/responsive',
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
  	"sizes_384_url" varchar,
  	"sizes_384_width" numeric,
  	"sizes_384_height" numeric,
  	"sizes_384_mime_type" varchar,
  	"sizes_384_filesize" numeric,
  	"sizes_384_filename" varchar,
  	"sizes_768_url" varchar,
  	"sizes_768_width" numeric,
  	"sizes_768_height" numeric,
  	"sizes_768_mime_type" varchar,
  	"sizes_768_filesize" numeric,
  	"sizes_768_filename" varchar,
  	"sizes_1024_url" varchar,
  	"sizes_1024_width" numeric,
  	"sizes_1024_height" numeric,
  	"sizes_1024_mime_type" varchar,
  	"sizes_1024_filesize" numeric,
  	"sizes_1024_filename" varchar,
  	"sizes_1640_url" varchar,
  	"sizes_1640_width" numeric,
  	"sizes_1640_height" numeric,
  	"sizes_1640_mime_type" varchar,
  	"sizes_1640_filesize" numeric,
  	"sizes_1640_filename" varchar,
  	"sizes_2048_url" varchar,
  	"sizes_2048_width" numeric,
  	"sizes_2048_height" numeric,
  	"sizes_2048_mime_type" varchar,
  	"sizes_2048_filesize" numeric,
  	"sizes_2048_filename" varchar,
  	"sizes_3072_url" varchar,
  	"sizes_3072_width" numeric,
  	"sizes_3072_height" numeric,
  	"sizes_3072_mime_type" varchar,
  	"sizes_3072_filesize" numeric,
  	"sizes_3072_filename" varchar,
  	"sizes_4096_url" varchar,
  	"sizes_4096_width" numeric,
  	"sizes_4096_height" numeric,
  	"sizes_4096_mime_type" varchar,
  	"sizes_4096_filesize" numeric,
  	"sizes_4096_filename" varchar
  );
  
  CREATE TABLE "static_media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"prefix" varchar DEFAULT 'payload-media/static',
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
  	"focal_y" numeric
  );
  
  CREATE TABLE "collections" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"slug_lock" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "series" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"slug_lock" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ambiences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"label" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"slug_lock" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "application_areas" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"slug_lock" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "passes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"prefix" varchar DEFAULT 'payload-media/passes',
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
  	"sizes_2k_url" varchar,
  	"sizes_2k_width" numeric,
  	"sizes_2k_height" numeric,
  	"sizes_2k_mime_type" varchar,
  	"sizes_2k_filesize" numeric,
  	"sizes_2k_filename" varchar
  );
  
  CREATE TABLE "product_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"slug_lock" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products_details_specifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"details_category_id" integer NOT NULL,
  	"details_collection_id" integer NOT NULL,
  	"details_series_id" integer NOT NULL,
  	"details_dimension" varchar,
  	"details_finish" varchar,
  	"details_thickness" varchar,
  	"properties_width" numeric NOT NULL,
  	"properties_height" numeric NOT NULL,
  	"properties_glossyness" numeric NOT NULL,
  	"properties_roughness" numeric,
  	"properties_groove_thickness" numeric DEFAULT 0,
  	"properties_groove_r" numeric,
  	"properties_groove_g" numeric,
  	"properties_groove_b" numeric,
  	"label" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"slug_lock" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"application_areas_id" integer,
  	"responsive_media_id" integer
  );
  
  CREATE TABLE "scenes_segments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"gravity" "enum_scenes_segments_gravity" DEFAULT 'centre',
  	"application_area_id" integer,
  	"mask_id" integer,
  	"dimension_width" numeric,
  	"dimension_height" numeric,
  	"marker_label" varchar,
  	"marker_position_x" numeric,
  	"marker_position_y" numeric,
  	"coordinates_top_left_x" numeric,
  	"coordinates_top_left_y" numeric,
  	"coordinates_top_right_x" numeric,
  	"coordinates_top_right_y" numeric,
  	"coordinates_bottom_left_x" numeric,
  	"coordinates_bottom_left_y" numeric,
  	"coordinates_bottom_right_x" numeric,
  	"coordinates_bottom_right_y" numeric
  );
  
  CREATE TABLE "scenes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"general_ambience_id" integer,
  	"general_thumbnail_id" integer,
  	"passes_static_id" integer,
  	"passes_shadow_id" integer,
  	"passes_reflection_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_scenes_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_scenes_v_version_segments" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"gravity" "enum__scenes_v_version_segments_gravity" DEFAULT 'centre',
  	"application_area_id" integer,
  	"mask_id" integer,
  	"dimension_width" numeric,
  	"dimension_height" numeric,
  	"marker_label" varchar,
  	"marker_position_x" numeric,
  	"marker_position_y" numeric,
  	"coordinates_top_left_x" numeric,
  	"coordinates_top_left_y" numeric,
  	"coordinates_top_right_x" numeric,
  	"coordinates_top_right_y" numeric,
  	"coordinates_bottom_left_x" numeric,
  	"coordinates_bottom_left_y" numeric,
  	"coordinates_bottom_right_x" numeric,
  	"coordinates_bottom_right_y" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_scenes_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_general_ambience_id" integer,
  	"version_general_thumbnail_id" integer,
  	"version_passes_static_id" integer,
  	"version_passes_shadow_id" integer,
  	"version_passes_reflection_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__scenes_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
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
  	"users_id" integer,
  	"responsive_media_id" integer,
  	"static_media_id" integer,
  	"collections_id" integer,
  	"series_id" integer,
  	"ambiences_id" integer,
  	"application_areas_id" integer,
  	"passes_id" integer,
  	"product_categories_id" integer,
  	"products_id" integer,
  	"scenes_id" integer
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
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_details_specifications" ADD CONSTRAINT "products_details_specifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_details_category_id_product_categories_id_fk" FOREIGN KEY ("details_category_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_details_collection_id_collections_id_fk" FOREIGN KEY ("details_collection_id") REFERENCES "public"."collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_details_series_id_series_id_fk" FOREIGN KEY ("details_series_id") REFERENCES "public"."series"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_application_areas_fk" FOREIGN KEY ("application_areas_id") REFERENCES "public"."application_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_responsive_media_fk" FOREIGN KEY ("responsive_media_id") REFERENCES "public"."responsive_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "scenes_segments" ADD CONSTRAINT "scenes_segments_application_area_id_application_areas_id_fk" FOREIGN KEY ("application_area_id") REFERENCES "public"."application_areas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "scenes_segments" ADD CONSTRAINT "scenes_segments_mask_id_passes_id_fk" FOREIGN KEY ("mask_id") REFERENCES "public"."passes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "scenes_segments" ADD CONSTRAINT "scenes_segments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."scenes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "scenes" ADD CONSTRAINT "scenes_general_ambience_id_ambiences_id_fk" FOREIGN KEY ("general_ambience_id") REFERENCES "public"."ambiences"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "scenes" ADD CONSTRAINT "scenes_general_thumbnail_id_responsive_media_id_fk" FOREIGN KEY ("general_thumbnail_id") REFERENCES "public"."responsive_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "scenes" ADD CONSTRAINT "scenes_passes_static_id_passes_id_fk" FOREIGN KEY ("passes_static_id") REFERENCES "public"."passes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "scenes" ADD CONSTRAINT "scenes_passes_shadow_id_passes_id_fk" FOREIGN KEY ("passes_shadow_id") REFERENCES "public"."passes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "scenes" ADD CONSTRAINT "scenes_passes_reflection_id_passes_id_fk" FOREIGN KEY ("passes_reflection_id") REFERENCES "public"."passes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_scenes_v_version_segments" ADD CONSTRAINT "_scenes_v_version_segments_application_area_id_application_areas_id_fk" FOREIGN KEY ("application_area_id") REFERENCES "public"."application_areas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_scenes_v_version_segments" ADD CONSTRAINT "_scenes_v_version_segments_mask_id_passes_id_fk" FOREIGN KEY ("mask_id") REFERENCES "public"."passes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_scenes_v_version_segments" ADD CONSTRAINT "_scenes_v_version_segments_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_scenes_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_scenes_v" ADD CONSTRAINT "_scenes_v_parent_id_scenes_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."scenes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_scenes_v" ADD CONSTRAINT "_scenes_v_version_general_ambience_id_ambiences_id_fk" FOREIGN KEY ("version_general_ambience_id") REFERENCES "public"."ambiences"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_scenes_v" ADD CONSTRAINT "_scenes_v_version_general_thumbnail_id_responsive_media_id_fk" FOREIGN KEY ("version_general_thumbnail_id") REFERENCES "public"."responsive_media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_scenes_v" ADD CONSTRAINT "_scenes_v_version_passes_static_id_passes_id_fk" FOREIGN KEY ("version_passes_static_id") REFERENCES "public"."passes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_scenes_v" ADD CONSTRAINT "_scenes_v_version_passes_shadow_id_passes_id_fk" FOREIGN KEY ("version_passes_shadow_id") REFERENCES "public"."passes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_scenes_v" ADD CONSTRAINT "_scenes_v_version_passes_reflection_id_passes_id_fk" FOREIGN KEY ("version_passes_reflection_id") REFERENCES "public"."passes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_responsive_media_fk" FOREIGN KEY ("responsive_media_id") REFERENCES "public"."responsive_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_static_media_fk" FOREIGN KEY ("static_media_id") REFERENCES "public"."static_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_collections_fk" FOREIGN KEY ("collections_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_series_fk" FOREIGN KEY ("series_id") REFERENCES "public"."series"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ambiences_fk" FOREIGN KEY ("ambiences_id") REFERENCES "public"."ambiences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_application_areas_fk" FOREIGN KEY ("application_areas_id") REFERENCES "public"."application_areas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_passes_fk" FOREIGN KEY ("passes_id") REFERENCES "public"."passes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_scenes_fk" FOREIGN KEY ("scenes_id") REFERENCES "public"."scenes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "users_name_idx" ON "users" USING btree ("name");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "responsive_media_updated_at_idx" ON "responsive_media" USING btree ("updated_at");
  CREATE INDEX "responsive_media_created_at_idx" ON "responsive_media" USING btree ("created_at");
  CREATE UNIQUE INDEX "responsive_media_filename_idx" ON "responsive_media" USING btree ("filename");
  CREATE INDEX "responsive_media_sizes_384_sizes_384_filename_idx" ON "responsive_media" USING btree ("sizes_384_filename");
  CREATE INDEX "responsive_media_sizes_768_sizes_768_filename_idx" ON "responsive_media" USING btree ("sizes_768_filename");
  CREATE INDEX "responsive_media_sizes_1024_sizes_1024_filename_idx" ON "responsive_media" USING btree ("sizes_1024_filename");
  CREATE INDEX "responsive_media_sizes_1640_sizes_1640_filename_idx" ON "responsive_media" USING btree ("sizes_1640_filename");
  CREATE INDEX "responsive_media_sizes_2048_sizes_2048_filename_idx" ON "responsive_media" USING btree ("sizes_2048_filename");
  CREATE INDEX "responsive_media_sizes_3072_sizes_3072_filename_idx" ON "responsive_media" USING btree ("sizes_3072_filename");
  CREATE INDEX "responsive_media_sizes_4096_sizes_4096_filename_idx" ON "responsive_media" USING btree ("sizes_4096_filename");
  CREATE INDEX "static_media_updated_at_idx" ON "static_media" USING btree ("updated_at");
  CREATE INDEX "static_media_created_at_idx" ON "static_media" USING btree ("created_at");
  CREATE UNIQUE INDEX "static_media_filename_idx" ON "static_media" USING btree ("filename");
  CREATE UNIQUE INDEX "collections_slug_idx" ON "collections" USING btree ("slug");
  CREATE INDEX "collections_updated_at_idx" ON "collections" USING btree ("updated_at");
  CREATE INDEX "collections_created_at_idx" ON "collections" USING btree ("created_at");
  CREATE UNIQUE INDEX "series_slug_idx" ON "series" USING btree ("slug");
  CREATE INDEX "series_updated_at_idx" ON "series" USING btree ("updated_at");
  CREATE INDEX "series_created_at_idx" ON "series" USING btree ("created_at");
  CREATE INDEX "ambiences__order_idx" ON "ambiences" USING btree ("_order");
  CREATE UNIQUE INDEX "ambiences_slug_idx" ON "ambiences" USING btree ("slug");
  CREATE INDEX "ambiences_updated_at_idx" ON "ambiences" USING btree ("updated_at");
  CREATE INDEX "ambiences_created_at_idx" ON "ambiences" USING btree ("created_at");
  CREATE INDEX "application_areas_slug_idx" ON "application_areas" USING btree ("slug");
  CREATE INDEX "application_areas_updated_at_idx" ON "application_areas" USING btree ("updated_at");
  CREATE INDEX "application_areas_created_at_idx" ON "application_areas" USING btree ("created_at");
  CREATE INDEX "passes_updated_at_idx" ON "passes" USING btree ("updated_at");
  CREATE INDEX "passes_created_at_idx" ON "passes" USING btree ("created_at");
  CREATE UNIQUE INDEX "passes_filename_idx" ON "passes" USING btree ("filename");
  CREATE INDEX "passes_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "passes" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "passes_sizes_2k_sizes_2k_filename_idx" ON "passes" USING btree ("sizes_2k_filename");
  CREATE UNIQUE INDEX "product_categories_slug_idx" ON "product_categories" USING btree ("slug");
  CREATE INDEX "product_categories_updated_at_idx" ON "product_categories" USING btree ("updated_at");
  CREATE INDEX "product_categories_created_at_idx" ON "product_categories" USING btree ("created_at");
  CREATE INDEX "products_details_specifications_order_idx" ON "products_details_specifications" USING btree ("_order");
  CREATE INDEX "products_details_specifications_parent_id_idx" ON "products_details_specifications" USING btree ("_parent_id");
  CREATE INDEX "products_details_details_category_idx" ON "products" USING btree ("details_category_id");
  CREATE INDEX "products_details_details_collection_idx" ON "products" USING btree ("details_collection_id");
  CREATE INDEX "products_details_details_series_idx" ON "products" USING btree ("details_series_id");
  CREATE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "products_rels_order_idx" ON "products_rels" USING btree ("order");
  CREATE INDEX "products_rels_parent_idx" ON "products_rels" USING btree ("parent_id");
  CREATE INDEX "products_rels_path_idx" ON "products_rels" USING btree ("path");
  CREATE INDEX "products_rels_application_areas_id_idx" ON "products_rels" USING btree ("application_areas_id");
  CREATE INDEX "products_rels_responsive_media_id_idx" ON "products_rels" USING btree ("responsive_media_id");
  CREATE INDEX "scenes_segments_order_idx" ON "scenes_segments" USING btree ("_order");
  CREATE INDEX "scenes_segments_parent_id_idx" ON "scenes_segments" USING btree ("_parent_id");
  CREATE INDEX "scenes_segments_application_area_idx" ON "scenes_segments" USING btree ("application_area_id");
  CREATE INDEX "scenes_segments_mask_idx" ON "scenes_segments" USING btree ("mask_id");
  CREATE INDEX "scenes__order_idx" ON "scenes" USING btree ("_order");
  CREATE INDEX "scenes_general_general_ambience_idx" ON "scenes" USING btree ("general_ambience_id");
  CREATE INDEX "scenes_general_general_thumbnail_idx" ON "scenes" USING btree ("general_thumbnail_id");
  CREATE INDEX "scenes_passes_passes_static_idx" ON "scenes" USING btree ("passes_static_id");
  CREATE INDEX "scenes_passes_passes_shadow_idx" ON "scenes" USING btree ("passes_shadow_id");
  CREATE INDEX "scenes_passes_passes_reflection_idx" ON "scenes" USING btree ("passes_reflection_id");
  CREATE INDEX "scenes_updated_at_idx" ON "scenes" USING btree ("updated_at");
  CREATE INDEX "scenes_created_at_idx" ON "scenes" USING btree ("created_at");
  CREATE INDEX "scenes__status_idx" ON "scenes" USING btree ("_status");
  CREATE INDEX "_scenes_v_version_segments_order_idx" ON "_scenes_v_version_segments" USING btree ("_order");
  CREATE INDEX "_scenes_v_version_segments_parent_id_idx" ON "_scenes_v_version_segments" USING btree ("_parent_id");
  CREATE INDEX "_scenes_v_version_segments_application_area_idx" ON "_scenes_v_version_segments" USING btree ("application_area_id");
  CREATE INDEX "_scenes_v_version_segments_mask_idx" ON "_scenes_v_version_segments" USING btree ("mask_id");
  CREATE INDEX "_scenes_v_parent_idx" ON "_scenes_v" USING btree ("parent_id");
  CREATE INDEX "_scenes_v_version_version__order_idx" ON "_scenes_v" USING btree ("version__order");
  CREATE INDEX "_scenes_v_version_general_version_general_ambience_idx" ON "_scenes_v" USING btree ("version_general_ambience_id");
  CREATE INDEX "_scenes_v_version_general_version_general_thumbnail_idx" ON "_scenes_v" USING btree ("version_general_thumbnail_id");
  CREATE INDEX "_scenes_v_version_passes_version_passes_static_idx" ON "_scenes_v" USING btree ("version_passes_static_id");
  CREATE INDEX "_scenes_v_version_passes_version_passes_shadow_idx" ON "_scenes_v" USING btree ("version_passes_shadow_id");
  CREATE INDEX "_scenes_v_version_passes_version_passes_reflection_idx" ON "_scenes_v" USING btree ("version_passes_reflection_id");
  CREATE INDEX "_scenes_v_version_version_updated_at_idx" ON "_scenes_v" USING btree ("version_updated_at");
  CREATE INDEX "_scenes_v_version_version_created_at_idx" ON "_scenes_v" USING btree ("version_created_at");
  CREATE INDEX "_scenes_v_version_version__status_idx" ON "_scenes_v" USING btree ("version__status");
  CREATE INDEX "_scenes_v_created_at_idx" ON "_scenes_v" USING btree ("created_at");
  CREATE INDEX "_scenes_v_updated_at_idx" ON "_scenes_v" USING btree ("updated_at");
  CREATE INDEX "_scenes_v_latest_idx" ON "_scenes_v" USING btree ("latest");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_responsive_media_id_idx" ON "payload_locked_documents_rels" USING btree ("responsive_media_id");
  CREATE INDEX "payload_locked_documents_rels_static_media_id_idx" ON "payload_locked_documents_rels" USING btree ("static_media_id");
  CREATE INDEX "payload_locked_documents_rels_collections_id_idx" ON "payload_locked_documents_rels" USING btree ("collections_id");
  CREATE INDEX "payload_locked_documents_rels_series_id_idx" ON "payload_locked_documents_rels" USING btree ("series_id");
  CREATE INDEX "payload_locked_documents_rels_ambiences_id_idx" ON "payload_locked_documents_rels" USING btree ("ambiences_id");
  CREATE INDEX "payload_locked_documents_rels_application_areas_id_idx" ON "payload_locked_documents_rels" USING btree ("application_areas_id");
  CREATE INDEX "payload_locked_documents_rels_passes_id_idx" ON "payload_locked_documents_rels" USING btree ("passes_id");
  CREATE INDEX "payload_locked_documents_rels_product_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("product_categories_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_scenes_id_idx" ON "payload_locked_documents_rels" USING btree ("scenes_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "responsive_media" CASCADE;
  DROP TABLE "static_media" CASCADE;
  DROP TABLE "collections" CASCADE;
  DROP TABLE "series" CASCADE;
  DROP TABLE "ambiences" CASCADE;
  DROP TABLE "application_areas" CASCADE;
  DROP TABLE "passes" CASCADE;
  DROP TABLE "product_categories" CASCADE;
  DROP TABLE "products_details_specifications" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_rels" CASCADE;
  DROP TABLE "scenes_segments" CASCADE;
  DROP TABLE "scenes" CASCADE;
  DROP TABLE "_scenes_v_version_segments" CASCADE;
  DROP TABLE "_scenes_v" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_scenes_segments_gravity";
  DROP TYPE "public"."enum_scenes_status";
  DROP TYPE "public"."enum__scenes_v_version_segments_gravity";
  DROP TYPE "public"."enum__scenes_v_version_status";`)
}
