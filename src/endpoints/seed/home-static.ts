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
    description: 'AskGeopolitics - Your source for global political insights and analysis.',
    title: 'AskGeopolitics',
  },
  title: 'Home',
  layout: [],
}
