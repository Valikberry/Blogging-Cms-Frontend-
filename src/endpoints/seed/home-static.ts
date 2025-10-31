import type { RequiredDataFromCollectionSlug } from 'payload'

// Used for pre-seeded content so that the homepage is not empty
export const homeStatic: RequiredDataFromCollectionSlug<'pages'> = {
  slug: 'home',
  _status: 'published',
  hero: {
    type: 'postList',
    postListConfig: {
      title: 'Getting Started',
      description: "To get started with our documentation, please navigate through the sections using the sidebar on the left. Here's a quick overview of the available sections:",
      postsPerPage: 20,
      groupByDate: true,
      showSource: true,
      dateFormat: 'short',
    }
  },
  meta: {
    description: 'An open-source website built with Payload and Next.js.',
    title: 'Payload Website Template',
  },
  title: 'Home',
  layout: [],
}
