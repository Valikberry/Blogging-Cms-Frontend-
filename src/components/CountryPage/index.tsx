'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import {
  Search,
  FileText,
  BookOpen,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from 'lucide-react'

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
  initialTab?: TabType
}

type TabType = 'news' | 'stories' | 'polls'

export function CountryPage({ country, initialTab = 'polls' }: CountryPageProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<TabType>(initialTab)
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
          `/api/polls-list?countryId=${country.id}&page=${currentPage}&limit=12`,
        )
        const data = await res.json()
        setPolls(data.polls || [])
        setPagination(
          data.pagination || {
            totalPages: 1,
            totalDocs: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        )
      } else {
        const isStories = activeTab === 'stories' ? '&isStories=true' : ''
        const res = await fetch(
          `/api/posts/paginated?countryId=${country.id}&page=${currentPage}&limit=10&dateFormat=short${isStories}`,
        )
        const data = await res.json()
        setPosts(data.posts || [])
        setPagination(
          data.pagination || {
            totalPages: 1,
            totalDocs: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        )
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

  // Handle tab change with URL update
  const handleTabChange = (tab: TabType) => {
    const normalizedSlug = country.slug.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
    setActiveTab(tab)
    router.push(`/${normalizedSlug}/${tab}`, { scroll: false })
  }

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
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-indigo-600">{country.name} </span>
      </nav>
      {/* Search Bar */}
      <div className="mt-6">
        <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a story, poll or news..."
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-[15px]"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600 hover:text-indigo-700"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>
      </div>
      {/* Page Title */}
      <div className="text-center py-3 mb-6">
        {/* <h1 className="text-gray-900 text-2xl sm:text-[20px] font-bold mb-2">
          {`${country.name} politics explained through questions and polls`}
          <span className="text-indigo-600">?</span>
        </h1> */}
        <p className="text-gray-600 text-lg sm:text-base">
          AskGeopolitics turns big geopolitical stories into unbiased political questions and quick
          polls,so you can see the facts and where people stand.
        </p>
      </div>

      {/* Tabs and Country Badge */}
      <div className="flex items-center justify-between mb-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleTabChange('news')}
            className={`flex items-center gap-2 pb-2 mb-[-1px] text-[15px] font-medium transition-colors ${
              activeTab === 'news'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
            }`}
          >
            <FileText className="w-4 h-4" />
            <h3> News</h3>
          </button>
          <button
            onClick={() => handleTabChange('stories')}
            className={`flex items-center gap-2 pb-2 mb-[-1px] text-[15px] font-medium transition-colors ${
              activeTab === 'stories'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <h3> Stories</h3>
          </button>
          <button
            onClick={() => handleTabChange('polls')}
            className={`flex items-center gap-2 pb-2 mb-[-1px] text-[15px] font-medium transition-colors ${
              activeTab === 'polls'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <h3>Polls</h3>
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="py-12 text-center">
          <div className="inline-block w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-500">Loading...</p>
        </div>
      ) : activeTab === 'polls' ? (
        /* Polls - Horizontal Scroll */
        <div className="mb-1">
          {polls.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-[14px]">
              No polls available for this country.
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-hide  px-1">
              <div className="flex gap-5 pb-2 flex-wrap">
                {polls.map((poll) => {
                  const imageUrl = poll.heroImage?.url
                  const pollSlug = poll.slug || poll.id
                  const normalizedCountrySlug = country.slug
                    .replace(/[^a-zA-Z0-9]/g, '')
                    .toLowerCase()

                  return (
                    <Link
                      key={poll.id}
                      href={`/${normalizedCountrySlug}/poll/${pollSlug}`}
                      className="flex-shrink-0 w-[143px] bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {/* Image */}
                      <div className="relative w-full h-[90px] bg-gray-100">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={poll.heroImage?.alt || poll.question}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-12 h-12 border-2 border-gray-300 rounded flex items-center justify-center">
                              <BarChart3 className="w-6 h-6 text-gray-400" />
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Content */}
                      <div className="p-1">
                        <p className="text-gray-600 text-sm line-clamp-2">{poll.question}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
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
              const normalizedCountrySlug = country.slug.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()

              return (
                <div key={post.id} className={index > 0 ? 'border-t border-gray-200 py-1' : ''}>
                  <Link
                    href={`/${normalizedCountrySlug}/${post.slug}`}
                    className="block hover:bg-gray-50 transition-colors"
                  >
                    <div className="px-3 sm:px-6 py-1">
                      <div className="flex items-center justify-between gap-2 sm:gap-4">
                        <div className="flex gap-2 sm:gap-4 items-start flex-1 min-w-0">
                          <span className="text-indigo-600  text-sm sm:text-sm shrink-0 pt-0.5">
                            {post.publishedAt}
                          </span>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-gray-900 font-medium text-base sm:text-base leading-snug truncate">
                              {post.title}
                            </h3>
                            {post.source && (
                              <p className="text-sm text-gray-500 mt-1">From {post.source}</p>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 shrink-0" />
                        {/* {imageUrl ? (
                                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                                    <Image
                                      src={imageUrl}
                                      alt={post.heroImage?.alt || post.title}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                ) : (
                                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 shrink-0" />
                                )} */}
                      </div>
                    </div>
                  </Link>
                </div>
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
            ),
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
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-6 h-6 text-green-500" />
          <h2 className="text-lg font-semibold text-gray-900">
            Frequently Asked Questions About AskGeopolitics
          </h2>
        </div>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="border-l-4 border-indigo-600 p-4">
            <h3 className="font-semibold text-gray-900 mb-2">What does AskGeopolitics do?</h3>
            <p className="text-gray-600 text-[14px]">
              AskGeopolitics turns major political moments and viral news stories into simple,
              unbiased questions and quick polls. We also share short explainers so you can
              understand what happened — and see how people react.
            </p>
          </div>
          <div className="border-l-4 border-indigo-600 p-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">
              Is AskGeopolitics a political party or campaign tool?
            </h3>
            <p className="text-gray-600 text-[14px]">
              No. AskGeopolitics is not a political party, campaign tool, or advocacy site.
              It&apos;s a fun, open platform where people can read stories, ask questions, and vote
              in polls without being pushed toward any political side.
            </p>
          </div>
          {/* <div className="border-l-4 border-indigo-600 p-4 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Is AskGeopolitics unbiased?
                    </h3>
                    <p className="text-gray-600 text-[14px]">
                      Yes. Every question is written to be neutral, factual, and judgment-free. Our
                      goal is to help people think, react, and explore, not tell them who to support.
                    </p>
                  </div> */}
          {/* <div className="border-l-4 border-indigo-600 p-4 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Where do the questions come from?
                    </h3>
                    <p className="text-gray-600 text-[14px]">
                      Our questions come from verified news events, public statements, and — most
                      importantly — the community itself. People submit topics or viral moments they
                      want turned into simple political questions, and we create polls from them.
                    </p>
                  </div> */}
          <div className="border-l-4 border-indigo-600 p-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">
              Does AskGeopolitics take controversial events and turn them into polls?
            </h3>
            <p className="text-gray-600 text-[14px]">
              Yes — in a responsible, fact-based way. We take real controversial moments, break them
              down into simple facts, and then turn them into neutral questions so readers can vote
              and discuss freely.
            </p>
          </div>
          {/* <div className="border-l-4 border-indigo-600 p-4 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Is this site just for serious political analysis?
                    </h3>
                    <p className="text-gray-600 text-[14px]">
                      Not at all. AskGeopolitics is also a fun site — created for curiosity,
                      conversation, and free speech. We mix real political stories with light,
                      entertaining polls so people can enjoy politics without the stress.
                    </p>
                  </div> */}
          <div className="border-l-4 border-indigo-600 p-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">
              Why use questions instead of long political articles?
            </h3>
            <p className="text-gray-600 text-[14px]">
              Because questions are quick, simple, engaging, and easy to share. You get the core
              idea instantly and can jump straight into the poll.
            </p>
          </div>
          <div className="border-l-4 border-indigo-600 p-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Who can participate in the polls?</h3>
            <p className="text-gray-600 text-[14px]">
              Anyone. Polls are open to people everywhere — different countries, ages, backgrounds,
              and viewpoints. The goal is to create a global mix of opinions.
            </p>
          </div>
          <div className="border-l-4 border-indigo-600 p-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Are the polls scientific?</h3>
            <p className="text-gray-600 text-[14px]">
              No. They&apos;re informal, public polls meant for insight and discussion — not
              official statistics.
            </p>
          </div>
          <div className="border-l-4 border-indigo-600 p-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">
              What makes AskGeopolitics different from regular political sites?
            </h3>
            <p className="text-gray-600 text-[14px]">
              We don&apos;t lecture. We don&apos;t pick sides. We don&apos;t tell you who&apos;s
              right. We simply turn politics into fun, fast, fact-based questions and let you decide
              what you think.
            </p>
          </div>
          <div className="border-l-4 border-indigo-600 p-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">
              Can users suggest their own questions or topics?
            </h3>
            <p className="text-gray-600 text-[14px]">
              Yes! You can send us names, events, or political moments you want turned into polls —
              and we&apos;ll create them in our neutral AskGeopolitics style.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
