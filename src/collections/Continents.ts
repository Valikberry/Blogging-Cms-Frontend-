import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'
import { authenticated } from '../access/authenticated'

export const Continents: CollectionConfig = {
  slug: 'continents',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
  },
  access: {
    admin: authenticated, // Authors can see in admin UI
    create: isAdmin,
    delete: isAdmin,
    update: isAdmin,
    read: () => true, // Public read access
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Continent Name',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      label: 'URL Slug',
      admin: {
        description: 'e.g., south-america, north-america, asia',
      },
    },
  ],
}