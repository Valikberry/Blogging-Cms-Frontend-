import PageTemplate, { generateMetadata } from './[slug]/page'

export default PageTemplate
export { generateMetadata }

// Revalidate the home page every 60 seconds
export const revalidate = 60