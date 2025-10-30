// app/(frontend)/posts/[slug]/page.tsx
import React, { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { PostDetail } from '@/components/PostDetail'
import type { Post } from '@/payload-types'

interface PostPageProps {
  params: Promise<{
    slug: string
  }>
}

// Cache the post query to prevent duplicate fetches
const queryPostBySlug = cache(async (slug: string) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    where: {
      slug: {
        equals: slug,
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
  })

  return posts.docs.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params
  const post = await queryPostBySlug(slug)

  if (!post) {
    return {}
  }

  return {
    title: post.meta?.title || post.title,
    description: post.meta?.description,
    openGraph: {
      title: post.meta?.title || post.title,
      description: post.meta?.description,
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
  const { slug } = await params
  const post = await queryPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return <PostDetail post={post} />
}