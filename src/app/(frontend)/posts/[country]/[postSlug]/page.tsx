import React, { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { PostDetail } from '@/components/PostDetail'
import type { Post } from '@/payload-types'
import type { Metadata } from 'next'

interface PostPageProps {
  params: Promise<{
    country: string // normalized country slug (no spaces/special chars)
    postSlug: string // post slug
  }>
}

// Helper function to normalize slug (remove spaces and special characters)
function normalizeSlug(slug: string): string {
  return slug.replace(/[^a-zA-Z0-9]/g, "")
}

// Cache the post query to prevent duplicate fetches
const queryPostBySlug = cache(async (postSlug: string, normalizedCountrySlug: string) => {
  const payload = await getPayload({ config: configPromise })

  // First, fetch all countries to find the one matching the normalized slug
  const countriesResult = await payload.find({
    collection: 'countries',
    limit: 1000,
  })

  const matchingCountry = countriesResult.docs.find(
    (country: any) => normalizeSlug(country.slug) === normalizedCountrySlug
  )

  if (!matchingCountry) {
    return undefined
  }

  // Now fetch the post
  const result = await payload.find({
    collection: 'posts',
    where: {
      slug: {
        equals: postSlug,
      },
      country: {
        equals: matchingCountry.id,
      },
      _status: {
        equals: 'published',
      },
    },
    limit: 1,
    depth: 2,
  })

  return result.docs[0] as Post | undefined
})

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    limit: 1000,
    where: {
      _status: {
        equals: 'published',
      },
    },
    depth: 1,
  })

  const params: Array<{ country: string; postSlug: string }> = []

  for (const post of posts.docs) {
    const country = typeof post.country === 'string' ? null : post.country
    if (country && country.slug) {
      params.push({
        country: normalizeSlug(country.slug),
        postSlug: post.slug || '',
      })
    }
  }

  return params
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { postSlug, country } = await params
  const post = await queryPostBySlug(postSlug, country)

  if (!post) {
    return {}
  }

  // Get the site URL
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL ||
                  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
                  'https://askgeopolitics.com'

  // Build canonical URL for this post
  const canonicalUrl = `${siteUrl}/posts/${country}/${postSlug}`

  // Get OG image with dimensions
  const ogImage = post.meta?.image && typeof post.meta.image === 'object'
    ? post.meta.image
    : post.heroImage && typeof post.heroImage === 'object'
    ? post.heroImage
    : null

  // Ensure image URL is absolute
  let ogImageUrl = ogImage?.url || ''
  if (ogImageUrl && !ogImageUrl.startsWith('http')) {
    ogImageUrl = `${siteUrl}${ogImageUrl}`
  }

  const ogImageWidth = ogImage?.width || 1200
  const ogImageHeight = ogImage?.height || 630

  return {
    title: post.meta?.title || post.title,
    description: post.meta?.description || post.excerpt || undefined,
    openGraph: {
      title: post.meta?.title || post.title,
      description: post.meta?.description || post.excerpt || undefined,
      url: canonicalUrl,
      siteName: 'Ask Geopolitics',
      type: 'article',
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl,
              width: ogImageWidth,
              height: ogImageHeight,
              alt: post.title,
            },
          ]
        : [],
      publishedTime: post.publishedAt || undefined,
      authors: post.submittedBy || undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta?.title || post.title,
      description: post.meta?.description || post.excerpt || undefined,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { postSlug, country } = await params
  const post = await queryPostBySlug(postSlug, country)

  if (!post) {
    notFound()
  }

  return <PostDetail post={post} />
}
