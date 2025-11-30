'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Link2, Share2, Trophy } from 'lucide-react'

// Social media icons
const FacebookIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const XTwitterIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

interface Poll {
  id: string
  question: string
  slug: string
  description?: string | null
  heroImage?: {
    url?: string | null
    alt?: string | null
  } | null
  options: Array<{
    text: string
    votes: number
  }>
  totalVotes: number
  tags?: string[]
  status: string
  country?: {
    id: string
    name: string
    slug: string
  } | null
  relatedPolls?: Array<{
    id: string
    question: string
    slug: string
    description?: string | null
    heroImage?: { url?: string | null; alt?: string | null } | null
  }>
  relatedPosts?: Array<{
    id: string
    title: string
    slug: string
    excerpt?: string | null
    heroImage?: { url?: string | null; alt?: string | null } | null
  }>
}

interface PollDetailProps {
  poll: Poll
  countrySlug: string
}

// Generate a simple visitor ID
function getVisitorId(): string {
  if (typeof window === 'undefined') return ''

  let visitorId = localStorage.getItem('poll_visitor_id')
  if (!visitorId) {
    visitorId = 'v_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
    localStorage.setItem('poll_visitor_id', visitorId)
  }
  return visitorId
}

export function PollDetail({ poll, countrySlug }: PollDetailProps) {
  const [hasVoted, setHasVoted] = useState(false)
  const [votedOptionIndex, setVotedOptionIndex] = useState<number | null>(null)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [results, setResults] = useState<Array<{ text: string; votes: number; percentage: number }>>([])
  const [totalVotes, setTotalVotes] = useState(poll.totalVotes)
  const [isLoading, setIsLoading] = useState(true)
  const [isVoting, setIsVoting] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const checkVoteStatus = useCallback(async () => {
    const visitorId = getVisitorId()
    if (!visitorId) {
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch(`/api/poll-vote/${poll.id}?visitorId=${visitorId}`)
      const data = await res.json()

      if (data.hasVoted) {
        setHasVoted(true)
        setVotedOptionIndex(data.votedOptionIndex)
        setResults(data.results)
        setTotalVotes(data.totalVotes)
        setShowResults(true)
      }
    } catch (error) {
      console.error('Error checking vote status:', error)
    } finally {
      setIsLoading(false)
    }
  }, [poll.id])

  useEffect(() => {
    checkVoteStatus()
  }, [checkVoteStatus])

  const handleVote = async () => {
    if (selectedOption === null || isVoting) return

    setIsVoting(true)
    const visitorId = getVisitorId()

    try {
      const res = await fetch(`/api/poll-vote/${poll.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          optionIndex: selectedOption,
          visitorId,
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setHasVoted(true)
        setVotedOptionIndex(selectedOption)
        setResults(data.results)
        setTotalVotes(data.totalVotes)
        setShowResults(false) // Show the selected state first
      } else {
        alert(data.error || 'Failed to record vote')
      }
    } catch (error) {
      console.error('Vote error:', error)
      alert('Failed to record vote. Please try again.')
    } finally {
      setIsVoting(false)
    }
  }

  const copyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    alert('Link copied to clipboard!')
  }

  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
  }

  const shareOnTwitter = () => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(poll.question)
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank')
  }

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="inline-block w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-gray-700">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href={`/${countrySlug}`} className="hover:text-gray-700 uppercase">
          {countrySlug}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-indigo-600">Poll</span>
      </nav>

      {/* Tags */}
      {poll.tags && poll.tags.length > 0 && (
        <div className="mb-3">
          <span className="text-indigo-600 text-[14px]">Tags: </span>
          {poll.tags.map((tag, index) => (
            <span key={index} className="text-indigo-600 text-[14px]">
              {tag}{index < poll.tags!.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
      )}

      {/* Question */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
        {poll.question}
      </h1>

      {/* Hero Image */}
      {poll.heroImage?.url && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-6">
          <Image
            src={poll.heroImage.url}
            alt={poll.heroImage.alt || poll.question}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Voting Options or Results */}
      {!hasVoted ? (
        /* Voting Options */
        <div className="space-y-3 mb-4">
          {poll.options.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedOption(index)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                selectedOption === index
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="font-medium text-[15px]">{option.text}</span>
            </button>
          ))}
        </div>
      ) : !showResults ? (
        /* Post-vote state - before showing results */
        <div className="space-y-3 mb-4">
          {poll.options.map((option, index) => (
            <div
              key={index}
              className={`w-full p-4 rounded-lg border-2 ${
                votedOptionIndex === index
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <span className="font-medium text-[15px]">{option.text}</span>
            </div>
          ))}
        </div>
      ) : (
        /* Results View */
        <>
          {/* Results Header */}
          <div className="bg-indigo-50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-indigo-600" />
              <span className="font-semibold text-indigo-600">Results</span>
            </div>
            {poll.description && (
              <p className="text-gray-700 text-[14px]">{poll.description}</p>
            )}
            <p className="text-gray-600 text-[13px] mt-2">
              AskGeopolitics breaks big global stories into clear questions that reveal what&apos;s at stake, who&apos;s involved, and what could happen next.
            </p>

            {/* Share Icons */}
            <div className="flex items-center gap-3 mt-3">
              <button onClick={copyLink} className="text-gray-500 hover:text-gray-700">
                <Link2 className="w-5 h-5" />
              </button>
              <button onClick={shareOnFacebook} className="text-gray-500 hover:text-blue-600">
                <FacebookIcon />
              </button>
              <button onClick={shareOnTwitter} className="text-gray-500 hover:text-black">
                <XTwitterIcon />
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Results Bars */}
          <div className="space-y-3 mb-4">
            {results.map((option, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-lg ${
                  votedOptionIndex === index ? 'border-2 border-indigo-600' : ''
                }`}
              >
                <div
                  className={`absolute inset-0 ${
                    votedOptionIndex === index ? 'bg-indigo-600' : 'bg-gray-100'
                  }`}
                  style={{ width: `${option.percentage}%` }}
                />
                <div className="relative p-4 flex justify-between items-center">
                  <span className={`font-medium text-[15px] ${votedOptionIndex === index ? 'text-white' : 'text-gray-900'}`}>
                    {option.text}
                  </span>
                  <span className={`font-medium text-[15px] ${votedOptionIndex === index ? 'text-white' : 'text-gray-600'}`}>
                    {option.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Vote Count */}
      <p className="text-gray-500 text-[14px] mb-4">
        {totalVotes.toLocaleString()} Votes
      </p>

      {/* Action Buttons */}
      {!hasVoted ? (
        <button
          onClick={handleVote}
          disabled={selectedOption === null || isVoting}
          className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isVoting ? 'Voting...' : 'Vote'}
        </button>
      ) : !showResults ? (
        <div className="flex gap-4">
          <Link
            href={`/${countrySlug}?tab=polls`}
            className="flex-1 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors text-center"
          >
            Take Another Poll
          </Link>
          <button
            onClick={() => setShowResults(true)}
            className="flex-1 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            See results
          </button>
        </div>
      ) : null}

      {/* Related Content */}
      {showResults && (
        <div className="mt-8 space-y-6">
          {/* Related Polls */}
          {poll.relatedPolls && poll.relatedPolls.length > 0 && (
            <div>
              {poll.relatedPolls.map((relatedPoll) => (
                <Link
                  key={relatedPoll.id}
                  href={`/${countrySlug}/poll/${relatedPoll.slug}`}
                  className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors mb-3"
                >
                  {relatedPoll.heroImage?.url && (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={relatedPoll.heroImage.url}
                        alt={relatedPoll.heroImage.alt || relatedPoll.question}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-indigo-600 text-[12px]">★</span>
                      <span className="text-indigo-600 font-medium text-[14px]">Poll</span>
                    </div>
                    <p className="text-gray-600 text-[14px] line-clamp-2">
                      {relatedPoll.description || relatedPoll.question}
                    </p>
                    <button className="mt-2 px-4 py-1.5 bg-indigo-600 text-white text-[13px] rounded-lg hover:bg-indigo-700 transition-colors">
                      Take Another Poll
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Related Posts */}
          {poll.relatedPosts && poll.relatedPosts.length > 0 && (
            <div>
              {poll.relatedPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/${countrySlug}/${post.slug}`}
                  className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors mb-3"
                >
                  {post.heroImage?.url && (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={post.heroImage.url}
                        alt={post.heroImage.alt || post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-indigo-600 text-[12px]">★</span>
                      <span className="text-indigo-600 font-medium text-[14px]">Article</span>
                    </div>
                    <p className="text-gray-600 text-[14px] line-clamp-2">
                      {post.excerpt || post.title}
                    </p>
                    <button className="mt-2 px-4 py-1.5 bg-indigo-600 text-white text-[13px] rounded-lg hover:bg-indigo-700 transition-colors">
                      Read Article
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
