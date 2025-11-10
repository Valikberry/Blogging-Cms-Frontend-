import React, { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { PostDetail } from '@/components/PostDetail'
import type { Post } from '@/payload-types'
import type { Metadata } from 'next'

interface PostPageProps {
  params: Promise<{
    slug: string // normalized country slug (no spaces/special chars)
    postSlug: string // post slug
  }>
}

// Helper function to normalize slug (remove spaces and special characters)
function normalizeSlug(slug: string): string {
  return slug.replace(/[^a-zA-Z0-9]/g, '')
}

// Revalidate post pages every 60 seconds
export const revalidate = 60

// Cache the post query to prevent duplicate fetches
const queryPostBySlug = cache(async (postSlug: string, normalizedCountrySlug: string) => {
  const payload = await getPayload({ config: configPromise })

  // First, fetch all countries to find the one matching the normalized slug
  const countriesResult = await payload.find({
    collection: 'countries',
    limit: 1000,
  })

  const matchingCountry = countriesResult.docs.find(
    (country: any) => normalizeSlug(country.slug) === normalizedCountrySlug,
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

  const params: Array<{ slug: string; postSlug: string }> = []

  for (const post of posts.docs) {
    const country = typeof post.country === 'string' ? null : post.country
    if (country && country.slug) {
      params.push({
        slug: normalizeSlug(country.slug),
        postSlug: post.slug || '',
      })
    }
  }

  return params
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { postSlug, slug } = await params
  const post = await queryPostBySlug(postSlug, slug)

  if (!post) return {}

  const siteUrl =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    'https://askgeopolitics.com'

  const canonicalUrl = `${siteUrl}/${slug}/${postSlug}`
  const defaultOgImage = `${siteUrl}/default-share-image.jpg`

  const ogImage =
    post.heroImage && typeof post.heroImage === 'object' && post.heroImage.url
      ? post.heroImage
      : post.meta?.image && typeof post.meta.image === 'object' && post.meta.image.url
        ? post.meta.image
        : null

  let ogImageUrl = ogImage?.url || defaultOgImage
  if (!ogImageUrl.startsWith('http')) ogImageUrl = `${siteUrl}${ogImageUrl}`

  const metadata: Metadata = {
    title: post.meta?.title || post.title,
    description: post.meta?.description || post.excerpt || undefined,
    metadataBase: new URL(siteUrl),
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: post.meta?.title || post.title,
      description: post.meta?.description || post.excerpt || undefined,
      url: canonicalUrl,
      siteName: 'Ask Geopolitics',
      type: 'article',
      locale: 'en_US',
      images: [
        {
          url: ogImageUrl,
          width: ogImage?.width || 1200,
          height: ogImage?.height || 630,
          alt: post.title,
        },
      ],
      publishedTime: post.publishedAt || undefined,
      authors: post.submittedBy ? [post.submittedBy] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta?.title || post.title,
      description: post.meta?.description || post.excerpt || undefined,
      images: [ogImageUrl],
      creator: '@askgeopolitics',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  }

  return metadata
}

export default async function PostPage({ params }: PostPageProps) {
  const { postSlug, slug } = await params
  const post = await queryPostBySlug(postSlug, slug)

  if (!post) {
    notFound()
  }

  // Get the site URL
  const siteUrl =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    'https://askgeopolitics.com'

  // Build canonical URL
  const canonicalUrl = `${siteUrl}/${slug}/${postSlug}`

  // Get image URL
  const heroImage = post.heroImage && typeof post.heroImage === 'object' ? post.heroImage : null
  const metaImage = post.meta?.image && typeof post.meta.image === 'object' ? post.meta.image : null
  const imageObject = heroImage || metaImage
  let imageUrl = imageObject?.url || ''
  if (imageUrl && !imageUrl.startsWith('http')) {
    imageUrl = `${siteUrl}${imageUrl}`
  }

  // Get article body (first 500 chars of content as a summary)
  const articleBody = post.excerpt || post.meta?.description || ''

  // Get country/continent for article section
  const countryObj = typeof post.country === 'object' ? post.country : null
  const continentObj =
    countryObj && typeof countryObj.continent === 'object' ? countryObj.continent : null
  const articleSection = continentObj?.name || countryObj?.name || 'Geopolitics'

  // JSON-LD structured data for NewsArticle
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': `${canonicalUrl}#article`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    headline: post.title,
    alternativeHeadline: post.meta?.title || post.title,
    description: post.meta?.description || post.excerpt || '',
    articleBody: articleBody,
    image: imageUrl
      ? {
          '@type': 'ImageObject',
          url: imageUrl,
          width: imageObject?.width || 1200,
          height: imageObject?.height || 675,
          caption: heroImage?.alt || post.title,
        }
      : undefined,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt || post.publishedAt || post.createdAt,
    author: {
      '@type': 'Organization',
      name: 'AskGeopolitics',
      url: siteUrl,
    },
    publisher: {
      '@type': 'NewsMediaOrganization',
      '@id': `${siteUrl}#organization`,
      name: 'AskGeopolitics',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/api/media/file/Ask%20Geopolitics%20Logo`,
        width: 600,
        height: 600,
      },
    },
    articleSection: articleSection,
    keywords:
      post.tags?.map((tag: any) => (typeof tag === 'object' ? tag.name : tag)).filter(Boolean) ||
      [],
    inLanguage: 'en',
    isAccessibleForFree: true,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostDetail post={post} />
    </>
  )
}
