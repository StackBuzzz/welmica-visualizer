import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "responsive_media_sizes_4096_sizes_4096_filename_idx";
  ALTER TABLE "responsive_media" DROP COLUMN "sizes_4096_url";
  ALTER TABLE "responsive_media" DROP COLUMN "sizes_4096_width";
  ALTER TABLE "responsive_media" DROP COLUMN "sizes_4096_height";
  ALTER TABLE "responsive_media" DROP COLUMN "sizes_4096_mime_type";
  ALTER TABLE "responsive_media" DROP COLUMN "sizes_4096_filesize";
  ALTER TABLE "responsive_media" DROP COLUMN "sizes_4096_filename";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "responsive_media" ADD COLUMN "sizes_4096_url" varchar;
  ALTER TABLE "responsive_media" ADD COLUMN "sizes_4096_width" numeric;
  ALTER TABLE "responsive_media" ADD COLUMN "sizes_4096_height" numeric;
  ALTER TABLE "responsive_media" ADD COLUMN "sizes_4096_mime_type" varchar;
  ALTER TABLE "responsive_media" ADD COLUMN "sizes_4096_filesize" numeric;
  ALTER TABLE "responsive_media" ADD COLUMN "sizes_4096_filename" varchar;
  CREATE INDEX "responsive_media_sizes_4096_sizes_4096_filename_idx" ON "responsive_media" USING btree ("sizes_4096_filename");`)
}
