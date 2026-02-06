import { globalConfigs } from '@/configs';
import { anyone } from '@/payload/access/anyone';
import { authenticated } from '@/payload/access/authenticated';
import { collectionGroup, staticDir } from '@/payload/configs';
import type { CollectionConfig } from 'payload';

const { RESPONSIVE_IMAGE_SIZES } = globalConfigs;

export const ResponsiveMedia: CollectionConfig = {
  slug: 'responsive_media',
  labels: {
    singular: 'Responsive Media',
    plural: 'Responsive Media'
  },
  defaultPopulate: {
    filename: true,
    alt: true,
    focalX: true,
    focalY: true,
    url: true,
    updatedAt: true,
    sizes: Object.fromEntries(
      RESPONSIVE_IMAGE_SIZES.map((size) => [
        String(size),
        { filename: true, url: true }
      ])
    )
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated
  },
  admin: {
    group: collectionGroup.media
  },
  fields: [
    // Note: this field is added to mitigate this issue: https://github.com/payloadcms/payload/issues/12475
    {
      name: 'prefix',
      type: 'text',
      defaultValue: staticDir.responsive,
      admin: {
        readOnly: true,
        hidden: true
      }
    }
  ],
  upload: {
    staticDir: staticDir.responsive,
    mimeTypes: ['image/*'],
    adminThumbnail: String(RESPONSIVE_IMAGE_SIZES[0]),
    imageSizes: RESPONSIVE_IMAGE_SIZES.map((width) => ({
      width,
      name: String(width),
      formatOptions: {
        format: 'webp',
        options: { quality: 80, effort: 6 }
      }
    })),
    formatOptions: {
      format: 'webp',
      options: { quality: 80, effort: 6 }
    }
  }
};
