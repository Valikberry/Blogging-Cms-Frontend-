// components/PostListHero/Component.client.tsx
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Flame, Book, Bell, Sparkles, Star, FileText } from 'lucide-react'

interface Post {
  id: string
  title: string
  slug: string
  publishedAt: string
  rawDate: string
  submittedBy?: string | null
}

interface Category {
  label: string
  icon: string
  posts: Post[]
}

interface PostListClientProps {
  title: string
  description?: string
  categories: Category[]
  groupByDate?: boolean
  showSubmitter?: boolean
}

const iconMap: Record<string, React.ElementType> = {
  new: Sparkles,
  hot: Flame,
  fire: Sparkles,
  flame: Flame,
  stories: Book,
  book: Book,
  subscribe: Bell,
  bell: Bell,
  featured: Star,
  all: FileText,
}

// Group posts by date
function groupPostsByDate(posts: Post[]) {
  const grouped: { [key: string]: Post[] } = {}
  
  posts.forEach((post) => {
    const dateKey = post.publishedAt
    if (!grouped[dateKey]) {
      grouped[dateKey] = []
    }
    grouped[dateKey].push(post)
  })
  
  return grouped
}

export function PostListClient({
  title,
  description,
  categories,
  groupByDate = true,
  showSubmitter = true,
}: PostListClientProps) {
  const [activeTab, setActiveTab] = useState(0)
  const activeCategory = categories[activeTab] || categories[0]

  // Group posts by date if enabled
  const groupedPosts = groupByDate && activeCategory
    ? groupPostsByDate(activeCategory.posts)
    : null

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">{title}</h1>
        {description && (
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        )}
      </div>

      {/* Category Tabs */}
      {categories.length > 0 && (
        <div className="bg-gray-100 rounded-sm p-1 mb-4 inline-flex gap-1">
          {categories.map((category, index) => {
            const Icon = iconMap[category.icon as keyof typeof iconMap] || FileText
            return (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-sm font-medium transition-all ${
                  activeTab === index
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{category.label}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Posts List */}
      {activeCategory && (
        <div className="bg-gray-100 rounded-sm p-4">
          {groupByDate && groupedPosts ? (
            // Grouped by date view
            <div className="space-y-0">
              {Object.entries(groupedPosts).map(([date, posts], groupIndex) => (
                <div key={date}>
                  {posts.map((post, postIndex) => (
                    <div key={post.id}>
                      <Link
                        href={`/posts/${post.slug}`}
                        className="block hover:bg-gray-200 rounded-sm px-2 py-1.5 transition-colors group"
                      >
                        <div className="flex gap-3 items-start">
                          <span className="text-red-600 font-medium text-xs shrink-0 pt-0.5 min-w-[45px]">
                            {post.publishedAt}
                          </span>
                          <span className="text-gray-900 text-sm group-hover:underline flex-1">
                            {post.title}
                          </span>
                        </div>
                      </Link>
                      {showSubmitter && post.submittedBy && (
                        <div className="px-2 pb-1.5 ml-[57px]">
                          <span className="text-xs text-gray-500 italic">
                            Submitted by: {post.submittedBy}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            // Simple list view
            <div className="space-y-0">
              {activeCategory.posts.map((post) => (
                <div key={post.id}>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="block hover:bg-gray-200 rounded-sm px-2 py-1.5 transition-colors group"
                  >
                    <div className="flex gap-3 items-start">
                      <span className="text-red-600 font-medium text-xs shrink-0 pt-0.5 min-w-[45px]">
                        {post.publishedAt}
                      </span>
                      <span className="text-gray-900 text-sm group-hover:underline flex-1">
                        {post.title}
                      </span>
                    </div>
                  </Link>
                  {showSubmitter && post.submittedBy && (
                    <div className="px-2 pb-1.5 ml-[57px]">
                      <span className="text-xs text-gray-500 italic">
                        Submitted by: {post.submittedBy}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {activeCategory.posts.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">
              No posts found in this category.
            </div>
          )}
        </div>
      )}
    </div>
  )
}