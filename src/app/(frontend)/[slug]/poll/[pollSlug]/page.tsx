import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import { PollDetail } from '@/components/PollDetail'

export const revalidate = 60

type Args = {
  params: Promise<{
    slug: string
    pollSlug: string
  }>
}

// Cache poll query - tries slug first, then ID
const queryPollBySlugOrId = cache(async (slugOrId: string) => {
  const payload = await getPayload({ config: configPromise })

  // First try by slug
  const bySlug = await payload.find({
    collection: 'polls',
    where: {
      slug: {
        equals: slugOrId,
      },
    },
    limit: 1,
    depth: 2,
  })

  if (bySlug.docs[0]) {
    return bySlug.docs[0]
  }

  // If not found by slug, try by ID
  try {
    const byId = await payload.findByID({
      collection: 'polls',
      id: slugOrId,
      depth: 2,
    })
    return byId || null
  } catch {
    return null
  }
})

// Cache country query - handles slugs with or without spaces
const queryCountryBySlug = cache(async (slug: string) => {
  const payload = await getPayload({ config: configPromise })

  // Try exact match first
  const result = await payload.find({
    collection: 'countries',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  if (result.docs[0]) {
    return result.docs[0]
  }

  // If not found, fetch all countries and find one where slug (with spaces removed) matches
  const allCountries = await payload.find({
    collection: 'countries',
    limit: 100,
  })

  const normalizedSlug = slug.toLowerCase().replace(/\s+/g, '')
  const match = allCountries.docs.find((c) => {
    const countrySlug = (c.slug || '').toLowerCase().replace(/\s+/g, '')
    return countrySlug === normalizedSlug
  })

  return match || null
})

export default async function PollPage({ params: paramsPromise }: Args) {
  const { slug: countrySlug, pollSlug } = await paramsPromise

  // Verify country exists (try both hyphenated and spaced versions)
  const country = await queryCountryBySlug(countrySlug)
  if (!country) {
    notFound()
  }

  // Get poll
  const poll = await queryPollBySlugOrId(pollSlug)
  if (!poll) {
    notFound()
  }

  // Format poll data
  const heroImage = typeof poll.heroImage === 'object' ? poll.heroImage : null
  const pollCountry = typeof poll.country === 'object' ? poll.country : null

  const pollData = {
    id: poll.id,
    question: poll.question,
    slug: poll.slug || '',
    description: poll.description || null,
    heroImage: heroImage ? { url: heroImage.url || null, alt: heroImage.alt || null } : null,
    options: poll.options?.map((opt: any) => ({
      text: opt.text,
      votes: opt.votes || 0,
    })) || [],
    totalVotes: poll.totalVotes || 0,
    tags: poll.tags?.map((t: any) => t.tag).filter(Boolean) || [],
    status: poll.status || 'active',
    country: pollCountry ? {
      id: pollCountry.id,
      name: pollCountry.name,
      slug: pollCountry.slug || '',
    } : null,
    relatedPolls: (poll.relatedPolls?.map((rp: any) => {
      if (typeof rp !== 'object') return null
      const rpImage = typeof rp.heroImage === 'object' ? rp.heroImage : null
      return {
        id: rp.id,
        question: rp.question,
        slug: rp.slug || '',
        description: rp.description || null,
        heroImage: rpImage ? { url: rpImage.url || null, alt: rpImage.alt || null } : null,
      }
    }).filter((item): item is NonNullable<typeof item> => item !== null)) || [],
    relatedPosts: (poll.relatedPosts?.map((rp: any) => {
      if (typeof rp !== 'object') return null
      const rpImage = typeof rp.heroImage === 'object' ? rp.heroImage : null
      return {
        id: rp.id,
        title: rp.title,
        slug: rp.slug || '',
        excerpt: rp.excerpt || null,
        publishedAt: rp.publishedAt || null,
        heroImage: rpImage ? { url: rpImage.url || null, alt: rpImage.alt || null } : null,
      }
    }).filter((item): item is NonNullable<typeof item> => item !== null)) || [],
  }

  return <PollDetail poll={pollData} countrySlug={countrySlug} />
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pollSlug } = await paramsPromise
  const poll = await queryPollBySlugOrId(pollSlug)

  if (!poll) {
    return {
      title: 'Poll Not Found',
    }
  }

  const heroImage = typeof poll.heroImage === 'object' ? poll.heroImage : null

  return {
    title: `${poll.question} | AskGeopolitics Poll`,
    description: poll.description || `Vote on: ${poll.question}`,
    openGraph: {
      title: `${poll.question} | AskGeopolitics Poll`,
      description: poll.description || `Vote on: ${poll.question}`,
      images: heroImage?.url ? [{ url: heroImage.url }] : [],
    },
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const polls = await payload.find({
    collection: 'polls',
    limit: 1000,
    depth: 1,
    select: {
      slug: true,
      country: true,
    },
  })

  return polls.docs
    .filter((poll) => poll.country && typeof poll.country === 'object' && poll.slug)
    .map((poll) => ({
      slug: ((poll.country as any).slug || '').toLowerCase().replace(/\s+/g, ''),
      pollSlug: poll.slug as string,
    }))
}
