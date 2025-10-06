// heros/config.ts
import type { Field } from 'payload'
import { PostListHero } from './PostList/config'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'default',
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Post List',
          value: 'postList',
        },
        // ... other hero types
      ],
    },
    // Add conditional fields for postList type
    {
      name: 'postListConfig',
      type: 'group',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'postList',
      },
      fields: PostListHero.fields,
    },
    // ... other hero fields
  ],
}