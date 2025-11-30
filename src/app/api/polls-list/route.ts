import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const countryId = searchParams.get('countryId')
    const status = searchParams.get('status') || 'active'

    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config: configPromise })

    const whereQuery: any = {}

    if (status !== 'all') {
      whereQuery.status = { equals: status }
    }

    if (countryId) {
      whereQuery.country = { equals: countryId }
    }

    const result = await payload.find({
      collection: 'polls',
      where: whereQuery,
      limit,
      page,
      sort: '-publishedAt',
      depth: 1,
    })

    const polls = result.docs.map((poll: any) => {
      const heroImage = typeof poll.heroImage === 'object' ? poll.heroImage : null
      const country = typeof poll.country === 'object' ? poll.country : null

      // Format date
      let formattedDate = ''
      if (poll.publishedAt) {
        const date = new Date(poll.publishedAt)
        formattedDate = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
      }

      return {
        id: poll.id,
        question: poll.question,
        slug: poll.slug,
        description: poll.description || null,
        publishedAt: formattedDate,
        rawDate: poll.publishedAt,
        status: poll.status,
        totalVotes: poll.totalVotes || 0,
        options: poll.options?.map((opt: any) => ({
          text: opt.text,
          votes: opt.votes || 0,
        })) || [],
        tags: poll.tags?.map((t: any) => t.tag) || [],
        heroImage: heroImage ? { url: heroImage.url || null, alt: heroImage.alt || null } : null,
        country: country ? {
          id: country.id,
          name: country.name,
          slug: country.slug,
        } : null,
      }
    })

    return NextResponse.json({
      polls,
      pagination: {
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        totalDocs: result.totalDocs,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      },
    })
  } catch (error: any) {
    console.error('Fetch polls error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch polls', details: error.message },
      { status: 500 }
    )
  }
}
