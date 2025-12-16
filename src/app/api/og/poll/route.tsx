import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const pollId = searchParams.get('id')

    if (!pollId) {
      return new Response('Poll ID required', { status: 400 })
    }

    // Fetch from API - use absolute URL for production
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://askgeopolitics.com'
    const apiUrl = `${baseUrl}/api/polls-list?limit=100`

    const pollRes = await fetch(apiUrl, {
      headers: { 'Content-Type': 'application/json' }
    })

    if (!pollRes.ok) {
      return new ImageResponse(
        (
          <div style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f3f4f6',
            fontSize: '48px',
            color: '#111827',
          }}>
            AskGeopolitics Poll
          </div>
        ),
        { width: 1200, height: 630 }
      )
    }

    const pollData = await pollRes.json()
    const poll = pollData.polls?.find((p: any) => p.slug === pollId || p.id === pollId)

    if (!poll) {
      return new Response('Poll not found', { status: 404 })
    }

    const heroImageUrl = poll.heroImage?.url || null
    // Make hero image URL absolute
    const absoluteHeroUrl = heroImageUrl
      ? (heroImageUrl.startsWith('http') ? heroImageUrl : `${baseUrl}${heroImageUrl}`)
      : null

    const totalVotes = poll.totalVotes || 0
    const options = poll.options || []

    // Calculate percentages
    const results = options.map((opt: any) => ({
      text: opt.text,
      votes: opt.votes || 0,
      percentage: totalVotes > 0 ? Math.round(((opt.votes || 0) / totalVotes) * 100) : 0,
    }))

    // Use lime green for Yes, red for No, then fallback colors (same as ShareCard)
    const getColor = (text: string, index: number) => {
      const lowerText = text.toLowerCase()
      if (lowerText === 'yes') return '#84cc16' // lime-500
      if (lowerText === 'no') return '#ef4444' // red-500
      const fallbackColors = ['#6366f1', '#f97316', '#ec4899', '#8b5cf6', '#14b8a6']
      return fallbackColors[index % fallbackColors.length]
    }

    // Donut chart dimensions
    const size = 340
    const strokeWidth = 50
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const centerSize = size - strokeWidth * 2 - 16

    // Calculate segments for donut chart
    let cumulativePercent = 0
    const segments = results.map((option: any, index: number) => {
      const percent = option.percentage || 0
      const dashLength = (percent / 100) * circumference
      const dashOffset = circumference - (cumulativePercent / 100) * circumference
      cumulativePercent += percent
      return {
        color: getColor(option.text, index),
        dashArray: `${dashLength} ${circumference - dashLength}`,
        dashOffset: dashOffset,
        percent,
      }
    })

    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#e8e8ed',
            padding: '24px',
          }}
        >
          {/* Card container */}
          <div
            style={{
              width: '1152px',
              height: '582px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '32px 48px',
            }}
          >
            {/* Site header */}
            <div
              style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#6366f1',
                textAlign: 'center',
                marginBottom: '4px',
                display: 'flex',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              ASKGEOPOLITICS.COM
            </div>

            {/* Question */}
            <div
              style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: '#000000',
                textAlign: 'center',
                marginBottom: '32px',
                maxWidth: '900px',
                lineHeight: 1.25,
                display: 'flex',
              }}
            >
              {poll.question}
            </div>

            {/* Chart and Legend Container */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '64px', flex: 1 }}>
              {/* Donut Chart */}
              <div
                style={{
                  position: 'relative',
                  width: `${size}px`,
                  height: `${size}px`,
                  display: 'flex',
                }}
              >
                {/* SVG Donut Ring */}
                <svg
                  width={size}
                  height={size}
                  viewBox={`0 0 ${size} ${size}`}
                  style={{
                    transform: 'rotate(-90deg)',
                  }}
                >
                  {/* Background circle */}
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#d1d5db"
                    stroke-width={strokeWidth}
                  />
                  {/* Colored segments - render in reverse order */}
                  {[...segments].reverse().map((segment: any, index: number) => (
                    <circle
                      key={index}
                      cx={size / 2}
                      cy={size / 2}
                      r={radius}
                      fill="none"
                      stroke={segment.color}
                      stroke-width={strokeWidth}
                      stroke-dasharray={segment.dashArray}
                      stroke-dashoffset={segment.dashOffset}
                    />
                  ))}
                </svg>

                {/* White border ring */}
                <div
                  style={{
                    position: 'absolute',
                    top: `${(size - centerSize - 20) / 2}px`,
                    left: `${(size - centerSize - 20) / 2}px`,
                    width: `${centerSize + 20}px`,
                    height: `${centerSize + 20}px`,
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    display: 'flex',
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
                    backgroundColor: '#9ca3af',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {absoluteHeroUrl ? (
                    <img
                      src={absoluteHeroUrl}
                      alt=""
                      width={centerSize}
                      height={centerSize}
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                  ) : (
                    <div style={{ fontSize: '32px', color: 'white', display: 'flex' }}>Poll</div>
                  )}
                </div>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {results.map((option: any, index: number) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '4px',
                        backgroundColor: getColor(option.text, index),
                        flexShrink: 0,
                        display: 'flex',
                      }}
                    />
                    <div style={{ fontSize: '28px', color: '#000000', display: 'flex', minWidth: '60px', fontWeight: '500' }}>
                      {option.text}
                    </div>
                    <div style={{ fontSize: '26px', color: '#6b7280', display: 'flex' }}>
                      {option.votes} votes {option.percentage}%
                    </div>
                  </div>
                ))}

                {/* Voted message under legend */}
                <div
                  style={{
                    display: 'flex',
                    marginTop: '12px',
                    fontSize: '26px',
                    color: '#000000',
                    fontWeight: '500',
                  }}
                >
                  I voted {results[0]?.text || 'Yes'}. What about you?
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (error: any) {
    console.error('Error generating OG image:', error)
    return new ImageResponse(
      (
        <div style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f3f4f6',
          fontSize: '48px',
          color: '#111827',
          flexDirection: 'column',
          gap: '20px',
        }}>
          <div style={{ display: 'flex' }}>AskGeopolitics</div>
          <div style={{ fontSize: '32px', color: '#6366f1', display: 'flex' }}>Vote on this poll!</div>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }
}
