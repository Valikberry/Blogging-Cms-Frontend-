import type { CollectionConfig } from 'payload'

export const Continents: CollectionConfig = {
  slug: 'continents',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
  },
  access: {
    read: () => true,
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