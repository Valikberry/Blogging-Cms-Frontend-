'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
  heroImage?: {
    url?: string | null
    alt?: string | null
  } | string | null
  excerpt?: string | null
}

interface Country {
  id: string
  name: string
  slug: string
  continentSlug: string
  flagUrl?: string | null
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
    : -1 // -1 means "All Countries"

  const [activeCountryIndex, setActiveCountryIndex] = useState(initialIndex)
  const [activeFilter, setActiveFilter] = useState<FilterTab>('new')
  const [email, setEmail] = useState('')
  const [subscribeMessage, setSubscribeMessage] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  const activeCountry = activeCountryIndex >= 0 ? countries[activeCountryIndex] : null

  // Collect all posts from all countries
  const allPosts = countries.flatMap((country) =>
    country.posts.map((post) => ({ ...post, country }))
  )

  // Collect all hot posts from all countries
  const allHotPosts = allPosts.filter((post) => post.isHot)

  // Filter posts based on active filter tab and selected country
  const filteredPosts = activeCountry
    ? activeCountry.posts.filter((post) => {
        if (activeFilter === 'hot') return post.isHot
        if (activeFilter === 'stories') return post.isStories
        if (activeFilter === 'new') return true
        return true
      })
    : allPosts.filter((post) => {
        if (activeFilter === 'hot') return post.isHot
        if (activeFilter === 'stories') return post.isStories
        if (activeFilter === 'new') return true
        return true
      })

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

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-gray-900 text-[20px] font-bold mb-2">{title}</h1>
          <p className="text-gray-500 text-base sm:text-base">{description}</p>
        </div>

        {/* Country Buttons */}
        {countries.length > 0 && (
          <div className="flex gap-1.5 sm:gap-3 overflow-x-auto mb-4 pb-2 scrollbar-hide -mx-1 px-1">
            {countries.map((country, index) => (
              <button
                key={country.id}
                onClick={() => setActiveCountryIndex(index)}
                className={`px-2 sm:px-4 py-1 sm:py-1.5 rounded-lg text-sm sm:text-base font-medium whitespace-nowrap transition-colors border flex items-center gap-1 sm:gap-1.5 flex-shrink-0 ${
                  activeCountryIndex === index
                    ? 'bg-[#6366f1]/10 text-[#6366f1] border-[#6366f1]'
                    : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
                }`}
              >
                {country.flagUrl && (
                  <Image
                    src={country.flagUrl}
                    alt={`${country.name} flag`}
                    width={14}
                    height={10}
                    className="object-cover rounded-sm sm:w-5 sm:h-4"
                  />
                )}
                {country.name}
              </button>
            ))}
          </div>
        )}

        {/* Filter Tabs (New, Hot, Stories, Subscribe) */}
        <div className="border-b border-gray-300 mb-3 overflow-x-auto scrollbar-hide">
          <nav className="flex gap-3 sm:gap-8 px-1 min-w-max">
            <button
              onClick={() => setActiveFilter('new')}
              className={`flex items-center gap-1.5 pb-3 text-sm sm:text-base font-medium transition-colors relative whitespace-nowrap ${
                activeFilter === 'new' ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>New</span>
              {activeFilter === 'new' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
              )}
            </button>
            <button
              onClick={() => setActiveFilter('hot')}
              className={`flex items-center gap-1.5 pb-3 text-sm sm:text-base font-medium transition-colors relative whitespace-nowrap ${
                activeFilter === 'hot' ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Hot</span>
              {activeFilter === 'hot' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
              )}
            </button>
            <button
              onClick={() => setActiveFilter('stories')}
              className={`flex items-center gap-1.5 pb-3 text-sm sm:text-base font-medium transition-colors relative whitespace-nowrap ${
                activeFilter === 'stories' ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Book className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Stories</span>
              {activeFilter === 'stories' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
              )}
            </button>
            <button
              onClick={() => setActiveFilter('subscribe')}
              className={`flex items-center gap-1.5 pb-3 text-sm sm:text-base font-medium transition-colors relative whitespace-nowrap ${
                activeFilter === 'subscribe'
                  ? 'text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Subscribe</span>
              {activeFilter === 'subscribe' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
              )}
            </button>
          </nav>
        </div>

        {/* Hot Posts Scrollable Section */}
        {allHotPosts.length > 0 && (
          <div className="mb-1">
            <div className="overflow-x-auto scrollbar-hide -mx-1 px-1">
              <div className="flex gap-3 pb-2">
                {allHotPosts.map((post) => {
                  const imageUrl = typeof post.heroImage === 'object' ? post.heroImage?.url : null
                  const imageAlt = typeof post.heroImage === 'object' ? post.heroImage?.alt : post.title
                  const normalizedCountrySlug = post.country.slug.replace(/[^a-zA-Z0-9]/g, "")

                  return (
                    <Link
                      key={post.id}
                      href={`/${normalizedCountrySlug}/${post.slug}`}
                      className="flex-shrink-0 w-[143px] bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {/* Image */}
                      <div className="relative w-full h-[90px] bg-gray-100">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={imageAlt || post.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-12 h-12 border-2 border-gray-300 rounded flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Content */}
                      <div className="p-1">
                     
                        {post.excerpt && (
                          <p className="text-gray-600 text-xs line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Subscribe Form */}
        {activeFilter === 'subscribe' && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-8">
            <div className="max-w-md mx-auto text-center">
              <Mail className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Subscribe to Updates</h3>
              <p className="text-base sm:text-lg text-gray-600 mb-6">
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
        {activeFilter !== 'subscribe' && (
          <div className="bg-white rounded-lg border border-gray-200">
            {groupByDate && groupedPosts ? (
              // Grouped by date view
              <div>
                {Object.entries(groupedPosts).map(([date, posts], groupIndex) => (
                  <div key={date}>
                    {posts.map((post: any, postIndex) => {
                      const postCountry = post.country || activeCountry
                      const normalizedCountrySlug = postCountry?.slug ? postCountry.slug.replace(/[^a-zA-Z0-9]/g, "") : ""

                      return (
                      <div
                        key={post.id}
                        className={
                          groupIndex > 0 || postIndex > 0 ? 'border-t border-gray-100' : ''
                        }
                      >
                        <Link
                          href={`/${normalizedCountrySlug}/${post.slug}`}
                          className="block hover:bg-gray-50 transition-colors"
                        >
                          <div className="px-3 sm:px-6 py-3 sm:py-4">
                            <div className="flex items-center justify-between gap-2 sm:gap-4">
                              <div className="flex gap-2 sm:gap-4 items-start flex-1 min-w-0">
                                <span className="text-indigo-600 font-medium text-sm sm:text-base shrink-0 pt-0.5">
                                  {post.publishedAt}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-gray-900 font-medium text-sm sm:text-base leading-snug">
                                    {post.title}
                                  </h3>

                                  {showSource && post.source && (
                                    <p className="text-sm text-gray-500 mt-1">From {post.source}</p>
                                  )}
                                </div>
                              </div>
                              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 shrink-0" />
                            </div>
                          </div>
                        </Link>
                      </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            ) : (
              // Simple list view
              <div>
                {filteredPosts.map((post: any, index: number) => {
                  const postCountry = post.country || activeCountry
                  const normalizedCountrySlug = postCountry?.slug ? postCountry.slug.replace(/[^a-zA-Z0-9]/g, "") : ""

                  return (
                  <div key={post.id} className={index > 0 ? 'border-t border-gray-100' : ''}>
                    <Link
                      href={`/${normalizedCountrySlug}/${post.slug}`}
                      className="block hover:bg-gray-50 transition-colors"
                    >
                      <div className="px-3 sm:px-6 py-1">
                        <div className="flex items-center justify-between gap-2 sm:gap-4">
                          <div className="flex gap-2 sm:gap-4 items-start flex-1 min-w-0">
                            <span className="text-indigo-600 font-medium text-sm sm:text-base shrink-0 pt-0.5">
                              {post.publishedAt}
                            </span>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-gray-900 font-medium text-base sm:text-lg leading-snug">
                                {post.title}
                              </h3>
                              {showSource && post.source && (
                                <p className="text-sm text-gray-500 mt-1">From {post.source}</p>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 shrink-0" />
                        </div>
                      </div>
                    </Link>
                  </div>
                  )
                })}
              </div>
            )}

            {/* Empty state */}
            {filteredPosts.length === 0 && (
              <div className="text-center py-12 text-gray-500 text-base">
                No posts found for this filter.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
