import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { isAdmin } from '../../access/isAdmin'

export const PollVotes: CollectionConfig = {
  slug: 'poll-votes',
  access: {
    admin: authenticated,
    create: () => true, // Anyone can vote
    delete: isAdmin,
    read: isAdmin, // Only admins can see individual votes
    update: () => false, // Votes cannot be changed
  },
  admin: {
    useAsTitle: 'visitorId',
    defaultColumns: ['poll', 'optionIndex', 'visitorId', 'createdAt'],
    group: 'Content',
  },
  fields: [
    {
      name: 'poll',
      type: 'relationship',
      relationTo: 'polls' as const,
      required: true,
      admin: {
        description: 'The poll that was voted on',
      },
      index: true,
    },
    {
      name: 'optionIndex',
      type: 'number',
      required: true,
      admin: {
        description: 'Index of the selected option (0-based)',
      },
    },
    {
      name: 'visitorId',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Unique identifier for the visitor (fingerprint or cookie)',
      },
    },
    {
      name: 'ipAddress',
      type: 'text',
      admin: {
        description: 'IP address of the voter (for fraud prevention)',
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      admin: {
        description: 'User agent of the voter',
      },
    },
  ],
}
