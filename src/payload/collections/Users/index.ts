import {
  isSuperAdmin,
  isSuperAdminOrSelf
} from '@/payload/access/isSuperAdmin';
import { collectionGroup } from '@/payload/configs';
import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: collectionGroup.admin
  },
  access: {
    create: isSuperAdmin,
    delete: isSuperAdmin,
    read: isSuperAdminOrSelf,
    update: isSuperAdminOrSelf
  },
  auth: true,
  fields: [
    {
      type: 'text',
      name: 'name',
      required: false,
      unique: true
    },
    {
      name: 'role',
      type: 'select',
      access: {
        update: isSuperAdmin
      },
      admin: {
        disableListColumn: true,
        disableListFilter: true
      },
      options: [
        {
          label: 'Super Admin',
          value: 'super-admin'
        },
        {
          label: 'Admin',
          value: 'admin'
        }
      ],
      required: true,
      defaultValue: 'super-admin'
    }
  ]
};
