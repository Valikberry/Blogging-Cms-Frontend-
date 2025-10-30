import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = body

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config: configPromise })

    // Find subscriber
    const subscriber = await payload.find({
      collection: 'subscribers',
      where: {
        email: {
          equals: email.toLowerCase(),
        },
      },
      limit: 1,
    })

    if (subscriber.docs.length === 0) {
      return NextResponse.json(
        { error: 'Email not found in our subscription list' },
        { status: 404 }
      )
    }

    const subscriberDoc = subscriber.docs[0]

    // Update subscriber to inactive
    await payload.update({
      collection: 'subscribers',
      id: subscriberDoc.id,
      data: {
        isActive: false,
        unsubscribedAt: new Date().toISOString(),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'You have been successfully unsubscribed.',
    })
  } catch (error: any) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json(
      {
        error: 'Failed to unsubscribe. Please try again later.',
        details: error.message
      },
      { status: 500 }
    )
  }
}
