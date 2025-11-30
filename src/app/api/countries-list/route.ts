import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'countries',
      limit: 100,
      depth: 1,
      sort: 'name',
    })

    const countries = result.docs.map((country: any) => {
      const flag = typeof country.flag === 'object' ? country.flag : null

      return {
        id: country.id,
        name: country.name,
        slug: country.slug,
        flag: flag ? { url: flag.url || null } : null,
      }
    })

    return NextResponse.json({
      countries,
      total: result.totalDocs,
    })
  } catch (error: any) {
    console.error('Fetch countries error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch countries', details: error.message },
      { status: 500 }
    )
  }
}
