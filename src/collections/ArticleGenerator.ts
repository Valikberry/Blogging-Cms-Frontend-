import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'
import { isAdminHidden } from '../access/isAdminHidden'

export const ArticleGenerator: CollectionConfig = {
  slug: 'article-generator',
  admin: {
    useAsTitle: 'sourceUrl',
    defaultColumns: ['sourceUrl', 'status', 'createdAt'],
    group: 'Tools',
    hidden: isAdminHidden,
    components: {
      edit: {
        PreviewButton: false,
        SaveButton: false,
        SaveDraftButton: false,
        PublishButton: false,
      },
    },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  fields: [
    {
      name: 'generateButton',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/ArticleGenerateButton',
        },
      },
    },
    {
      name: 'sourceUrl',
      type: 'text',
      required: true,
      label: 'Article URL',
      admin: {
        placeholder: 'https://example.com/article',
        description: 'Paste the URL of the article you want to generate content from',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
      ],
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Featured Image',
      admin: {
        description: 'AI-generated featured image for the article',
      },
    },
    {
      name: 'generatedContent',
      type: 'textarea',
      label: 'Generated Content',
      admin: {
        rows: 15,
        description: 'The AI-generated content - you can edit this after generation',
      },
    },
    {
      name: 'originalHeadline',
      type: 'text',
      label: 'Original Headline',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'error',
      type: 'textarea',
      label: 'Error Message',
      admin: {
        readOnly: true,
        condition: (data) => data.status === 'failed',
      },
    },
  ],
}
