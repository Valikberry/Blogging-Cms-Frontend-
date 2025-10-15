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
        description: 'Introductory text shown above filter tabs',
      },
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
      name: 'showSource',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show "From" text with source below posts',
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