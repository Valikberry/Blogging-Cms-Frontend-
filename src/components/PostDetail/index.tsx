// components/PostDetail/index.tsx
'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import RichText from '@/components/RichText'
import type { Post } from '@/payload-types'
import {
  Facebook,
  Twitter,
  Mail,
  Lightbulb,
  Zap,
  Flame,
  Star,
  Diamond,
  Target,
  Bell,
  Pin,
  Globe,
} from 'lucide-react'

interface PostDetailProps {
  post: Post
}

const iconMap: Record<string, React.ElementType> = {
  lightbulb: Lightbulb,
  lightning: Zap,
  fire: Flame,
  star: Star,
  diamond: Diamond,
  target: Target,
  bell: Bell,
  pin: Pin,
}

const backgroundColors = {
  purple: 'bg-indigo-50 border-indigo-200',
  green: 'bg-green-50 border-green-200',
  yellow: 'bg-yellow-50 border-yellow-200',
  red: 'bg-red-50 border-red-200',
  gray: 'bg-gray-50 border-gray-200',
}

const iconColors = {
  purple: 'text-indigo-600',
  green: 'text-green-600',
  yellow: 'text-yellow-600',
  red: 'text-red-600',
  gray: 'text-gray-600',
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
      <div className="max-w-4xl mx-auto px-4 mb-6xx">
        {/* Post Title */}
        <h1 className="text-[24px] font-bold text-gray-900 mb-2 leading-tight">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-[14px] text-gray-600  leading-relaxed mb-3">{post.excerpt}</p>
        )}

        {/* Source */}
        {post.source && (
          <div className="flex items-center gap-2  text-sm text-gray-600 mb-1">
            <Globe className="w-4 h-4" />
            <span className='text-[12px]'>Source: {post.source}</span>
          </div>
        )}

        {/* Hero Image */}
        {post.heroImage && typeof post.heroImage === 'object' && (
          <div className="mb-6 rounded-xl overflow-hidden">
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
          <div className="mb-6">
            <div
              className={`relative w-full overflow-hidden rounded-lg bg-gray-800 ${
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

        {/* Author Info and Share Buttons */}
        <div className="flex items-center justify-between py-1 border-b border-gray-200 mb-2">
          <div className="flex items-center gap-3">
            {authorName && (
              <>
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  <span className="text-base font-semibold text-gray-600">
                    {authorName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{authorName}</p>
                  {publishedDate && <p className="text-xs text-gray-500">{publishedDate}</p>}
                </div>
              </>
            )}
          </div>

          <ShareButtons post={post} />
        </div>
        {/* Post Content */}
        <div className="prose prose-base max-w-none mb-4 text-gray-700">
          <RichText content={post.content} />
        </div>

        {/* Callout Sections */}
        {post.calloutSections && post.calloutSections.length > 0 && (
          <div className="space-y-6 mb-12">
            {post.calloutSections.map((section: any, index: number) => {
              const Icon = section.icon && section.icon !== 'none' ? iconMap[section.icon] : null
              const bgClass =
                backgroundColors[section.backgroundColor as keyof typeof backgroundColors] ||
                backgroundColors.purple
              const iconColor =
                iconColors[section.backgroundColor as keyof typeof iconColors] || iconColors.purple

              return (
                <div key={index} className={`rounded-2xl border-2 p-6 ${bgClass}`}>
                  {/* Badge with Icon */}
                  {(section.badge || Icon) && (
                    <div className="flex items-center gap-2 mb-4">
                      {Icon && <Icon className={`w-5 h-5 ${iconColor}`} />}
                      {section.badge && (
                        <span className={`text-sm font-semibold ${iconColor}`}>{section.badge}</span>
                      )}
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{section.title}</h3>

                  {/* Numbered List */}
                  {section.items && section.items.length > 0 && (
                    <ol className="space-y-3">
                      {section.items.map((item: any, itemIndex: number) => (
                        <li key={item.id || itemIndex} className="flex gap-3 text-sm">
                          <span className="text-gray-900 font-bold flex-shrink-0">
                            {itemIndex + 1}.
                          </span>
                          <span className="text-gray-700 leading-relaxed">{item.text}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tagItem: any, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
              >
                #{tagItem.tag}
              </span>
            ))}
          </div>
        )}

        {/* Related Posts */}
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <div className="border-t border-gray-200 pt-8 mt-12">
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
                  <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
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
    <div className="flex items-center gap-2">
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        aria-label="Share on Facebook"
      >
        <Facebook className="w-5 h-5" />
      </a>

      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-md bg-gray-700 text-white hover:bg-gray-800 transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter className="w-5 h-5" />
      </a>

      <a
        href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}
        className="p-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        aria-label="Share via Email"
      >
        <Mail className="w-5 h-5" />
      </a>
    </div>
  )
}
