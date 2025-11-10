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
      const normalizedCountrySlug = country?.slug ? country.slug.replace(/[^a-zA-Z0-9]/g, "") : ""
      const path = normalizedCountrySlug
        ? `/${normalizedCountrySlug}/${doc.slug}`
        : `/${doc.slug}`

      payload.logger.info(`Revalidating post at path: ${path}`)

      revalidatePath(path)
      revalidatePath('/') // Revalidate home page to show updated posts
      revalidateTag('posts-sitemap')
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const country = typeof previousDoc.country === 'object' ? previousDoc.country : null
      const normalizedCountrySlug = country?.slug ? country.slug.replace(/[^a-zA-Z0-9]/g, "") : ""
      const oldPath = normalizedCountrySlug
        ? `/${normalizedCountrySlug}/${previousDoc.slug}`
        : `/${previousDoc.slug}`

      payload.logger.info(`Revalidating old post at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidatePath('/') // Revalidate home page
      revalidateTag('posts-sitemap')
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    const country = typeof doc.country === 'object' ? doc.country : null
    const normalizedCountrySlug = country?.slug ? country.slug.replace(/[^a-zA-Z0-9]/g, "") : ""
    const path = normalizedCountrySlug
      ? `/${normalizedCountrySlug}/${doc.slug}`
      : `/${doc.slug}`

    revalidatePath(path)
    revalidatePath('/') // Revalidate home page
    revalidateTag('posts-sitemap')
  }

  return doc
}
