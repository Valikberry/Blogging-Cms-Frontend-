// app/api/posts/[id]/increment-view/route.ts
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { id } = await params

    // Get current post
    const post = await payload.findByID({
      collection: 'posts',
      id,
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await payload.update({
      collection: 'posts',
      id,
      data: {
        viewCount: (post.viewCount || 0) + 1,
      },
    })

    return NextResponse.json({ 
      success: true,
      viewCount: (post.viewCount || 0) + 1
    })
  } catch (error) {
    console.error('Error incrementing view count:', error)
    return NextResponse.json(
      { error: 'Failed to increment view count' },
      { status: 500 }
    )
  }
}