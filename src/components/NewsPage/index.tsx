'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Search, FileText, ChevronLeft, ChevronRight } from 'lucide-react'

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

export function NewsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
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
      const res = await fetch(`/api/posts/paginated?page=${currentPage}&limit=15&dateFormat=short`)
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
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}&type=news`
    }
  }

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

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-indigo-600">News</span>
      </nav>

      {/* Page Title */}
      <div className="text-center mb-6">
        <h1 className="text-gray-900 text-2xl sm:text-[20px] font-bold mb-2">
          GeoPolitics Through Questions
          <span className="text-indigo-600">?</span>
        </h1>
        <p className="text-gray-600 text-lg sm:text-base">
          Breaking political news turned into simple questions. Understand global events through
          clear, unbiased questions.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for news..."
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

      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">All News</h2>
        </div>
        <span className="text-sm text-gray-500">{pagination.totalDocs} articles</span>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="py-12 text-center">
          <div className="inline-block w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-500">Loading...</p>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {posts.length === 0 ? (
            <div className="py-12 text-center text-gray-500">No news available.</div>
          ) : (
            posts.map((post, index) => {
              const countrySlug = post.country?.slug
                ? post.country.slug.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
                : 'global'

              return (
                <div key={post.id} className={index > 0 ? 'border-t border-gray-200 py-1' : ''}>
                  <Link
                    href={`/${countrySlug}/${post.slug}`}
                    className="block hover:bg-gray-50 transition-colors"
                  >
                    <div className="px-3 sm:px-6 py-1">
                      <div className="flex items-center justify-between gap-2 sm:gap-4">
                        <div className="flex gap-2 sm:gap-4 items-start flex-1 min-w-0">
                          <span className="text-indigo-600 text-sm sm:text-sm shrink-0 pt-0.5">
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
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            &laquo;
          </button>

          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={!pagination.hasPrevPage}
            className="w-8 h-8 flex items-center justify-center rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

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

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pagination.totalPages))}
            disabled={!pagination.hasNextPage}
            className="w-8 h-8 flex items-center justify-center rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setCurrentPage(pagination.totalPages)}
            disabled={currentPage === pagination.totalPages}
            className="w-8 h-8 flex items-center justify-center rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            &raquo;
          </button>
        </div>
      )}
    </div>
  )
}
