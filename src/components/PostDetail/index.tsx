// components/PostDetail/index.tsx
'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import RichText  from '@/components/RichText'
import type { Post } from '@/payload-types'
import { Facebook, Twitter, Mail } from 'lucide-react'

interface PostDetailProps {
  post: Post
}

export function PostDetail({ post }: PostDetailProps) {
  // Increment view count on mount
  useEffect(() => {
    const incrementViewCount = async () => {
      try {
        await fetch(`/api/posts/${post.id}/increment-view`, {
          method: 'POST',
        })
      } catch (error) {
        console.error('Failed to increment view count:', error)
      }
    }

    incrementViewCount()
  }, [post.id])
  const authorName =
    post.submittedBy ||
    (post.populatedAuthors && post.populatedAuthors.length > 0
      ? post.populatedAuthors[0].name
      : null)

  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <article className="min-h-screen bg-white">
      {/* Breadcrumb Navigation */}
      <nav className="max-w-4xl mx-auto px-4 py-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="#" className="hover:text-gray-900 transition-colors">
            Posts
          </Link>
          {post.categories && post.categories.length > 0 && (
            <>
              <span>/</span>
              <Link
                href="#"
                className="text-orange-500 hover:text-orange-600 transition-colors"
              >
                {typeof post.categories[0] === 'object' ? post.categories[0].title : ''}
              </Link>
            </>
          )}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Post Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Post Metadata */}
        {post.excerpt && (
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">{post.excerpt}</p>
        )}

        <div className="flex items-center gap-4 mb-8 text-sm text-gray-500">
          {authorName && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  {authorName.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="font-medium text-gray-700">By {authorName}</span>
            </div>
          )}
          {publishedDate && <span>{publishedDate}</span>}
        </div>

        {/* Hero Image */}
        {post.heroImage && typeof post.heroImage === 'object' && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.heroImage.url || ''}
              alt={post.heroImage.alt || post.title}
              width={post.heroImage.width || 1200}
              height={post.heroImage.height || 600}
              className="w-full h-auto"
              priority
            />
          </div>
        )}

        {/* Video Embed */}
        {post.videoEmbed?.enabled && post.videoEmbed.embedUrl && (
          <div className="mb-8">
            <div
              className={`relative w-full overflow-hidden rounded-lg ${
                post.videoEmbed.aspectRatio === '16-9'
                  ? 'aspect-video'
                  : post.videoEmbed.aspectRatio === '4-3'
                    ? 'aspect-[4/3]'
                    : 'aspect-square'
              }`}
            >
              <iframe
                src={post.videoEmbed.embedUrl}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={post.title}
              />
            </div>
          </div>
        )}

        {/* Share Buttons */}

        <ShareButtons post={post} />
        {/* Post Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <RichText content={post.content} />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tagItem: any, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                #{tagItem.tag}
              </span>
            ))}
          </div>
        )}

        {/* Related Posts */}
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {post.relatedPosts.map((relatedPost: any) => (
                <Link
                  key={relatedPost.id}
                  href={`/posts/${relatedPost.slug}`}
                  className="group block"
                >
                  {relatedPost.heroImage && typeof relatedPost.heroImage === 'object' && (
                    <div className="mb-3 rounded-lg overflow-hidden">
                      <Image
                        src={relatedPost.heroImage.url || ''}
                        alt={relatedPost.heroImage.alt || relatedPost.title}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {relatedPost.title}
                  </h3>
                  {relatedPost.excerpt && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{relatedPost.excerpt}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}

function ShareButtons({ post }: { post: any }) {
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href)
    }
  }, [])

  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(post.title)

  return (
    <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-200">
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        aria-label="Share on Facebook"
      >
        <Facebook className="w-4 h-4" />
      </a>

      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter className="w-4 h-4" />
      </a>

      <a
        href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}
        className="p-2 rounded-full bg-gray-600 text-white hover:bg-gray-700 transition-colors"
        aria-label="Share via Email"
      >
        <Mail className="w-4 h-4" />
      </a>
    </div>
  )
}
