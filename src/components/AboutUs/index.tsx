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
        <h1 className="text-2xl font-bold text-gray-900 mb-4 border-b border-[#6D4AF9] pb-2">About Us</h1>

        {/* Intro Text */}
        <p className="text-gray-700 mb-6 text-[15px]">
          At AskGeopolitics, we believe the world makes more sense when the right questions are
          asked.
        </p>

        {/* Main Description */}
        <div className="space-y-4 text-gray-700 mb-6 text-[15px]">
          <p>
            <strong className="text-gray-900">AskGeopolitics</strong> is the{' '}
            <span className="underline decoration-1 underline-offset-2">
              quick guide to understanding today&apos;s most important political and geopolitical
              events in 10 seconds.
            </span>{' '}
            We break major news into{' '}
            <span className="underline decoration-1 underline-offset-2">
              clear, simple question-and-answer explainers
            </span>{' '}
            that help readers grasp what matters in seconds.
          </p>

          <p>
            Alongside Q&A explainers,{' '}
            <span className="underline decoration-1 underline-offset-2">
              we also turn key stories into simple voting polls
            </span>{' '}
            where readers can instantly agree, disagree, or share their stance. This allows our
            audience to engage with important issues in a fast, structured, and meaningful way.
          </p>

          <p>
            Founded by{' '}
            <span className="text-indigo-600 underline decoration-1 underline-offset-2">
              geopolitical enthusiasts and technologists Valentine and Christine
            </span>
            , <strong className="text-gray-900">AskGeopolitics</strong> uses custom LLM tools to
            extract essential questions and answers from trusted sources. This supports our mission
            to deliver news that is{' '}
            <span className="underline decoration-1 underline-offset-2">
              fast, structured, and easy to understand.
            </span>
          </p>

          <p>
            We are a conservative-leaning news website, but our explainers aim to remain factual,
            neutral, and free of personal opinion.
          </p>

          <div className="mt-4">
            <p className="font-semibold text-gray-900">Our Goal:</p>
            <p>
              Deliver the most important political news in a format people can understand in under
              10 seconds.
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
              <span className="underline cursor-pointer">click here.</span>
            </p>

            <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition">
              <Mail className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Disclaimer Box */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-gray-900">Disclaimer</h3>
          </div>
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              AskGeopolitics is intended to educate and inform, not provoke political or social
              conflict. We are not responsible for actions taken by readers.
            </p>
            <p>
              For corrections, contact{' '}
              <a href="mailto:editor@askgeopolitics.com" className="text-indigo-600 underline">
                editor@askgeopolitics.com
              </a>{' '}
              and we will fix any factual errors promptly.
            </p>
            <p>AskGeopolitics is owned by Keka Marketing Media LLC.</p>
          </div>
        </div>

        {/* Trendy Topics Section */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg ">
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
                        <p className="text-gray-900 text-sm line-clamp-2">{post.title}</p>
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

        {/* Masthead Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Masthead</h2>

          <div className="space-y-6">
            {/* Strategist & Business Manager */}
            <div>
              <p className="text-gray-700">
                <span className="font-medium">Strategist & Business Manager</span> –{' '}
                <span className="text-indigo-600">Valentine Sunday</span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Oversees strategy, content direction, and growth; passionate about politics and
                delivering clear information to readers.
              </p>
            </div>

            {/* Technical Manager */}
            <div>
              <p className="text-gray-700">
                <span className="font-medium">Technical Manager</span> –{' '}
                <span className="text-indigo-600">Christine Ingabire</span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Leads platform development and creates the tools that power AskGeopolitics.
              </p>
            </div>

            {/* Editor-in-Chief */}
            <div>
              <p className="text-gray-700">
                <span className="font-medium">Editor-in-Chief</span> – Roman Vitalik{' '}
                <a href="mailto:Roman@AskGeopolitics.com" className="text-indigo-600">
                  (Roman@AskGeopolitics.com)
                </a>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Ensures accuracy, clarity, and editorial standards across all published content.
              </p>
            </div>

            {/* Researcher */}
            <div>
              <p className="text-gray-700">
                <span className="font-medium">Researcher</span> – Rachel Vitalik{' '}
                <a href="mailto:rachel@themarysue.com" className="text-indigo-600">
                  (rachel@themarysue.com)
                </a>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Conducts research, verifies sources, and supports content preparation.
              </p>
            </div>

            {/* Publisher 1 */}
            <div>
              <p className="text-gray-700">
                <span className="font-medium">Publisher</span> –{' '}
                <span className="text-indigo-600">Fatima S.</span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Manages publishing workflows and oversees the release of new content
              </p>
            </div>

            {/* Publisher 2 */}
            <div>
              <p className="text-gray-700">
                <span className="font-medium">Publisher</span> – Merron Woodluck{' '}
                <a href="mailto:rachel@themarysue.com" className="text-indigo-600">
                  (rachel@themarysue.com)
                </a>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Coordinates content distribution and maintains publishing consistency.
              </p>
            </div>

            {/* Social Media Manager */}
            <div>
              <p className="text-gray-700">
                <span className="font-medium">Social Media Manager</span> –{' '}
                <span className="text-indigo-600">Tapiwanshe Sivara</span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Creates and manages social media content to engage and grow our audience.
              </p>
            </div>

            {/* Site Design */}
            <div>
              <p className="text-gray-700">
                <span className="font-medium">Site Design</span> –{' '}
                <span className="text-indigo-600">Christine Ingabire</span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Responsible for the website&apos;s visual design, user experience, and interface
                development.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
