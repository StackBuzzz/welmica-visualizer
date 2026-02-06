import { anyone } from '@/payload/access/anyone';
import { authenticated } from '@/payload/access/authenticated';
import { slugField } from '@/payload/fields/slug';
import type { CollectionConfig } from 'payload';

export const ApplicationAreas: CollectionConfig = {
  slug: 'applicationAreas',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated
  },
  admin: {
    useAsTitle: 'label'
  },
  fields: [
    {
      type: 'text',
      name: 'label',
      required: true,
      admin: {
        position: 'sidebar'
      }
    },
    ...slugField('label')
    // TODO: add thumbnail
  ]
};
