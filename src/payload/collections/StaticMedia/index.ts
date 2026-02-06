import { anyone } from '@/payload/access/anyone';
import { authenticated } from '@/payload/access/authenticated';
import { staticDir, collectionGroup } from '@/payload/configs';
import type { CollectionConfig } from 'payload';

export const StaticMedia: CollectionConfig = {
  slug: 'static_media',
  labels: {
    singular: 'Static Media',
    plural: 'Static Media'
  },
  defaultPopulate: {
    filename: true,
    alt: true,
    focalX: true,
    focalY: true,
    updatedAt: true
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
    {
      name: 'alt',
      type: 'text'
    },

    // Note: this field is added to mitigate this issue: https://github.com/payloadcms/payload/issues/12475
    {
      name: 'prefix',
      type: 'text',
      defaultValue: staticDir.static,
      admin: {
        readOnly: true,
        hidden: true
      }
    }
  ],
  upload: {
    crop: false,
    focalPoint: true,
    staticDir: staticDir.static
  }
};
