import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { isAdminOrAuthor } from '../../access/isAdminOrAuthor'
import { slugField } from '@/fields/slug'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Polls: CollectionConfig = {
  slug: 'polls',
  access: {
    admin: authenticated,
    create: isAdminOrAuthor,
    delete: isAdminOrAuthor,
    read: () => true, // Public read access
    update: isAdminOrAuthor,
  },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'country', 'status', 'totalVotes', 'publishedAt'],
    group: 'Content',
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      admin: {
        description: 'The poll question (e.g., "Will you support Trump in the next election?")',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Featured image for the poll',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional description shown after voting',
      },
    },
    {
      name: 'options',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 10,
      admin: {
        description: 'Poll options (minimum 2, maximum 10)',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          admin: {
            description: 'Option text (e.g., "Yes", "No", "Maybe")',
          },
        },
        {
          name: 'votes',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
            description: 'Number of votes for this option',
          },
        },
      ],
    },
    {
      name: 'totalVotes',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Total number of votes',
      },
    },
    {
      name: 'country',
      type: 'relationship',
      relationTo: 'countries',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Country this poll is associated with',
      },
    },
    {
      name: 'tags',
      type: 'array',
      admin: {
        description: 'Tags for the poll (e.g., "Melania", "Trumps")',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Closed', value: 'closed' },
        { label: 'Draft', value: 'draft' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Poll status',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'When the poll was published',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData.status === 'active' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'closedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'When the poll will close (optional)',
      },
    },
    {
      name: 'thingsToKnow',
      type: 'group',
      admin: {
        description: 'Key facts shown in green box after voting',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'Title for the section (e.g., "5 Things To Know About Donald Trump")',
          },
        },
        {
          name: 'points',
          type: 'array',
          admin: {
            description: 'Bullet points to display',
          },
          fields: [
            {
              name: 'point',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'moreFacts',
      type: 'textarea',
      admin: {
        description: 'Additional facts shown in yellow box after voting',
      },
    },
    {
      name: 'relatedPolls',
      type: 'relationship',
      relationTo: 'polls' as const,
      hasMany: true,
      admin: {
        description: 'Related polls to show after voting',
      },
      filterOptions: ({ id }) => {
        return {
          id: {
            not_in: [id],
          },
        }
      },
    },
    {
      name: 'relatedPosts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      admin: {
        description: 'Related articles to show after voting',
      },
    },
    {
      name: 'meta',
      label: 'SEO',
      type: 'group',
      fields: [
        OverviewField({
          titlePath: 'meta.title',
          descriptionPath: 'meta.description',
          imagePath: 'meta.image',
        }),
        MetaTitleField({
          hasGenerateFn: true,
        }),
        MetaImageField({
          relationTo: 'media',
        }),
        MetaDescriptionField({}),
        PreviewField({
          hasGenerateFn: true,
          titlePath: 'meta.title',
          descriptionPath: 'meta.description',
        }),
      ],
    },
    ...slugField(),
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Calculate total votes from options
        if (data.options && Array.isArray(data.options)) {
          data.totalVotes = data.options.reduce((sum: number, option: any) => {
            return sum + (option.votes || 0)
          }, 0)
        }
        return data
      },
    ],
  },
}
