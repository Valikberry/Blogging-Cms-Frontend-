import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'group',
      name: 'topBar',
      label: 'Top Bar',
      fields: [
        {
          name: 'socialLinks',
          type: 'array',
          label: 'Social Links',
          fields: [
            {
              name: 'icon',
              type: 'select',
              options: [
                { label: 'Facebook', value: 'facebook' },
                { label: 'Twitter', value: 'twitter' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'Instagram', value: 'instagram' },
              ],
              required: true,
            },
            { name: 'url', type: 'text', required: true },
          ],
        },
        {
          name: 'languageButton',
          type: 'group',
          label: 'Language Switcher Button',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              defaultValue: 'Language',
              admin: {
                description: 'Button text to open language switcher',
              },
            },
            {
              name: 'enabled',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show Language Switcher',
            },
          ],
        },
      ],
    },
    {
      name: 'navItems',
      type: 'array',
      label: 'Main Navigation Items',
      fields: [
        link({
          appearances: false,
          disableLabel: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
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
