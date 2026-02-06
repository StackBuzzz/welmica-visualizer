import { s3Storage as payloadS3Storage } from '@payloadcms/storage-s3';
import { globalConfigs } from '@/configs';
import { staticDir } from '@/payload/configs';
import type { Plugin } from 'payload';

const { R2_STORATE_ENABLED } = globalConfigs;
const bucket = process.env.R2_BUCKET_NAME || '';
const baseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';

export const r2Storage: Plugin = payloadS3Storage({
  collections: {
    static_media: {
      prefix: staticDir.static,
      generateFileURL: ({ filename, prefix }) =>
        `${baseUrl}/${prefix}/${encodeURIComponent(filename)}`
    },
    responsive_media: {
      prefix: staticDir.responsive,
      generateFileURL: ({ filename, prefix }) =>
        `${baseUrl}/${prefix}/${encodeURIComponent(filename)}`
    }
  },
  bucket,
  config: {
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.R2_SECRET_KEY || ''
    },
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT || ''
  },
  enabled: R2_STORATE_ENABLED,
  disableLocalStorage: !R2_STORATE_ENABLED,
  clientUploads: true
});
