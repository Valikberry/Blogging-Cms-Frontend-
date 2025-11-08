import type { CollectionConfig } from 'payload'

export const Countries: CollectionConfig = {
  slug: 'countries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'flag', 'continent', 'slug'],
  },
  defaultSort: 'createdAt', // ← Add this for oldest first
  // OR
  // defaultSort: '-createdAt', // ← For newest first
  // OR
  // defaultSort: 'name', // ← For alphabetical
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Country Name',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      label: 'URL Slug',
      admin: {
        description: 'e.g., brazil, argentina, usa',
      },
    },
    {
      name: 'flag',
      type: 'upload',
      relationTo: 'media',
      label: 'Country Flag',
      admin: {
        description: 'Upload a flag image for this country',
      },
    },
    {
      name: 'continent',
      type: 'relationship',
      relationTo: 'continents',
      required: true,
      label: 'Continent',
    },
  ],
}