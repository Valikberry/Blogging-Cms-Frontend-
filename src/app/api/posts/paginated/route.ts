import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '15')
    const countryId = searchParams.get('countryId')
    const filter = searchParams.get('filter') || 'new' // 'new', 'hot', 'stories'
    const dateFormat = searchParams.get('dateFormat') || 'short'

    // Validate parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config: configPromise })

    // Build where query
    const whereQuery: any = {
      _status: { equals: 'published' },
    }

    // Add country filter if specified
    if (countryId) {
      whereQuery.country = { equals: countryId }
    }

    // Add filter-specific conditions
    if (filter === 'hot') {
      whereQuery.isHot = { equals: true }
    } else if (filter === 'stories') {
      whereQuery.isStories = { equals: true }
    }

    // Fetch posts with pagination
    const result = await payload.find({
      collection: 'posts',
      where: whereQuery,
      limit,
      page,
      sort: '-publishedAt',
      depth: 1,
    })

    // Format posts
    const posts = result.docs.map((post: any) => {
      // Format date based on dateFormat param
      let formattedDate = ''
      const date = new Date(post.publishedAt)

      if (dateFormat === 'short') {
        formattedDate = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
      } else if (dateFormat === 'long') {
        formattedDate = date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
        })
      } else if (dateFormat === 'full') {
        formattedDate = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      }

      const heroImage = typeof post.heroImage === 'object' ? post.heroImage : null
      const country = typeof post.country === 'object' ? post.country : null

      return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        publishedAt: formattedDate,
        rawDate: post.publishedAt,
        source: post.source || post.populatedAuthors?.[0]?.name || null,
        isHot: post.isHot || false,
        isStories: post.isStories || false,
        heroImage: heroImage ? { url: heroImage.url || null, alt: heroImage.alt || null } : null,
        excerpt: post.excerpt || null,
        videoEmbed: post.videoEmbed || null,
        country: country ? {
          id: country.id,
          name: country.name,
          slug: country.slug,
        } : null,
      }
    })

    return NextResponse.json({
      posts,
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
    console.error('Fetch posts error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch posts',
        details: error.message
      },
      { status: 500 }
    )
  }
}
