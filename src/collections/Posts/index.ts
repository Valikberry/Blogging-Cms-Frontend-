import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { populateAuthors } from './hooks/populateAuthors'
import { revalidateDelete, revalidatePost } from './hooks/revalidatePost'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from '@/fields/slug'

export const Posts: CollectionConfig<'posts'> = {
  slug: 'posts',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    country: true,
    publishedAt: true,
    excerpt: true,
    heroImage: true,
    submittedBy: true,
    source: true,
    isHot: true,
    isStories: true,
    meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    defaultColumns: ['title', 'country', 'source', 'publishedAt', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'posts',
          req,
        })
        return path
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'posts',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Post title that appears in lists and detail page',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      admin: {
        description: 'Short description shown in post lists (optional)',
      },
      maxLength: 200,
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Featured image shown in post lists and detail page',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'videoEmbed',
              type: 'group',
              admin: {
                description: 'Embed video from YouTube, Vimeo, or other platforms',
              },
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Enable Video Embed',
                },
                {
                  name: 'embedUrl',
                  type: 'text',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                    description:
                      'YouTube URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID) or Vimeo URL (e.g., https://vimeo.com/VIDEO_ID). Regular URLs will be auto-converted to embed format.',
                  },
                },
                {
                  name: 'aspectRatio',
                  type: 'select',
                  defaultValue: '16-9',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                  },
                  options: [
                    { label: '16:9 (Standard)', value: '16-9' },
                    { label: '4:3 (Classic)', value: '4-3' },
                    { label: '1:1 (Square)', value: '1-1' },
                  ],
                },
              ],
            },
            {
              name: 'calloutSections',
              type: 'array',
              label: 'Callout Sections',
              admin: {
                description: 'Add highlighted sections with colored backgrounds',
              },
              fields: [
                {
                  name: 'icon',
                  type: 'select',
                  label: 'Icon',
                  options: [
                    { label: '💡 Light Bulb', value: 'lightbulb' },
                    { label: '⚡ Lightning', value: 'lightning' },
                    { label: '🔥 Fire', value: 'fire' },
                    { label: '⭐ Star', value: 'star' },
                    { label: '💎 Diamond', value: 'diamond' },
                    { label: '🎯 Target', value: 'target' },
                    { label: '🔔 Bell', value: 'bell' },
                    { label: '📌 Pin', value: 'pin' },
                    { label: 'None', value: 'none' },
                  ],
                  defaultValue: 'lightbulb',
                },
                {
                  name: 'badge',
                  type: 'text',
                  label: 'Badge Text',
                  admin: {
                    description: 'Small text next to icon (e.g., "Links to reliable shops")',
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Title',
                  required: true,
                  admin: {
                    description: 'Main heading of the callout section',
                  },
                },
                {
                  name: 'backgroundColor',
                  type: 'select',
                  label: 'Background Color',
                  options: [
                    { label: 'Purple/Blue', value: 'purple' },
                    { label: 'Green', value: 'green' },
                    { label: 'Yellow', value: 'yellow' },
                    { label: 'Red', value: 'red' },
                    { label: 'Gray', value: 'gray' },
                  ],
                  defaultValue: 'purple',
                },
                {
                  name: 'items',
                  type: 'array',
                  label: 'List Items',
                  fields: [
                    {
                      name: 'text',
                      type: 'textarea',
                      required: true,
                    },
                  ],
                  admin: {
                    description: 'Add items to the numbered list',
                  },
                },
              ],
            },
            {
              name: 'content',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              label: 'Post Content',
              required: true,
            },
          ],
        },
        {
          label: 'Location',
          fields: [
            {
              name: 'country',
              type: 'relationship',
              relationTo: 'countries',
              required: true,
              admin: {
                description: 'Select the country this post is about',
              },
            },
            {
              name: 'tags',
              type: 'array',
              fields: [
                {
                  name: 'tag',
                  type: 'text',
                },
              ],
              label: 'Tags',
            },
          ],
        },
        {
          label: 'Related Content',
          fields: [
            {
              name: 'relatedPosts',
              type: 'relationship',
              admin: {
                description: 'Manually select related posts',
              },
              filterOptions: ({ id }) => {
                return {
                  id: {
                    not_in: [id],
                  },
                }
              },
              hasMany: true,
              relationTo: 'posts',
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
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
      ],
    },
    {
      name: 'sourceUrl',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Paste article URL and click "Generate Post" below to auto-generate content',
      },
      label: 'Source Article URL',
    },
    {
      name: 'generateButton',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '/collections/Posts/GenerateButton',
        },
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
        description: 'Date shown in post lists (defaults to publish date)',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
      required: true,
    },
    {
      name: 'authors',
      type: 'relationship',
      admin: {
        position: 'sidebar',
        description: 'Primary authors of this post',
      },
      hasMany: true,
      relationTo: 'users',
    },
    {
      name: 'submittedBy',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Name of person who submitted this (e.g., "Zara Swanson")',
      },
    },
    {
      name: 'source',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Source of the post (e.g., "John Doe")',
      },
    },
    // This field is only used to populate the user data via the `populateAuthors` hook
    {
      name: 'populatedAuthors',
      type: 'array',
      access: {
        update: () => false,
      },
      admin: {
        disabled: true,
        readOnly: true,
      },
      fields: [
        {
          name: 'id',
          type: 'text',
        },
        {
          name: 'name',
          type: 'text',
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Feature this post (appears first in lists)',
      },
    },
    {
      name: 'isHot',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Mark this post as Hot (trending)',
      },
    },
    {
      name: 'isStories',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Mark this post as a Story',
      },
    },
    {
      name: 'viewCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Number of times this post has been viewed',
      },
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidatePost],
    afterRead: [populateAuthors],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
