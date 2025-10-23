import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'

export const ArticleGenerator: CollectionConfig = {
  slug: 'article-generator',
  admin: {
    useAsTitle: 'sourceUrl',
    defaultColumns: ['sourceUrl', 'status', 'createdAt'],
    group: 'Tools',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  fields: [
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
      name: 'generatedContent',
      type: 'textarea',
      label: 'Generated Content',
      admin: {
        readOnly: true,
        rows: 15,
        description: 'The AI-generated content will appear here',
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
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        // Only trigger on create and if status is pending
        if (operation === 'create' && doc.status === 'pending') {
          // Trigger the generation in the background
          // We'll call the API endpoint
          try {
            const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
            fetch(`${baseUrl}/api/generate-article`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: doc.id,
                url: doc.sourceUrl,
              }),
            }).catch((err) => {
              console.error('Failed to trigger article generation:', err)
            })
          } catch (error) {
            console.error('Error triggering generation:', error)
          }
        }
        return doc
      },
    ],
  },
}
