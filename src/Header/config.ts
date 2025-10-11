import type { GlobalConfig } from 'payload'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      type: 'group',
      label: 'Logo',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Logo Image',
        },
        {
          name: 'text',
          type: 'text',
          label: 'Logo Text',
          admin: {
            description: 'Alternative text logo (if no image)',
          },
        },
        {
          name: 'url',
          type: 'text',
          label: 'Logo Link URL',
          defaultValue: '/',
        },
      ],
    },
    {
      name: 'navItems',
      type: 'array',
      label: 'Navigation Items',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Menu Label',
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Simple Link', value: 'simple' },
            { label: 'Continent Dropdown', value: 'continent' },
          ],
          defaultValue: 'simple',
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'simple',
            description: 'For simple links (e.g., Home)',
          },
        },
        {
          name: 'continent',
          type: 'relationship',
          relationTo: 'continents',
          label: 'Select Continent',
          admin: {
            condition: (data, siblingData) => siblingData?.type === 'continent',
          },
        },
      ],
      maxRows: 8,
      admin: {
        initCollapsed: true,
      },
    },
    {
      name: 'showSearch',
      type: 'checkbox',
      label: 'Show Search Icon',
      defaultValue: true,
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}