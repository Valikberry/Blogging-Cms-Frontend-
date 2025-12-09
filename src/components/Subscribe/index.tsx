'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, ChevronRight, ChevronLeft, Sparkles, Loader2, Send } from 'lucide-react'

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

export function Subscribe() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalDocs: 0,
    hasNextPage: false,
    hasPrevPage: false,
  })

  const postsPerPage = 5

  const fetchPosts = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: postsPerPage.toString(),
        filter: 'new',
        dateFormat: 'short',
      })

      const response = await fetch(`/api/posts/paginated?${params}`)
      const result = await response.json()

      if (response.ok) {
        setPosts(result.posts)
        setPagination(result.pagination)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setIsLoading(false)
    }
  }, [currentPage])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          source: 'subscribe-page',
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setMessageType('success')
        setMessage(data.message || 'Already Subscribed!')
        setEmail('')
      } else {
        setMessageType('error')
        setMessage(data.error || 'Failed to subscribe. Please try again.')
      }
    } catch (error) {
      console.error('Subscription error:', error)
      setMessageType('error')
      setMessage('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
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

  return (
    <div className="bg-white">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-700">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-indigo-600">Subscribe</span>
        </nav>

        {/* Subscribe Header Section */}
        <div className="bg-[#F9FAFB] rounded-lg p-8 mb-8">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Subscribe To Updates!</h1>
            <p className="text-gray-600">
              Get the latest Geopolitics content delivered straight<br />to your inbox.
            </p>
          </div>

          {/* Subscribe Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="johndoe@gmail.com"
                required
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
             <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 text-white rounded-lg text-base font-medium hover:bg-indigo-700 transition-colors whitespace-nowrap"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
            </div>

            {/* Message */}
            {message && (
              <p className={`mt-2 text-sm ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}

            {/* Links */}
            <div className="flex items-center justify-center gap-6 mt-4 text-xs">
              <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-900">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-gray-600 hover:text-gray-900">
                Terms Of Service
              </Link>
            </div>
          </form>
        </div>

        {/* Disclaimer Box */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-indigo-600">Disclaimer</h3>
          </div>
          <div className="space-y-3 text-[14px] text-gray-700">
            <p>
              AskGeopolitics is intended to educate and inform, not provoke political or social conflict. We are not responsible for actions taken by readers.
            </p>
            <p>
              For corrections, contact{' '}
              <a href="mailto:editor@askgeopolitics.com" className="text-indigo-600 underline">
                editor@askgeopolitics.com
              </a>{' '}
              and we will fix any factual errors promptly.
            </p>
            <p className="font-medium">AskGeopolitics is owned by Keka Marketing Media LLC.</p>
          </div>
        </div>

        {/* Trendy Topics Section */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg">
            <Mail className="w-4 h-4" />
            <span className="font-medium">Trendy Topics</span>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-2">Loading posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No posts found.</div>
            ) : (
              <div>
                {posts.map((post, index) => {
                  const countrySlug = post.country?.slug
                    ? post.country.slug.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
                    : ''
                  const imageUrl = post.heroImage?.url

                  return (
                    <Link
                      key={post.id}
                      href={countrySlug ? `/${countrySlug}/${post.slug}` : `/${post.slug}`}
                      className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
                        index > 0 ? 'border-t border-gray-200' : ''
                      }`}
                    >
                      <span className="text-indigo-600 font-medium text-sm whitespace-nowrap min-w-[50px]">
                        {post.publishedAt}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 text-sm line-clamp-1 font-medium">{post.title}</p>
                        {post.source && (
                          <p className="text-xs text-gray-500 mt-1">From {post.source}</p>
                        )}
                      </div>
                      {imageUrl && (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
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
                })}
              </div>
            )}
          </div>

          {/* Pagination */}
          {!isLoading && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-1 mt-4">
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
                  <span key={`ellipsis-${index}`} className="w-8 h-8 flex items-center justify-center text-gray-500">
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
      </div>
    </div>
  )
}
