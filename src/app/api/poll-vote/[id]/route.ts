import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: pollId } = await params
    const body = await req.json()
    const { optionIndex, visitorId } = body

    if (typeof optionIndex !== 'number' || optionIndex < 0) {
      return NextResponse.json(
        { error: 'Invalid option index' },
        { status: 400 }
      )
    }

    if (!visitorId) {
      return NextResponse.json(
        { error: 'Visitor ID is required' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config: configPromise })

    // Get the poll
    const poll = await payload.findByID({
      collection: 'polls',
      id: pollId,
    })

    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      )
    }

    if (poll.status !== 'active') {
      return NextResponse.json(
        { error: 'This poll is no longer active' },
        { status: 400 }
      )
    }

    if (!poll.options || optionIndex >= poll.options.length) {
      return NextResponse.json(
        { error: 'Invalid option' },
        { status: 400 }
      )
    }

    // Check if user already voted
    const existingVote = await payload.find({
      collection: 'poll-votes',
      where: {
        poll: { equals: pollId },
        visitorId: { equals: visitorId },
      },
      limit: 1,
    })

    if (existingVote.docs.length > 0) {
      return NextResponse.json(
        { error: 'You have already voted on this poll', alreadyVoted: true },
        { status: 400 }
      )
    }

    // Get IP and User Agent
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'

    // Create vote record
    await payload.create({
      collection: 'poll-votes',
      data: {
        poll: pollId,
        optionIndex,
        visitorId,
        ipAddress,
        userAgent,
      },
    })

    // Update poll vote count
    const updatedOptions = poll.options.map((option: any, index: number) => ({
      ...option,
      votes: index === optionIndex ? (option.votes || 0) + 1 : (option.votes || 0),
    }))

    const updatedPoll = await payload.update({
      collection: 'polls',
      id: pollId,
      data: {
        options: updatedOptions,
        totalVotes: (poll.totalVotes || 0) + 1,
      },
    })

    // Calculate percentages
    const totalVotes = updatedPoll.totalVotes || 1
    const results = updatedPoll.options?.map((option: any) => ({
      text: option.text,
      votes: option.votes || 0,
      percentage: Math.round(((option.votes || 0) / totalVotes) * 100),
    })) || []

    return NextResponse.json({
      success: true,
      message: 'Vote recorded successfully',
      results,
      totalVotes: updatedPoll.totalVotes,
      votedOptionIndex: optionIndex,
    })
  } catch (error: any) {
    console.error('Vote error:', error)
    return NextResponse.json(
      { error: 'Failed to record vote', details: error.message },
      { status: 500 }
    )
  }
}

// Check if user has already voted
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: pollId } = await params
    const { searchParams } = new URL(req.url)
    const visitorId = searchParams.get('visitorId')

    if (!visitorId) {
      return NextResponse.json(
        { error: 'Visitor ID is required' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config: configPromise })

    // Get the poll
    const poll = await payload.findByID({
      collection: 'polls',
      id: pollId,
      depth: 1,
    })

    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      )
    }

    // Check if user already voted
    const existingVote = await payload.find({
      collection: 'poll-votes',
      where: {
        poll: { equals: pollId },
        visitorId: { equals: visitorId },
      },
      limit: 1,
    })

    const hasVoted = existingVote.docs.length > 0
    const votedOptionIndex = hasVoted ? existingVote.docs[0].optionIndex : null

    // Calculate percentages
    const totalVotes = poll.totalVotes || 0
    const results = poll.options?.map((option: any) => ({
      text: option.text,
      votes: option.votes || 0,
      percentage: totalVotes > 0 ? Math.round(((option.votes || 0) / totalVotes) * 100) : 0,
    })) || []

    return NextResponse.json({
      hasVoted,
      votedOptionIndex,
      results,
      totalVotes,
    })
  } catch (error: any) {
    console.error('Check vote error:', error)
    return NextResponse.json(
      { error: 'Failed to check vote status', details: error.message },
      { status: 500 }
    )
  }
}
