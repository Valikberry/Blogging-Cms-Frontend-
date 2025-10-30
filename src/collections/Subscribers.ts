import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  access: {
    create: anyone, // Allow public to subscribe
    delete: authenticated,
    read: authenticated, // Only admins can see subscribers
    update: authenticated,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'subscribedAt', 'isActive'],
    group: 'Marketing',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Subscriber email address',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether the subscription is active',
      },
    },
    {
      name: 'subscribedAt',
      type: 'date',
      admin: {
        date: {
          displayFormat: 'yyyy-MM-dd HH:mm',
        },
        description: 'Date when the user subscribed',
      },
      hooks: {
        beforeChange: [
          ({ value, operation }) => {
            // Set subscribedAt on creation
            if (operation === 'create' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'source',
      type: 'text',
      admin: {
        description: 'Where the subscription came from (e.g., homepage, blog post)',
      },
    },
    {
      name: 'country',
      type: 'relationship',
      relationTo: 'countries',
      admin: {
        description: 'Country where the user subscribed from',
      },
    },
    {
      name: 'unsubscribedAt',
      type: 'date',
      admin: {
        date: {
          displayFormat: 'yyyy-MM-dd HH:mm',
        },
        description: 'Date when the user unsubscribed',
      },
    },
  ],
  timestamps: true,
}
