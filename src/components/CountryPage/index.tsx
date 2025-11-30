'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, FileText, BookOpen, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react'

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
  isStories?: boolean
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

interface CountryPageProps {
  country: Country
}

type TabType = 'news' | 'stories' | 'polls'

export function CountryPage({ country }: CountryPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<TabType>('news')
  const [posts, setPosts] = useState<Post[]>([])
  const [polls, setPolls] = useState<Poll[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalDocs: 0,
    hasNextPage: false,
    hasPrevPage: false,
  })

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      if (activeTab === 'polls') {
        const res = await fetch(
          `/api/polls-list?countryId=${country.id}&page=${currentPage}&limit=12`
        )
        const data = await res.json()
        setPolls(data.polls || [])
        setPagination(data.pagination || {
          totalPages: 1,
          totalDocs: 0,
          hasNextPage: false,
          hasPrevPage: false,
        })
      } else {
        const isStories = activeTab === 'stories' ? '&isStories=true' : ''
        const res = await fetch(
          `/api/posts/paginated?countryId=${country.id}&page=${currentPage}&limit=10&dateFormat=short${isStories}`
        )
        const data = await res.json()
        setPosts(data.posts || [])
        setPagination(data.pagination || {
          totalPages: 1,
          totalDocs: 0,
          hasNextPage: false,
          hasPrevPage: false,
        })
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [country.id, activeTab, currentPage])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}&country=${country.slug}`
    }
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const totalPages = pagination.totalPages

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (currentPage > 3) {
        pages.push('...')
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i)
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push('...')
      }

      pages.push(totalPages)
    }

    return pages
  }

  const getTitle = () => {
    if (activeTab === 'polls') {
      return 'GeoPolitics Through polls'
    }
    return 'GeoPolitics Through Questions'
  }

  return (
    <div className="bg-white">
      {/* Page Title */}
      <div className="text-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {getTitle()}
          <span className="text-indigo-600">?</span>
        </h1>
        <p className="text-gray-600 text-[15px]">
          AskGeopolitics breaks big global stories into clear questions that reveal what&apos;s at stake, who&apos;s involved, and what could happen next.
        </p>
      </div>

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

      {/* Tabs and Country Badge */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('news')}
            className={`flex items-center gap-2 pb-2 text-[15px] font-medium transition-colors ${
              activeTab === 'news'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            News
          </button>
          <button
            onClick={() => setActiveTab('stories')}
            className={`flex items-center gap-2 pb-2 text-[15px] font-medium transition-colors ${
              activeTab === 'stories'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Stories
          </button>
          <button
            onClick={() => setActiveTab('polls')}
            className={`flex items-center gap-2 pb-2 text-[15px] font-medium transition-colors ${
              activeTab === 'polls'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Polls
          </button>
        </div>

        {/* Country Badge */}
        <div className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg">
          {country.flag?.url && (
            <Image
              src={country.flag.url}
              alt={`${country.name} flag`}
              width={24}
              height={16}
              className="object-cover rounded-sm"
            />
          )}
          <span className="font-medium text-[14px]">{country.name}</span>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="py-12 text-center">
          <div className="inline-block w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-500">Loading...</p>
        </div>
      ) : activeTab === 'polls' ? (
        /* Polls Grid */
        <div>
          {polls.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              No polls available for this country.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {polls.map((poll) => {
                const imageUrl = poll.heroImage?.url
                const pollSlug = poll.slug || poll.id

                return (
                  <Link
                    key={poll.id}
                    href={`/${country.slug}/poll/${pollSlug}`}
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
              })}
            </div>
          )}
        </div>
      ) : (
        /* News/Stories List */
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {posts.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              No {activeTab === 'stories' ? 'stories' : 'posts'} available for this country.
            </div>
          ) : (
            posts.map((post, index) => {
              const imageUrl = post.heroImage?.url

              return (
                <Link
                  key={post.id}
                  href={`/${country.slug}/${post.slug}`}
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
      )}

      {/* Pagination */}
      {!isLoading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-6">
          {/* First page */}
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            «
          </button>

          {/* Previous */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={!pagination.hasPrevPage}
            className="w-8 h-8 flex items-center justify-center rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page numbers */}
          {getPageNumbers().map((page, index) =>
            page === '...' ? (
              <span
                key={`ellipsis-${index}`}
                className="w-8 h-8 flex items-center justify-center text-gray-500"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => setCurrentPage(page as number)}
                className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            )
          )}

          {/* Next */}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))}
            disabled={!pagination.hasNextPage}
            className="w-8 h-8 flex items-center justify-center rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Last page */}
          <button
            onClick={() => setCurrentPage(pagination.totalPages)}
            disabled={currentPage === pagination.totalPages}
            className="w-8 h-8 flex items-center justify-center rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            »
          </button>
        </div>
      )}
    </div>
  )
}
