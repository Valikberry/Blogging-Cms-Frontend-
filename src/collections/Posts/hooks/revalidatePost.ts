import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import type { Post } from '../../../payload-types'

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const country = typeof doc.country === 'object' ? doc.country : null
      const continent = country && typeof country.continent === 'object' ? country.continent : null
      const path = country && continent
        ? `/${continent.slug}/${country.slug}/${doc.slug}`
        : `/${doc.slug}`

      payload.logger.info(`Revalidating post at path: ${path}`)

      revalidatePath(path)
      revalidateTag('posts-sitemap')
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const country = typeof previousDoc.country === 'object' ? previousDoc.country : null
      const continent = country && typeof country.continent === 'object' ? country.continent : null
      const oldPath = country && continent
        ? `/${continent.slug}/${country.slug}/${previousDoc.slug}`
        : `/${previousDoc.slug}`

      payload.logger.info(`Revalidating old post at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('posts-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const country = typeof doc.country === 'object' ? doc.country : null
    const continent = country && typeof country.continent === 'object' ? country.continent : null
    const path = country && continent
      ? `/${continent.slug}/${country.slug}/${doc.slug}`
      : `/${doc.slug}`

    revalidatePath(path)
    revalidateTag('posts-sitemap')
  }

  return doc
}
