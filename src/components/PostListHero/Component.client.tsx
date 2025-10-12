'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Flame, Book, Bell, Sparkles, Star, FileText, ChevronRight } from 'lucide-react'

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

interface Country {
  id: string
  name: string
  slug: string
  categories: Category[]
}

interface PostListClientProps {
  title: string
  description?: string
  countries: Country[]
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
  countries,
  groupByDate = true,
  showSubmitter = true,
}: PostListClientProps) {
  const [activeCountryIndex, setActiveCountryIndex] = useState(0)
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0)

  const activeCountry = countries[activeCountryIndex] || countries[0]
  const activeCategory =
    activeCountry?.categories[activeCategoryIndex] || activeCountry?.categories[0]

  // Group posts by date if enabled
  const groupedPosts = groupByDate && activeCategory ? groupPostsByDate(activeCategory.posts) : null

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-gray-900 text-3xl font-bold mb-1">{title}</h1>
          <p className="text-gray-500 text-sm">{description}</p>
        </div>

        {/* Country Buttons */}
        {countries.length > 0 && (
          <div className="flex gap-3 overflow-x-auto mb-6 pb-2">
            {countries.length > 0 && (
              <div className="flex gap-3 overflow-x-auto mb-6 pb-2">
                {countries.map((country, index) => (
                  <button
                    key={country.id}
                    onClick={() => {
                      setActiveCountryIndex(index)
                      setActiveCategoryIndex(0)
                    }}
                    className={`px-5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors border ${
                      activeCountryIndex === index
                        ? 'bg-[#6366f1]/10 text-[#6366f1] border-[#6366f1]'
                        : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
                    }`}
                  >
                    {country.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Category Tab Navigation */}
        {activeCountry && activeCountry.categories.length > 0 && (
          <div className="border-b border-gray-300 mb-6">
            <nav className="flex gap-8 px-1">
              {activeCountry.categories.map((category, index) => {
                const Icon = iconMap[category.icon as keyof typeof iconMap] || FileText
                return (
                  <button
                    key={index}
                    onClick={() => setActiveCategoryIndex(index)}
                    className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors relative ${
                      activeCategoryIndex === index
                        ? 'text-indigo-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{category.label}</span>
                    {activeCategoryIndex === index && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                    )}
                  </button>
                )
              })}
            </nav>
          </div>
        )}

        {/* Posts List */}
        {activeCategory && (
          <div className="bg-white rounded-lg border border-gray-200">
            {groupByDate && groupedPosts ? (
              // Grouped by date view
              <div>
                {Object.entries(groupedPosts).map(([date, posts], groupIndex) => (
                  <div key={date}>
                    {posts.map((post, postIndex) => (
                      <div
                        key={post.id}
                        className={
                          groupIndex > 0 || postIndex > 0 ? 'border-t border-gray-100' : ''
                        }
                      >
                        <Link
                          href={`/posts/${post.slug}`}
                          className="block hover:bg-gray-50 transition-colors"
                        >
                          <div className="px-6 py-4">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex gap-4 items-start flex-1 min-w-0">
                                <span className="text-indigo-600 font-medium text-sm shrink-0 pt-0.5">
                                  {post.publishedAt}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-gray-900 font-medium text-base leading-snug">
                                    {post.title}
                                  </h3>
                                  {showSubmitter && post.submittedBy && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      Submitted by {post.submittedBy}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              // Simple list view
              <div>
                {activeCategory.posts.map((post: any, index: number) => (
                  <div key={post.id} className={index > 0 ? 'border-t border-gray-100' : ''}>
                    <Link
                      href={`/posts/${post.slug}`}
                      className="block hover:bg-gray-50 transition-colors"
                    >
                      <div className="px-6 py-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex gap-4 items-start flex-1 min-w-0">
                            <span className="text-indigo-600 font-medium text-sm shrink-0 pt-0.5">
                              {post.publishedAt}
                            </span>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-gray-900 font-medium text-base leading-snug">
                                {post.title}
                              </h3>
                              {showSubmitter && post.submittedBy && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Submitted by {post.submittedBy}
                                </p>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {activeCategory.posts.length === 0 && (
              <div className="text-center py-12 text-gray-500 text-sm">
                No posts found in this category.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
