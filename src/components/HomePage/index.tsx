'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FileText, BarChart3, Mail, MessageSquare, ChevronRight, Send, Loader2 } from 'lucide-react'

interface Post {
  id: string
  title: string
  slug: string
  publishedAt: string
  source?: string | null
  excerpt?: string | null
  isHot?: boolean
  heroImage?: {
    url?: string | null
    alt?: string | null
  } | null
  videoEmbed?: {
    enabled?: boolean | null
    embedUrl?: string | null
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
  description?: string | null
  publishedAt: string
  totalVotes: number
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
  polls: Poll[]
}

export function HomePage() {
  const [email, setEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [subscribeMessage, setSubscribeMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [countrySections, setCountrySections] = useState<CountrySection[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
          // Fetch polls for the horizontal scroll section
          const pollsRes = await fetch(
            `/api/polls-list?countryId=${country.id}&limit=10`,
          )
          const pollsData = await pollsRes.json()

          // Fetch regular posts for trendy topics
          const postsRes = await fetch(
            `/api/posts/paginated?countryId=${country.id}&limit=10&dateFormat=short`,
          )
          const postsData = await postsRes.json()

          return {
            country,
            posts: postsData.posts || [],
            polls: pollsData.polls || [],
          }
        }),
      )

      setCountrySections(sections)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsSubscribing(true)
    setSubscribeMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessageType('success')
        setSubscribeMessage(data.message || 'Successfully subscribed!')
        setEmail('')
      } else {
        setMessageType('error')
        setSubscribeMessage(data.error || 'Failed to subscribe')
      }
    } catch {
      setMessageType('error')
      setSubscribeMessage('Something went wrong. Please try again.')
    } finally {
      setIsSubscribing(false)
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
    <div className="bg-white py-2">
      <h1 className="text-gray-900 text-xl sm:text-[22px] font-bold mb-2">
        Politics explained through questions and polls
      </h1>
      {/* Tagline */}
      <p className="text-gray-500 text-lg sm:text-base">
        AskGeopolitics turns big geopolitical stories into unbiased political questions and quick
        polls—so you can see the facts and where people stand.
      </p>
      {/* Subscribe Form */}
      <div className="py-6">
        <form onSubmit={handleSubscribe} className="flex max-w-auto overflow-hidden rounded-lg">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email..."
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-[15px] focus:outline-none"
            disabled={isSubscribing}
          />
          <button
            type="submit"
            disabled={isSubscribing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 text-white rounded-lg text-base font-medium hover:bg-indigo-700 transition-colors whitespace-nowrap"
          >
            {isSubscribing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
        {subscribeMessage && (
          <p
            className={`px-5 mt-2 text-sm ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}
          >
            {subscribeMessage}
          </p>
        )}
      </div>
      {/* Country Sections */}
      {countrySections.map((section) => (
        <div key={section.country.id} className="mb-10">
          {/* Tabs and Country Badge */}

          <div className="border-b border-gray-300 mb-3 overflow-x-auto scrollbar-hide">
            <nav className="flex justify-between items-center px-1">
              {/* Country Badge */}
              <Link
                href={`/${section.country.slug}`}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-base font-medium hover:bg-indigo-700 transition-colors whitespace-nowrap"
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
                <h2>{section.country.name}</h2>
              </Link>
              <div className="flex gap-3 sm:gap-8 min-w-max">
                <Link
                  href={`/${section.country.slug}`}
                  className="flex items-center gap-1.5 pb-3 text-base sm:text-base font-medium transition-colors relative whitespace-nowrap text-gray-600 hover:text-gray-900"
                >
                  <FileText className="w-4 h-4 sm:w-4 sm:h-4" />
                  <h3>News</h3>
                </Link>
                <Link
                  href={`/${section.country.slug}?tab=polls`}
                  className="flex items-center gap-1.5 pb-3 text-base sm:text-base font-medium transition-colors relative whitespace-nowrap text-gray-600 hover:text-gray-900"
                >
                  <BarChart3 className="w-4 h-4 sm:w-4 sm:h-4" />
                  <h3>Polls</h3>
                </Link>
              </div>
            </nav>
          </div>

          {/* Polls - Horizontal Scroll */}
              {section.polls.length > 0 && (
                <div className="mb-1">
                  <div className="overflow-x-auto scrollbar-hide -mx-1 px-1">
                    <div className="flex gap-3 pb-2">
                      {section.polls.slice(0, 10).map((poll) => {
                        const imageUrl = poll.heroImage?.url || null
                        const imageAlt = poll.heroImage?.alt || poll.question
                        const countrySlug = poll.country?.slug
                          ? poll.country.slug.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
                          : section.country.slug

                        return (
                          <Link
                            key={poll.id}
                            href={`/${countrySlug}/poll/${poll.slug || poll.id}`}
                            className="flex-shrink-0 w-[143px] bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                          >
                            {/* Image */}
                            <div className="relative w-full h-[90px] bg-gray-100">
                              {imageUrl ? (
                                <Image
                                  src={imageUrl}
                                  alt={imageAlt || poll.question}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
                                  <BarChart3 className="w-8 h-8 text-white" />
                                </div>
                              )}
                              {/* Vote count badge */}
                              <div className="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white text-xs px-1.5 py-0.5 rounded">
                                {poll.totalVotes} votes
                              </div>
                            </div>
                            {/* Content */}
                            <div className="p-1">
                              <p className="text-gray-600 text-sm line-clamp-2">
                                {poll.question}
                              </p>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Trendy Topics */}
              <div>
                <div className="inline-flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded-lg">
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

                      return (
                        <div
                          key={post.id}
                          className={index > 0 ? 'border-t border-gray-200 py-1' : ''}
                        >
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
                                      <p className="text-sm text-gray-500 mt-1">
                                        From {post.source}
                                      </p>
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
              </div>

              {/* Frequently Asked Questions Section */}
              <div className="mt-8">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-6 h-6 text-green-500" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Frequently Asked Questions About AskGeopolitics
                  </h2>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="border-l-4 border-indigo-600 p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      What does AskGeopolitics do?
                    </h3>
                    <p className="text-gray-600 text-[14px]">
                      AskGeopolitics turns major political moments and viral news stories into
                      simple, unbiased questions and quick polls. We also share short explainers so
                      you can understand what happened — and see how people react.
                    </p>
                  </div>
                  <div className="border-l-4 border-indigo-600 p-4 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Is AskGeopolitics a political party or campaign tool?
                    </h3>
                    <p className="text-gray-600 text-[14px]">
                      No. AskGeopolitics is not a political party, campaign tool, or advocacy site.
                      It&apos;s a fun, open platform where people can read stories, ask questions,
                      and vote in polls without being pushed toward any political side.
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
                      Yes — in a responsible, fact-based way. We take real controversial moments,
                      break them down into simple facts, and then turn them into neutral questions
                      so readers can vote and discuss freely.
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
                      Because questions are quick, simple, engaging, and easy to share. You get the
                      core idea instantly and can jump straight into the poll.
                    </p>
                  </div>
                  <div className="border-l-4 border-indigo-600 p-4 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Who can participate in the polls?
                    </h3>
                    <p className="text-gray-600 text-[14px]">
                      Anyone. Polls are open to people everywhere — different countries, ages,
                      backgrounds, and viewpoints. The goal is to create a global mix of opinions.
                    </p>
                  </div>
                  <div className="border-l-4 border-indigo-600 p-4 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Are the polls scientific?
                    </h3>
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
                      We don&apos;t lecture. We don&apos;t pick sides. We don&apos;t tell you
                      who&apos;s right. We simply turn politics into fun, fast, fact-based questions
                      and let you decide what you think.
                    </p>
                  </div>
                  <div className="border-l-4 border-indigo-600 p-4 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Can users suggest their own questions or topics?
                    </h3>
                    <p className="text-gray-600 text-[14px]">
                      Yes! You can send us names, events, or political moments you want turned into
                      polls — and we&apos;ll create them in our neutral AskGeopolitics style.
                    </p>
                  </div>
                </div>
              </div>
        </div>
      ))}
    </div>
  )
}
