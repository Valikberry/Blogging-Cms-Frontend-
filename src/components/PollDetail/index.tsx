'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, CheckCircle, ListTodo } from 'lucide-react'

// Social media icons
const FacebookIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

const WhatsAppIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const XTwitterIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const LinkedInIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
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
    publishedAt?: string | null
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

// Star icon for Results header
const StarIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

// Donut Chart Component with gap at bottom
function DonutChart({
  results,
}: {
  results: Array<{ text: string; votes: number; percentage: number }>
}) {
  const colors = ['#6366f1', '#a3e635', '#f97316', '#ec4899', '#8b5cf6', '#14b8a6']
  const size = 220
  const strokeWidth = 45
  const radius = (size - strokeWidth) / 2
  const center = size / 2

  // Gap at the bottom - 60 degrees (30 degrees on each side of bottom)
  const gapDegrees = 60
  const availableDegrees = 360 - gapDegrees
  const startAngle = 90 + gapDegrees / 2 // Start from bottom-left

  // Calculate arc path
  const polarToCartesian = (cx: number, cy: number, r: number, angleDegrees: number) => {
    const angleRadians = ((angleDegrees - 90) * Math.PI) / 180
    return {
      x: cx + r * Math.cos(angleRadians),
      y: cy + r * Math.sin(angleRadians),
    }
  }

  const describeArc = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(cx, cy, r, endAngle)
    const end = polarToCartesian(cx, cy, r, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`
  }

  // Calculate segment angles based on percentages
  let currentAngle = startAngle
  const segments = results.map((option, index) => {
    const segmentDegrees = (option.percentage / 100) * availableDegrees
    const segment = {
      startAngle: currentAngle,
      endAngle: currentAngle + segmentDegrees,
      percentage: option.percentage,
      color: colors[index % colors.length],
      midAngle: currentAngle + segmentDegrees / 2,
    }
    currentAngle += segmentDegrees
    return segment
  })

  return (
    <div className="relative" style={{ width: size + 80, height: size + 40 }}>
      <svg
        width={size + 80}
        height={size + 40}
        className="overflow-visible"
      >
        <g transform={`translate(40, 20)`}>
          {/* Background track */}
          <path
            d={describeArc(center, center, radius, startAngle, startAngle + availableDegrees)}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Segments */}
          {segments.map((segment, index) => (
            <path
              key={index}
              d={describeArc(center, center, radius, segment.startAngle, segment.endAngle - 1)}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          ))}

          {/* Percentage labels with dashed lines */}
          {segments.map((segment, index) => {
            const labelRadius = radius + strokeWidth / 2 + 25
            const labelPos = polarToCartesian(center, center, labelRadius, segment.midAngle)
            const lineStart = polarToCartesian(center, center, radius + strokeWidth / 2 + 5, segment.midAngle)
            const lineEnd = polarToCartesian(center, center, radius + strokeWidth / 2 + 18, segment.midAngle)

            // Determine if label should be on left or right
            const isLeftSide = segment.midAngle > 180

            return (
              <g key={`label-${index}`}>
                {/* Dashed line */}
                <line
                  x1={lineStart.x}
                  y1={lineStart.y}
                  x2={lineEnd.x}
                  y2={lineEnd.y}
                  stroke="#9ca3af"
                  strokeWidth="1"
                  strokeDasharray="3,2"
                />
                {/* Percentage text */}
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor={isLeftSide ? 'end' : 'start'}
                  dominantBaseline="middle"
                  className="text-sm font-bold"
                  fill={segment.color}
                >
                  {segment.percentage}%
                </text>
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}

// Share Card Component for social sharing
function ShareCard({
  question,
  results,
  heroImageUrl,
  votedOption,
}: {
  question: string
  results: Array<{ text: string; votes: number; percentage: number }>
  heroImageUrl?: string | null
  votedOption?: string | null
}) {
  const colors = ['#6366f1', '#a3e635', '#f97316', '#ec4899', '#8b5cf6', '#14b8a6']
  const size = 200
  const strokeWidth = 32
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const centerSize = size - strokeWidth * 2 - 8

  // Calculate stroke dasharray for each segment
  let cumulativePercent = 0
  const segments = results.map((option, index) => {
    const percent = option.percentage || 0
    const dashLength = (percent / 100) * circumference
    const dashOffset = circumference - (cumulativePercent / 100) * circumference
    cumulativePercent += percent
    return {
      color: colors[index % colors.length],
      dashArray: `${dashLength} ${circumference - dashLength}`,
      dashOffset: dashOffset,
      percent,
    }
  })

  return (
    <div
      style={{
        width: '600px',
        padding: '32px',
        backgroundColor: '#f3f4f6',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Question */}
      <h1
        style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#111827',
          textAlign: 'center' as const,
          margin: '0 0 24px 0',
          wordSpacing: '4px',
        }}
      >
        {question}
      </h1>

      {/* Chart and Legend Container */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px' }}>
        {/* Donut Chart - using div-based approach for better html2canvas compatibility */}
        <div
          style={{
            position: 'relative',
            width: `${size}px`,
            height: `${size}px`,
          }}
        >
          {/* SVG Donut Ring */}
          <svg
            width={size}
            height={size}
            style={{
              transform: 'rotate(-90deg)',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          >
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth={strokeWidth}
            />
            {/* Colored segments - render in reverse order so first segment is on top */}
            {[...segments].reverse().map((segment, index) => (
              <circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={segment.dashArray}
                strokeDashoffset={segment.dashOffset}
                strokeLinecap="butt"
              />
            ))}
          </svg>

          {/* White border ring */}
          <div
            style={{
              position: 'absolute',
              top: `${(size - centerSize - 8) / 2}px`,
              left: `${(size - centerSize - 8) / 2}px`,
              width: `${centerSize + 8}px`,
              height: `${centerSize + 8}px`,
              borderRadius: '50%',
              backgroundColor: 'white',
            }}
          />

          {/* Center image container */}
          <div
            style={{
              position: 'absolute',
              top: `${(size - centerSize) / 2}px`,
              left: `${(size - centerSize) / 2}px`,
              width: `${centerSize}px`,
              height: `${centerSize}px`,
              borderRadius: '50%',
              backgroundColor: '#f3f4f6',
              overflow: 'hidden',
            }}
          >
            {heroImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={heroImageUrl}
                alt=""
                crossOrigin="anonymous"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {results.map((option, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '4px',
                  backgroundColor: colors[index % colors.length],
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: '16px', color: '#374151', minWidth: '40px' }}>
                {option.text}
              </span>
              <span style={{ fontSize: '16px', color: '#6b7280' }}>
                {option.votes}&nbsp;votes&nbsp;{option.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Voted Message */}
      {votedOption && (
        <p
          style={{
            fontSize: '16px',
            color: '#374151',
            textAlign: 'center' as const,
            margin: '24px 0 0 0',
          }}
        >
          I&nbsp;voted&nbsp;{votedOption}.&nbsp;What&nbsp;about&nbsp;you?
        </p>
      )}
    </div>
  )
}

export function PollDetail({ poll, countrySlug }: PollDetailProps) {
  const [hasVoted, setHasVoted] = useState(false)
  const [votedOptionIndex, setVotedOptionIndex] = useState<number | null>(null)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [results, setResults] = useState<Array<{ text: string; votes: number; percentage: number }>>(
    [],
  )
  const [totalVotes, setTotalVotes] = useState(poll.totalVotes)
  const [isLoading, setIsLoading] = useState(true)
  const [isVoting, setIsVoting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [nextPollSlug, setNextPollSlug] = useState<string | null>(null)
  const [nextPollCountrySlug, setNextPollCountrySlug] = useState<string | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const shareCardRef = useRef<HTMLDivElement>(null)

  // Fetch next poll that user hasn't voted on
  const fetchNextPoll = useCallback(async () => {
    try {
      // Fetch all polls (no country filter to ensure we get results)
      const res = await fetch(`/api/polls-list?limit=50`)
      const data = await res.json()

      if (data.polls && data.polls.length > 0) {
        const visitorId = getVisitorId()

        // Filter out current poll
        const otherPolls = data.polls.filter((p: any) => p.id !== poll.id && p.slug !== poll.slug)

        if (otherPolls.length === 0) {
          return
        }

        // Helper to set next poll with country slug
        const setNextPoll = (p: any) => {
          setNextPollSlug(p.slug)
          // Get country slug from poll or use current countrySlug
          const pCountrySlug = p.country?.slug
            ? p.country.slug.toLowerCase().replace(/\s+/g, '')
            : countrySlug
          setNextPollCountrySlug(pCountrySlug)
        }

        // Check each poll to find one user hasn't voted on
        for (const p of otherPolls) {
          try {
            const voteRes = await fetch(`/api/poll-vote/${p.id}?visitorId=${visitorId}`)
            const voteData = await voteRes.json()
            if (!voteData.hasVoted) {
              setNextPoll(p)
              return
            }
          } catch {
            // If check fails, still use this poll
            setNextPoll(p)
            return
          }
        }

        // If all polls are voted, just use the first other poll
        setNextPoll(otherPolls[0])
      }
    } catch (error) {
      console.error('Error fetching next poll:', error)
    }
  }, [poll.id, poll.slug, countrySlug])

  useEffect(() => {
    fetchNextPoll()
  }, [fetchNextPoll])

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
        // Don't show results immediately - user needs to click "See Results"
        setShowResults(false)
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
        // Don't show results immediately - user needs to click "See Results"
        setShowResults(false)
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

  const captureAndShare = async (platform: string) => {
    if (!shareCardRef.current) return

    try {
      // Small delay to ensure image is loaded
      await new Promise((resolve) => setTimeout(resolve, 100))

      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: '#f3f4f6',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      })

      // Convert to blob for potential download/sharing
      const imageDataUrl = canvas.toDataURL('image/png')
      console.log('Share image generated:', imageDataUrl.substring(0, 100))

      // Get voted option text
      const votedText = votedOptionIndex !== null ? results[votedOptionIndex]?.text : ''
      const shareText = votedText
        ? `I voted ${votedText}. What about you? ${poll.question}`
        : `${poll.question} - See the results!`

      const url = encodeURIComponent(window.location.href)
      const text = encodeURIComponent(shareText)

      // Handle different platforms
      switch (platform) {
        case 'download':
          // Download the image
          const link = document.createElement('a')
          link.download = `poll-results-${poll.slug}.png`
          link.href = imageDataUrl
          link.click()
          break
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank')
          break
        case 'whatsapp':
          window.open(`https://wa.me/?text=${text}%20${url}`, '_blank')
          break
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank')
          break
        case 'linkedin':
          window.open(
            `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`,
            '_blank',
          )
          break
      }
    } catch (error) {
      console.error('Error capturing screenshot:', error)
      // Fallback to regular share
      const url = encodeURIComponent(window.location.href)
      const text = encodeURIComponent(poll.question)

      switch (platform) {
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
          break
        case 'whatsapp':
          window.open(`https://wa.me/?text=${text}%20${url}`, '_blank')
          break
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank')
          break
        case 'linkedin':
          window.open(
            `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`,
            '_blank',
          )
          break
      }
    }
  }

  const colors = ['#6366f1', '#a3e635', '#f97316', '#ec4899', '#8b5cf6', '#14b8a6']

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
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href={`/${countrySlug}`} className="hover:text-gray-700">
          {countrySlug}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-indigo-600">Poll</span>
      </nav>

      {/* Tags */}
      {poll.tags && poll.tags.length > 0 && (
        <div className="mb-3">
          <span className="text-gray-500 text-[14px]">Tags: </span>
          {poll.tags.map((tag, index) => (
            <Link
              key={index}
              href={`/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-indigo-600 text-[14px] hover:underline"
            >
              {tag}
              {index < poll.tags!.length - 1 ? ', ' : ''}
            </Link>
          ))}
        </div>
      )}

      {/* Question - show only before voting */}
      {!hasVoted && (
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{poll.question}</h1>
      )}

      {/* Hero Image - show only before voting */}
      {!hasVoted && poll.heroImage?.url && (
        <div className="relative w-full h-48 sm:h-64 md:h-80 rounded-lg overflow-hidden mb-4">
          <Image
            src={poll.heroImage.url}
            alt={poll.heroImage.alt || poll.question}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Options - show only before voting */}
      {!hasVoted && (
        <div className="space-y-3 mb-4">
          {poll.options.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedOption(index)}
              className={`w-full p-4 text-left text-lg rounded-lg border-2 transition-all ${
                selectedOption === index
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="font-medium text-lg">{option.text}</span>
            </button>
          ))}
        </div>
      )}

      {/* Vote Count - show only before voting */}
      {!hasVoted && (
        <p className="text-gray-600 text-base mb-4">{totalVotes.toLocaleString()} Votes</p>
      )}

      {/* Share Card - show after voting but before showing results */}
      {hasVoted && !showResults && results.length > 0 && (
        <div className="mb-6">
          <div className="bg-gray-100 rounded-xl overflow-hidden">
            <ShareCard
              question={poll.question}
              results={results}
              heroImageUrl={poll.heroImage?.url}
              votedOption={votedOptionIndex !== null ? results[votedOptionIndex]?.text : null}
            />
          </div>

          {/* Share buttons */}
          <div className="mt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Share Your Vote</h3>
            <div className="flex gap-3">
              <button
                onClick={() => captureAndShare('facebook')}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FacebookIcon />
                <span className="text-[14px] font-medium">Facebook</span>
              </button>
              <button
                onClick={() => captureAndShare('whatsapp')}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <WhatsAppIcon />
                <span className="text-[14px] font-medium">Whatsapp</span>
              </button>
              <button
                onClick={() => captureAndShare('twitter')}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <XTwitterIcon />
                <span className="text-[14px] font-medium">Twitter</span>
              </button>
              <button
                onClick={() => captureAndShare('linkedin')}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <LinkedInIcon />
                <span className="text-[14px] font-medium">Linkedin</span>
              </button>
            </div>
          </div>
        </div>
      )}

     

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
        /* After voting, before showing results - show related polls and posts */
        <>
          {/* Similar Polls */}
          {poll.relatedPolls && poll.relatedPolls.length > 0 && (
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg mb-4">
                <span>&#9733;</span>
                <span className="font-medium text-[14px]">Similar Polls</span>
              </div>
              <div className="overflow-x-auto scrollbar-hide -mx-1 px-1">
                <div className="flex gap-3 pb-2">
                  {poll.relatedPolls.map((relatedPoll) => (
                    <Link
                      key={relatedPoll.id}
                      href={`/${countrySlug}/poll/${relatedPoll.slug}`}
                      className="flex-shrink-0 w-[143px] bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="relative w-full h-[90px] bg-gray-100">
                        {relatedPoll.heroImage?.url ? (
                          <Image
                            src={relatedPoll.heroImage.url}
                            alt={relatedPoll.heroImage.alt || relatedPoll.question}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <ListTodo className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-gray-600 text-[13px] line-clamp-2">
                          {relatedPoll.description || relatedPoll.question}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Similar Topics (Related Posts) */}
          {poll.relatedPosts && poll.relatedPosts.length > 0 && (
            <div>
              <div className="inline-flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded-lg mb-2">
                <span>&#9733;</span>
                <span className="font-medium text-[14px]">Similar Topics</span>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {poll.relatedPosts.map((post, index) => {
                  const formattedDate = post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : null
                  return (
                    <div key={post.id} className={index > 0 ? 'border-t border-gray-200' : ''}>
                      <Link
                        href={`/${countrySlug}/${post.slug}`}
                        className="block hover:bg-gray-50 transition-colors"
                      >
                        <div className="px-3 sm:px-6 py-3">
                          <div className="flex items-center justify-between gap-2 sm:gap-4">
                            <div className="flex gap-2 sm:gap-4 items-start flex-1 min-w-0">
                              {formattedDate && (
                                <span className="text-indigo-600 text-sm shrink-0 pt-0.5">
                                  {formattedDate}
                                </span>
                              )}
                              <div className="flex-1 min-w-0">
                                <h3 className="text-gray-900 font-medium text-base leading-snug truncate">
                                  {post.title}
                                </h3>
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
            </div>
          )}
        </>
      ) : (
        <>
          {/* After showing results - show Take Another Poll button */}
          <Link
            href={nextPollSlug && nextPollCountrySlug ? `/${nextPollCountrySlug}/poll/${nextPollSlug}` : `/${countrySlug}?tab=polls`}
            className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors mb-6"
          >
            <ListTodo className="w-5 h-5" />
            Take Another Poll
          </Link>

          {/* Share Section */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Tell Your Friends About This Poll</h3>
            {/* Download Button */}
            {/* <button
              onClick={() => captureAndShare('download')}
              className="w-full flex items-center justify-center gap-2 py-3 mb-3 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="text-[14px] font-medium">Download Share Image</span>
            </button> */}
            <div className="flex gap-3">
              <button
                onClick={() => captureAndShare('facebook')}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FacebookIcon />
                <span className="text-[14px] font-medium">Facebook</span>
              </button>
              <button
                onClick={() => captureAndShare('whatsapp')}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <WhatsAppIcon />
                <span className="text-[14px] font-medium">Whatsapp</span>
              </button>
              <button
                onClick={() => captureAndShare('twitter')}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <XTwitterIcon />
                <span className="text-[14px] font-medium">Twitter</span>
              </button>
              <button
                onClick={() => captureAndShare('linkedin')}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                <LinkedInIcon />
                <span className="text-[14px] font-medium">Linkedin</span>
              </button>
            </div>
          </div>

          {/* Affiliate Offer Box */}
          <div className="bg-gray-100 rounded-xl p-4 flex gap-4 mb-8">
            {poll.heroImage?.url && (
              <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={poll.heroImage.url}
                  alt={poll.heroImage.alt || 'Offer'}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-1 text-indigo-600 font-medium text-[14px] mb-2">
                <span>&#10024;</span>
                <span>Affiliate Offer Box</span>
              </div>
              <p className="text-gray-600 text-[14px] mb-3">
                In magna tellus consectetur eu etiam adipiscing scelerisque tristique. Congue
                posuere auctor sed quis tortor fusce etiam.
              </p>
              <button className="px-6 py-2 bg-indigo-600 text-white text-[14px] font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                Get This Offer
              </button>
            </div>
          </div>

          {/* Similar Polls */}
          {poll.relatedPolls && poll.relatedPolls.length > 0 && (
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg mb-4">
                <span>&#9733;</span>
                <span className="font-medium text-[14px]">Similar Polls</span>
              </div>
              <div className="overflow-x-auto scrollbar-hide -mx-1 px-1">
                <div className="flex gap-3 pb-2">
                  {poll.relatedPolls.map((relatedPoll) => (
                    <Link
                      key={relatedPoll.id}
                      href={`/${countrySlug}/poll/${relatedPoll.slug}`}
                      className="flex-shrink-0 w-[143px] bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="relative w-full h-[90px] bg-gray-100">
                        {relatedPoll.heroImage?.url ? (
                          <Image
                            src={relatedPoll.heroImage.url}
                            alt={relatedPoll.heroImage.alt || relatedPoll.question}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <ListTodo className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-gray-600 text-[13px] line-clamp-2">
                          {relatedPoll.description || relatedPoll.question}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Similar Topics (Related Posts) */}
          {poll.relatedPosts && poll.relatedPosts.length > 0 && (
            <div>
              <div className="inline-flex items-center gap-2 bg-indigo-600 text-white px-3 py-1.5 rounded-lg">
                <span>&#9733;</span>
                <span className="font-medium text-[14px]">Similar Topics</span>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {poll.relatedPosts.map((post, index) => {
                  const imageUrl = post.heroImage?.url
                  return (
                    <div
                      key={post.id}
                      className={index > 0 ? 'border-t border-gray-200 py-1' : ''}
                    >
                      <Link
                        href={`/${countrySlug}/${post.slug}`}
                        className="block hover:bg-gray-50 transition-colors"
                      >
                        <div className="px-3 sm:px-6 py-3 sm:py-4">
                          <div className="flex items-center justify-between gap-2 sm:gap-4">
                            <div className="flex gap-2 sm:gap-4 items-start flex-1 min-w-0">
                              <span className="text-indigo-600 text-sm sm:text-sm shrink-0 pt-0.5">
                                {post.publishedAt || 'Nov 22'}
                              </span>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-gray-900 font-medium text-base sm:text-base leading-snug">
                                  {post.title}
                                </h3>
                              </div>
                            </div>
                            {imageUrl ? (
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
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Hidden Share Card for capturing */}
      {hasVoted && results.length > 0 && (
        <div
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: -1,
            opacity: 0,
            pointerEvents: 'none',
          }}
        >
          <div ref={shareCardRef}>
            <ShareCard
              question={poll.question}
              results={results}
              heroImageUrl={poll.heroImage?.url}
              votedOption={votedOptionIndex !== null ? results[votedOptionIndex]?.text : null}
            />
          </div>
        </div>
      )}
    </div>
  )
}
