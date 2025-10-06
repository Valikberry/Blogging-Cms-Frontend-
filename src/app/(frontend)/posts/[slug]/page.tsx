// app/(frontend)/posts/[slug]/page.tsx
import React from 'react'
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
  const payload = await getPayload({ config: configPromise })
  const { slug } = await params

  const result = await payload.find({
    collection: 'posts',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  const post = result.docs[0]

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
  const payload = await getPayload({ config: configPromise })
  const { slug } = await params

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

  const post = result.docs[0] as Post

  if (!post) {
    notFound()
  }

  // Note: View count increment should be done via API route or client-side
  // to avoid issues with static generation and caching
  // Consider creating an API endpoint: /api/posts/[id]/increment-view

  return <PostDetail post={post} />
}