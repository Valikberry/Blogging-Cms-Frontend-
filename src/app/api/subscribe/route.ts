import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, source, countryId } = body

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config: configPromise })

    // Check if email already exists
    const existingSubscriber = await payload.find({
      collection: 'subscribers',
      where: {
        email: {
          equals: email.toLowerCase(),
        },
      },
      limit: 1,
    })

    if (existingSubscriber.docs.length > 0) {
      const subscriber = existingSubscriber.docs[0]

      // If previously unsubscribed, reactivate
      if (!subscriber.isActive) {
        await payload.update({
          collection: 'subscribers',
          id: subscriber.id,
          data: {
            isActive: true,
            subscribedAt: new Date().toISOString(),
            unsubscribedAt: null,
          },
        })

        return NextResponse.json({
          success: true,
          message: 'Your subscription has been reactivated!',
        })
      }

      return NextResponse.json({
        success: true,
        message: 'You are already subscribed!',
      })
    }

    // Create new subscriber
    const newSubscriber = await payload.create({
      collection: 'subscribers',
      data: {
        email: email.toLowerCase(),
        isActive: true,
        source: source || 'website',
        country: countryId || null,
        subscribedAt: new Date().toISOString(),
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed! Thank you for joining us.',
      subscriber: {
        id: newSubscriber.id,
        email: newSubscriber.email,
      },
    })
  } catch (error: any) {
    console.error('Subscription error:', error)

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json({
        success: true,
        message: 'You are already subscribed!',
      })
    }

    return NextResponse.json(
      {
        error: 'Failed to subscribe. Please try again later.',
        details: error.message
      },
      { status: 500 }
    )
  }
}

// Optional: GET endpoint to check subscription status
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config: configPromise })

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
      return NextResponse.json({
        subscribed: false,
      })
    }

    return NextResponse.json({
      subscribed: subscriber.docs[0].isActive,
      subscribedAt: subscriber.docs[0].subscribedAt,
    })
  } catch (error) {
    console.error('Check subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    )
  }
}
