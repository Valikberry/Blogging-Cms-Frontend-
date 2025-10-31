'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Flame, Book, ChevronRight, Edit, Mail } from 'lucide-react'

interface Post {
  id: string
  title: string
  slug: string
  publishedAt: string
  rawDate: string
  source?: string | null
  isHot?: boolean
  isStories?: boolean
}

interface Country {
  id: string
  name: string
  slug: string
  posts: Post[]
}

interface PostListClientProps {
  title: string
  description?: string
  countries: Country[]
  groupByDate?: boolean
  showSource?: boolean
  initialCountryId?: string | null
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

type FilterTab = 'new' | 'hot' | 'stories' | 'subscribe'

export function PostListClient({
  title,
  description,
  countries,
  groupByDate = true,
  showSource = true,
  initialCountryId,
}: PostListClientProps) {
  // Find the index of the initial country if provided
  const initialIndex = initialCountryId
    ? countries.findIndex((c) => c.id === initialCountryId)
    : 0
  const validInitialIndex = initialIndex >= 0 ? initialIndex : 0

  const [activeCountryIndex, setActiveCountryIndex] = useState(validInitialIndex)
  const [activeFilter, setActiveFilter] = useState<FilterTab>('new')
  const [email, setEmail] = useState('')
  const [subscribeMessage, setSubscribeMessage] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  const activeCountry = countries[activeCountryIndex] || countries[0]


  // Filter posts based on active filter tab
  const filteredPosts =
    activeCountry?.posts.filter((post) => {
      if (activeFilter === 'hot') return post.isHot
      if (activeFilter === 'stories') return post.isStories
      if (activeFilter === 'new') return true // Show all posts for "new"
      return true
    }) || []

  // Group posts by date if enabled
  const groupedPosts = groupByDate && filteredPosts ? groupPostsByDate(filteredPosts) : null

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubscribing(true)
    setSubscribeMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          source: 'blog-list',
          countryId: activeCountry?.id || null,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setMessageType('success')
        setSubscribeMessage(data.message || 'Thank you for subscribing!')
        setEmail('')
      } else {
        setMessageType('error')
        setSubscribeMessage(data.error || 'Failed to subscribe. Please try again.')
      }
    } catch (error) {
      console.error('Subscription error:', error)
      setMessageType('error')
      setSubscribeMessage('Network error. Please check your connection and try again.')
    } finally {
      setIsSubscribing(false)
      setTimeout(() => setSubscribeMessage(''), 5000)
    }
  }
console.log(countries);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-gray-900 text-[17.5px] font-medium mb-2">{title}</h1>
          <p className="text-gray-500 text-sm sm:text-[14px]">{description}</p>
        </div>

        {/* Country Buttons */}
        {countries.length > 0 && (
          <div className="flex gap-2 sm:gap-3 overflow-x-auto mb-4 pb-2 scrollbar-hide">
            {countries.map((country, index) => (
              <button
                key={country.id}
                onClick={() => setActiveCountryIndex(index)}
                className={`px-3 sm:px-4 py-1 rounded-lg text-sm sm:text-sm font-medium whitespace-nowrap transition-colors border ${
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

        {/* Filter Tabs (New, Hot, Stories, Subscribe) */}
        <div className="border-b border-gray-300 mb-3 overflow-x-auto scrollbar-hide">
          <nav className="flex gap-4 sm:gap-8 px-1 min-w-max">
            <button
              onClick={() => setActiveFilter('new')}
              className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors relative ${
                activeFilter === 'new' ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Edit className="w-3 h-3" />
              <span className="text-sm">New</span>
              {activeFilter === 'new' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
              )}
            </button>
            <button
              onClick={() => setActiveFilter('hot')}
              className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors relative ${
                activeFilter === 'hot' ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Flame className="w-3 h-3" />
              <span className="text-sm">Hot</span>
              {activeFilter === 'hot' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
              )}
            </button>
            <button
              onClick={() => setActiveFilter('stories')}
              className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors relative ${
                activeFilter === 'stories' ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Book className="w-3 h-3" />
              <span className="text-sm">Stories</span>
              {activeFilter === 'stories' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
              )}
            </button>
            <button
              onClick={() => setActiveFilter('subscribe')}
              className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors relative ${
                activeFilter === 'subscribe'
                  ? 'text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Mail className="w-3 h-3" />
              <span className="text-sm">Subscribe</span>
              {activeFilter === 'subscribe' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
              )}
            </button>
          </nav>
        </div>

        {/* Subscribe Form */}
        {activeFilter === 'subscribe' && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-8">
            <div className="max-w-md mx-auto text-center">
              <Mail className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Subscribe to Updates</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                Get the latest posts delivered straight to your inbox.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubscribing ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Subscribing...
                    </>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </form>
              {subscribeMessage && (
                <p className={`mt-4 font-medium ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {subscribeMessage}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Posts List */}
        {activeCountry && activeFilter !== 'subscribe' && (
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
                          <div className="px-3 sm:px-6 py-3 sm:py-4">
                            <div className="flex items-center justify-between gap-2 sm:gap-4">
                              <div className="flex gap-2 sm:gap-4 items-start flex-1 min-w-0">
                                <span className="text-indigo-600 font-medium text-xs sm:text-sm shrink-0 pt-0.5">
                                  {post.publishedAt}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-gray-900 font-medium text-xs sm:text-[14px] leading-snug">
                                    {post.title}
                                  </h3>

                                  {showSource && post.source && (
                                    <p className="text-xs text-gray-500 mt-1">From {post.source}</p>
                                  )}
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 shrink-0" />
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
                {filteredPosts.map((post: any, index: number) => (
                  <div key={post.id} className={index > 0 ? 'border-t border-gray-100' : ''}>
                    <Link
                      href={`/posts/${post.slug}`}
                      className="block hover:bg-gray-50 transition-colors"
                    >
                      <div className="px-3 sm:px-6 py-1">
                        <div className="flex items-center justify-between gap-2 sm:gap-4">
                          <div className="flex gap-2 sm:gap-4 items-start flex-1 min-w-0">
                            <span className="text-indigo-600 font-medium text-xs sm:text-sm shrink-0 pt-0.5">
                              {post.publishedAt}
                            </span>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-gray-900 font-medium text-sm sm:text-base leading-snug">
                                {post.title}
                              </h3>
                              {showSource && post.source && (
                                <p className="text-xs text-gray-500 mt-1">From {post.source}</p>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 shrink-0" />
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {filteredPosts.length === 0 && (
              <div className="text-center py-12 text-gray-500 text-sm">
                No posts found for this filter.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
