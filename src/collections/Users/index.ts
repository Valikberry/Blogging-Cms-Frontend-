import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { isAdmin } from '../../access/isAdmin'
import { isAdminFieldLevel } from '../../access/isAdminFieldLevel'
import { isAdminHidden } from '../../access/isAdminHidden'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: isAdmin, // Only admins can create users
    delete: isAdmin, // Only admins can delete users
    read: authenticated,
    update: ({ req: { user } }) => {
      // Admins can update anyone, users can update themselves
      if (user?.roles?.includes('admin')) return true
      return {
        id: {
          equals: user?.id,
        },
      }
    },
  },
  admin: {
    defaultColumns: ['name', 'email', 'roles'],
    useAsTitle: 'name',
    hidden: isAdminHidden,
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['author'],
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Author',
          value: 'author',
        },
      ],
      required: true,
      access: {
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
      admin: {
        description: 'User roles - Admins have full access, Authors can only manage posts',
      },
    },
  ],
  timestamps: true,
}
