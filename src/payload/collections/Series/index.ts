import { anyone } from '@/payload/access/anyone';
import { authenticated } from '@/payload/access/authenticated';
import { slugField } from '@/payload/fields/slug';
import type { CollectionConfig } from 'payload';

export const Series: CollectionConfig = {
  slug: 'series',
  admin: {
    useAsTitle: 'name'
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true
    },
    ...slugField('name', { unique: true })
    // TODO: add thumbnail
  ]
};
