import { anyone } from '@/payload/access/anyone';
import { isSuperAdmin } from '@/payload/access/isSuperAdmin';
import { staticDir, collectionGroup } from '@/payload/configs';
import { getUniqueFilename } from '@/payload/hooks/uniqueMediaFilename';
import type { CollectionConfig } from 'payload';

export const RenderPasses: CollectionConfig = {
  slug: 'passes',
  labels: {
    singular: 'Render Pass',
    plural: 'Render Passes'
  },
  admin: {
    hideAPIURL: true,
    group: collectionGroup.media,
    hidden: true
  },
  access: {
    read: anyone,
    update: isSuperAdmin,
    delete: isSuperAdmin,
    create: isSuperAdmin
  },
  fields: [
    // Note: this field is added to mitigate this issue: https://github.com/payloadcms/payload/issues/12475
    {
      name: 'prefix',
      type: 'text',
      defaultValue: staticDir.renderPasses,
      admin: {
        readOnly: true,
        hidden: true
      }
    }
  ],
  upload: {
    staticDir: staticDir.renderPasses,
    displayPreview: true,
    filesRequiredOnCreate: true,
    crop: false,
    focalPoint: false,
    mimeTypes: ['image/jpg', 'image/png', 'image/jpeg', 'image/webp'],
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 240,
        formatOptions: {
          format: 'webp',
          options: { quality: 100, effort: 6 }
        }
      },
      {
        name: '2k',
        width: 1024 * 2,
        formatOptions: {
          format: 'webp',
          options: {
            quality: 100,
            effort: 6
          }
        }
      }
    ],
    resizeOptions: {
      width: 1024 * 4, // limit at 4k
      withoutEnlargement: true,
      withoutReduction: false
    },
    formatOptions: {
      format: 'webp',
      options: { quality: 100, effort: 6 }
    }
  },
  hooks: {
    beforeOperation: [getUniqueFilename]
  }
};
