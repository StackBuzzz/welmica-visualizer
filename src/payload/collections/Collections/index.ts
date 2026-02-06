import { anyone } from '@/payload/access/anyone';
import { authenticated } from '@/payload/access/authenticated';
import { slugField } from '@/payload/fields/slug';
import type { CollectionConfig } from 'payload';

export const Collections: CollectionConfig = {
  slug: 'collections',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated
  },
  admin: {
    useAsTitle: 'name'
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
