// components/PostListHero/Component.client.tsx
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Flame, Book, Bell, Sparkles, Star, FileText } from 'lucide-react'
import { Button } from '../ui/button'

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
  const groupedPosts = groupByDate && activeCategory ? groupPostsByDate(activeCategory.posts) : null
  console.log(categories)

  return (
    <div className="">
      {/* Header */}
      <div className="flex flex-col items-center  px-5 bg-white py-2 -mt-12">
        <h1 className="text-black-700 text-[17.5px] font-bold text-center">{title}</h1>
        <h2 className="text-black-700 text-sm font-medium text-center">{description}</h2>
      </div>

      {/* Category Tabs */}
      {categories.length > 0 && (
        <div className="border border-gray-300 rounded-lg overflow-hidden mt-5 w-full bg-white">
          <div className="flex overflow-x-auto w-full">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant={activeTab === index ? 'default' : 'outline'}
                className={`px-4 py-2 text-sm border-none flex-shrink-0 ${
                  activeTab === index
                    ? 'bg-green-50 hover:bg-green-700 text-green-700 hover:text-white'
                    : 'bg-white hover:bg-green-700 text-gray-700 hover:text-white'
                }`}
                // onClick={() => handleClick(category.id)}
              >
                <h3>{category.label}</h3>
              </Button>
            ))}
          </div>
        </div>
      )}

      <nav className="flex items-center gap-6  px-4 py-3">
        {categories.map((category, index) => {
          const Icon = iconMap[category.icon as keyof typeof iconMap] || FileText
          return (
            <a
              key={index}
              href="#"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="underline">{category.label}</span>
            </a>
          )
        })}
      </nav>
      {/* Posts List */}
      {activeCategory && (
        <div className="rounded-sm p-4">
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
              {activeCategory.posts.map((post: any) => (
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
