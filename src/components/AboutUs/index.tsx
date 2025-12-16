'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react'

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

interface TeamMember {
  name: string
  title: string
  bio?: string | null
  email?: string | null
  id?: string | null
}

interface AboutUsData {
  pageTitle?: string | null
  introText?: string | null
  missionContent?: any
  aboutContent?: any
  teamTitle?: string | null
  teamMembers?: TeamMember[] | null
  contactEmail?: string | null
  ownerName?: string | null
}

export function AboutUs({ data: _data }: { data: AboutUsData }) {
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
          <span className="text-root">About Us</span>
        </nav>

        {/* Page Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4 border-b border-[#6D4AF9] pb-2">
          About Us
        </h1>

        {/* Intro Text */}
        <p className="text-gray-700 mb-4 text-[15px]">
          AskGeopolitics simplifies politics. We turn major political events into fun, clear
          questions and quick polls—so you can see the facts fast. Smart, simple, and made for
          people who want the world explained in seconds.
        </p>

        {/* Site Managers */}
        <p className="mb-4 text-[15px]">
          Site is managed by <u className="text-root">Valentine & Christine.</u>
        </p>

        {/* Our Goal Section */}
        <div className="mb-6">
          <p className="font-semibold  text-root mb-2 text-lg">Our Goal:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              Deliver the most important political news in a format people can understand in under 10
              seconds.
            </li>
            <li>
              Have a tip or story idea? Email us at editor@askgeopolitics.com. To submit anonymously, click here.
            </li>
          </ul>
        </div>

        {/* Disclaimer Box */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-indigo-600">Disclaimer</h3>
          </div>
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              <strong className="text-gray-900">AskGeopolitics</strong> is intended to educate and
              inform, not provoke political or social conflict. We are not responsible for actions
              taken by readers.
            </p>
            <p>
              For corrections, contact{' '}
              <a href="mailto:editor@askgeopolitics.com" className="text-gray-900">
                editor@askgeopolitics.com
              </a>{' '}
              and we will fix any verified factual errors promptly.
            </p>
            <p className="font-medium text-gray-900">
              AskGeopolitics is owned by Keka Marketing Media LLC.
            </p>
          </div>
        </div>

        {/* Tips Box */}
        <div className="mb-6">
          {/* Centered label on top of border */}
          <div className="flex justify-center">
            <span className="bg-indigo-500 text-white text-xs font-medium px-4 py-1 rounded-md -mb-2 z-10">
              TIPS
            </span>
          </div>

          {/* Purple border box */}
          <div className="border border-indigo-300 rounded-md p-4 flex items-center justify-between gap-4 relative">
            <p className="text-gray-700 text-sm">
              Have a tip or story idea? Email us. Or to keep it anonymous,{' '}
              <Link href="#" className="underline">
                click here.
              </Link>
            </p>

            {/* Illustration */}
            <div className="flex-shrink-0">
              <Image
                src="/images/tips.png"
                alt="Tips illustration"
                width={44}
                height={20}
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Trendy Topics Section */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 border-b-2 border-indigo-600 pb-1 mb-3">
            <Mail className="w-6 h-6 text-indigo-600" />
            <span className="font-semibold text-lg sm:text-base text-indigo-600">Trendy Topics</span>
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
                    <div key={post.id} className={index > 0 ? 'border-t border-gray-200 py-1' : ''}>
                      <Link
                        href={`/${countrySlug}/${post.slug}`}
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
        </div>
      </div>
    </div>
  )
}
