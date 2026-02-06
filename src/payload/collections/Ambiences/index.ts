import { isSuperAdmin } from '@/payload/access/isSuperAdmin';
import { slugField } from '@/payload/fields/slug';
import type { CollectionConfig } from 'payload';

export const Ambiences: CollectionConfig = {
  slug: 'ambiences',
  admin: {
    useAsTitle: 'label'
  },
  access: {
    create: isSuperAdmin,
    delete: isSuperAdmin,
    read: isSuperAdmin,
    update: isSuperAdmin
  },
  orderable: true,
  fields: [
    {
      type: 'text',
      name: 'label',
      required: true
    },
    ...slugField('label', { unique: true })
  ]
};
