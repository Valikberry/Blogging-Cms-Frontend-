import React, { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { PostDetail } from '@/components/PostDetail'
import type { Post } from '@/payload-types'
import type { Metadata } from 'next'

interface PostPageProps {
  params: Promise<{
    slug: string // continent slug
    country: string // country slug
    postSlug: string // post slug
  }>
}

// Cache the post query to prevent duplicate fetches
const queryPostBySlug = cache(async (postSlug: string, countrySlug: string) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    where: {
      slug: {
        equals: postSlug,
      },
      _status: {
        equals: 'published',
      },
    },
    limit: 1,
    depth: 2,
  })

  const post = result.docs[0] as Post | undefined

  // Verify the post belongs to the correct country
  if (post) {
    const postCountry = typeof post.country === 'string' ? post.country : post.country?.slug
    if (postCountry !== countrySlug) {
      return undefined // Post doesn't belong to this country
    }
  }

  return post
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

  const params: Array<{ slug: string; country: string; postSlug: string }> = []

  for (const post of posts.docs) {
    const country = typeof post.country === 'string' ? null : post.country
    if (country) {
      const continent = typeof country.continent === 'string' ? null : country.continent
      params.push({
        slug: continent?.slug || '',
        country: country.slug || '',
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

  return {
    title: post.meta?.title || post.title,
    description: post.meta?.description || undefined,
    openGraph: {
      title: post.meta?.title || post.title,
      description: post.meta?.description || undefined,
      images: post.meta?.image
        ? [
            {
              url:
                typeof post.meta.image === 'object'
                  ? post.meta.image.url || ''
                  : '',
            },
          ]
        : [],
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
