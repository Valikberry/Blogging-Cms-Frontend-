'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, FileText, BarChart3, Mail } from 'lucide-react'

interface Post {
  id: string
  title: string
  slug: string
  publishedAt: string
  source?: string | null
  heroImage?: {
    url?: string | null
    alt?: string | null
  } | null
  country?: {
    id: string
    name: string
    slug: string
  } | null
}

interface Poll {
  id: string
  question: string
  slug: string
  heroImage?: {
    url?: string | null
    alt?: string | null
  } | null
  totalVotes: number
}

interface Country {
  id: string
  name: string
  slug: string
  flag?: {
    url?: string | null
  } | null
}

interface CountrySection {
  country: Country
  posts: Post[]
  hotPosts: Post[]
  polls: Poll[]
}

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [countrySections, setCountrySections] = useState<CountrySection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Record<string, 'news' | 'polls'>>({})

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      // Fetch countries
      const countriesRes = await fetch('/api/countries-list')
      const countriesData = await countriesRes.json()

      if (!countriesRes.ok) {
        throw new Error('Failed to fetch countries')
      }

      const countries: Country[] = (countriesData.countries || []).map((c: Country) => ({
        ...c,
        slug: c.slug?.toLowerCase().replace(/\s+/g, '') || '',
      }))

      // Fetch posts and polls for each country
      const sections: CountrySection[] = await Promise.all(
        countries.slice(0, 5).map(async (country) => {
          // Fetch hot posts for the horizontal scroll section
          const hotPostsRes = await fetch(
            `/api/posts/paginated?countryId=${country.id}&limit=4&dateFormat=short&filter=hot`,
          )
          const hotPostsData = await hotPostsRes.json()

          // Fetch regular posts for trendy topics
          const postsRes = await fetch(
            `/api/posts/paginated?countryId=${country.id}&limit=5&dateFormat=short`,
          )
          const postsData = await postsRes.json()

          // Fetch polls for this country
          const pollsRes = await fetch(`/api/polls-list?countryId=${country.id}&limit=4`)
          const pollsData = await pollsRes.json()

          return {
            country,
            posts: postsData.posts || [],
            hotPosts: hotPostsData.posts || [],
            polls: pollsData.polls || [],
          }
        }),
      )

      setCountrySections(sections)

      // Initialize active tabs
      const tabs: Record<string, 'news' | 'polls'> = {}
      sections.forEach((section) => {
        tabs[section.country.id] = 'news'
      })
      setActiveTab(tabs)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      {/* Search Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a story, poll or news..."
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-[15px]"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600 hover:text-indigo-700"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Tagline */}
      <p className="text-center text-gray-600 mb-8 text-[15px]">
        AskGeopolitics breaks big global stories into clear questions that reveal what&apos;s at
        stake, who&apos;s involved, and what could happen next.
      </p>

      {/* Country Sections */}
      {countrySections.map((section) => (
        <div key={section.country.id} className="mb-10">
          {/* Tabs and Country Badge */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setActiveTab((prev) => ({ ...prev, [section.country.id]: 'news' }))}
                className={`flex items-center gap-2 pb-2 text-[15px] font-medium transition-colors ${
                  activeTab[section.country.id] === 'news'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FileText className="w-4 h-4" />
                News
              </button>
              <button
                onClick={() => setActiveTab((prev) => ({ ...prev, [section.country.id]: 'polls' }))}
                className={`flex items-center gap-2 pb-2 text-[15px] font-medium transition-colors ${
                  activeTab[section.country.id] === 'polls'
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Polls
              </button>
            </div>

            {/* Country Badge */}
            <Link
              href={`/${section.country.slug}`}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {section.country.flag?.url && (
                <Image
                  src={section.country.flag.url}
                  alt={`${section.country.name} flag`}
                  width={24}
                  height={16}
                  className="object-cover rounded-sm"
                />
              )}
              <span className="font-medium text-[14px]">{section.country.name}</span>
            </Link>
          </div>

          {activeTab[section.country.id] === 'news' ? (
            <>
              {/* Hot Stories - Horizontal Scroll */}
              {section.hotPosts.length > 0 && (
                <div className="mb-4">
                  <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {section.hotPosts.map((post) => {
                      const countrySlug = post.country?.slug
                        ? post.country.slug.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
                        : section.country.slug
                      const imageUrl = post.heroImage?.url

                      return (
                        <Link
                          key={post.id}
                          href={`/${countrySlug}/${post.slug}`}
                          className="flex-shrink-0 w-[160px] group"
                        >
                          <div className="relative w-full h-[100px] rounded-lg overflow-hidden bg-gray-100 mb-2">
                            {imageUrl ? (
                              <Image
                                src={imageUrl}
                                alt={post.heroImage?.alt || post.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <FileText className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <p className="text-[13px] text-gray-700 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                            {post.title}
                          </p>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Trendy Topics */}
              <div>
                <div className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg mb-3">
                  <Mail className="w-4 h-4" />
                  <span className="font-medium text-[14px]">Trendy Topics</span>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {section.posts.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 text-[14px]">
                      No posts found for this country.
                    </div>
                  ) : (
                    section.posts.map((post, index) => {
                      const countrySlug = post.country?.slug
                        ? post.country.slug.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
                        : section.country.slug
                      const imageUrl = post.heroImage?.url

                      return (
                        <Link
                          key={post.id}
                          href={`/${countrySlug}/${post.slug}`}
                          className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
                            index > 0 ? 'border-t border-gray-200' : ''
                          }`}
                        >
                          <span className="text-indigo-600 font-medium text-[14px] whitespace-nowrap min-w-[55px]">
                            {post.publishedAt}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-900 text-[14px] line-clamp-1 font-medium">
                              {post.title}
                            </p>
                            {post.source && (
                              <p className="text-[12px] text-gray-500 mt-0.5">From {post.source}</p>
                            )}
                          </div>
                          {imageUrl && (
                            <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={imageUrl}
                                alt={post.heroImage?.alt || post.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                        </Link>
                      )
                    })
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Polls Grid */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {section.polls.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500 text-[14px]">
                  No polls available for this country.
                </div>
              ) : (
                section.polls.map((poll) => {
                  const imageUrl = poll.heroImage?.url
                  const pollSlug = poll.slug || poll.id

                  return (
                    <Link
                      key={poll.id}
                      href={`/${section.country.slug}/poll/${pollSlug}`}
                      className="group"
                    >
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={poll.heroImage?.alt || poll.question}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <BarChart3 className="w-10 h-10 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <p className="text-[13px] text-gray-700 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                        {poll.question}
                      </p>
                    </Link>
                  )
                })
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
