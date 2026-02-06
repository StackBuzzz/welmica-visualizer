import { anyone } from '@/payload/access/anyone';
import { authenticated } from '@/payload/access/authenticated';
import { slugField } from '@/payload/fields/slug';
import type { CollectionConfig } from 'payload';

export const ProductCategories: CollectionConfig = {
  slug: 'productCategories',
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
      required: true
    },
    ...slugField('label', { unique: true })
  ]
};
