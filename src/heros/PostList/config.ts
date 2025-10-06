// heros/PostList/config.ts
import type { Block } from 'payload'

export const PostListHero: Block = {
  slug: 'postList',
  interfaceName: 'PostListHero',
  labels: {
    singular: 'Post List',
    plural: 'Post Lists',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Getting Started',
      admin: {
        description: 'Main heading for the post list section',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      defaultValue: "To get started with our documentation, please navigate through the sections using the sidebar on the left. Here's a quick overview of the available sections:",
      admin: {
        description: 'Introductory text shown above category tabs',
      },
    },
    {
      name: 'categories',
      type: 'array',
      label: 'Category Tabs',
      minRows: 1,
      maxRows: 6,
      admin: {
        description: 'Tab navigation for filtering posts by category',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'Display label for the tab (e.g., "New", "Hot")',
          },
        },
        {
          name: 'icon',
          type: 'select',
          required: true,
          options: [
            { label: '🔥 New', value: 'new' },
            { label: '🔥 Hot', value: 'hot' },
            { label: '📖 Stories', value: 'stories' },
            { label: '✉️ Subscribe', value: 'subscribe' },
            { label: '⭐ Featured', value: 'featured' },
            { label: '📝 All', value: 'all' },
          ],
          admin: {
            description: 'Icon to display next to the label',
          },
        },
        {
          name: 'filterType',
          type: 'select',
          required: true,
          defaultValue: 'category',
          options: [
            { label: 'Filter by Category', value: 'category' },
            { label: 'Show Featured Only', value: 'featured' },
            { label: 'Show All Posts', value: 'all' },
          ],
        },
        {
          name: 'filterCategories',
          type: 'relationship',
          relationTo: 'categories',
          hasMany: true,
          admin: {
            condition: (_, siblingData) => siblingData?.filterType === 'category',
            description: 'Select categories to filter posts',
          },
        },
        {
          name: 'sortBy',
          type: 'select',
          defaultValue: 'publishedAt',
          options: [
            { label: 'Published Date (Newest First)', value: 'publishedAt' },
            { label: 'Published Date (Oldest First)', value: 'publishedAt_asc' },
            { label: 'Title (A-Z)', value: 'title' },
            { label: 'Most Viewed', value: 'viewCount' },
          ],
        },
      ],
    },
    {
      name: 'postsPerPage',
      type: 'number',
      defaultValue: 20,
      min: 5,
      max: 100,
      admin: {
        description: 'Number of posts to display per page',
      },
    },
    {
      name: 'groupByDate',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Group posts by date (e.g., "Sep 16", "Sep 15")',
      },
    },
    {
      name: 'showSubmitter',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show "Submitted by" text below posts',
      },
    },
    {
      name: 'dateFormat',
      type: 'select',
      defaultValue: 'short',
      options: [
        { label: 'Short (Sep 16)', value: 'short' },
        { label: 'Long (September 16)', value: 'long' },
        { label: 'Full (Sep 16, 2024)', value: 'full' },
      ],
      admin: {
        description: 'Format for displaying dates',
      },
    },
    {
      name: 'enablePagination',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Enable pagination for posts',
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'gray',
      options: [
        { label: 'Gray', value: 'gray' },
        { label: 'White', value: 'white' },
        { label: 'Light', value: 'light' },
      ],
      admin: {
        description: 'Background color for the post list section',
      },
    },
  ],
}