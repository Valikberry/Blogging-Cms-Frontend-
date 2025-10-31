import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PostListClient } from './Component.client'

interface PostListHeroProps {
  title?: string
  description?: string
  postsPerPage?: number
  groupByDate?: boolean
  showSource?: boolean
  dateFormat?: 'short' | 'long' | 'full'
  continentSlug?: string
  countryIds?: string[]
  countrySlug?: string
}

export async function PostListHero(props: PostListHeroProps) {
  const {
    title = 'Getting Started',
    description,
    postsPerPage = 20,
    groupByDate = true,
    showSource = true,
    dateFormat = 'short',
    continentSlug,
    countryIds = [],
    countrySlug,
  } = props

  const payload = await getPayload({ config: configPromise })

  // Fetch countries
  let countries: any[] = []
  let selectedContinentId: string | null = null
  let selectedCountryId: string | null = null

  if (countrySlug) {
    // Fetch specific country by slug to find its continent
    const countryResult = await payload.find({
      collection: 'countries',
      where: {
        slug: { equals: countrySlug }
      },
      limit: 1,
      depth: 1,
    })

    const selectedCountry = countryResult.docs[0]

    if (selectedCountry) {
      selectedCountryId = selectedCountry.id

      // Get the continent ID
      const continentId = typeof selectedCountry.continent === 'object'
        ? selectedCountry.continent.id
        : selectedCountry.continent

      if (continentId) {
        selectedContinentId = continentId
        // Fetch all countries from the same continent
        const countriesResult = await payload.find({
          collection: 'countries',
          where: { continent: { equals: continentId } },
          limit: 1000,
        })
        countries = countriesResult.docs
      } else {
        // If no continent, just show this country
        countries = [selectedCountry]
      }
    }
  } else if (countryIds.length > 0) {
    // Fetch specific countries by IDs
    const countriesResult = await payload.find({
      collection: 'countries',
      where: {
        id: { in: countryIds }
      },
      limit: 1000,
    })
    countries = countriesResult.docs
  } else if (continentSlug) {
    // Fetch continent by slug and then all its countries
    const continentResult = await payload.find({
      collection: 'continents',
      where: { slug: { equals: continentSlug } },
      limit: 1,
    })
    const continent = continentResult.docs[0]

    if (continent) {
      selectedContinentId = continent.id
      const countriesResult = await payload.find({
        collection: 'countries',
        where: { continent: { equals: continent.id } },
        limit: 1000,
      })
      countries = countriesResult.docs
    }
  } else {
    // HOME PAGE: No continent or country specified, fetch all countries
    const countriesResult = await payload.find({
      collection: 'countries',
      limit: 1000,
      sort: 'name',
    })
    countries = countriesResult.docs
  }

  // For each country, fetch all posts
  const countriesWithPosts = await Promise.all(
    countries.map(async (country) => {
      // Build query
      const whereQuery: any = {
        _status: { equals: 'published' },
        country: { equals: country.id },
      }

      const result = await payload.find({
        collection: 'posts',
        where: whereQuery,
        limit: postsPerPage,
        sort: '-publishedAt',
        depth: 1,
      })

      const posts = result.docs.map((post: any) => {
        // Format date based on dateFormat prop
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

        return {
          id: post.id,
          title: post.title,
          slug: post.slug,
          publishedAt: formattedDate,
          rawDate: post.publishedAt,
          source: post.source || post.populatedAuthors?.[0]?.name || null,
          isHot: post.isHot || false,
          isStories: post.isStories || false,
        }
      })

      return {
        id: country.id,
        name: country.name,
        slug: country.slug,
        posts: posts,
      }
    })
  )

  return (
    <PostListClient
      title={title}
      description={description}
      countries={countriesWithPosts}
      groupByDate={groupByDate}
      showSource={showSource}
      initialCountryId={selectedCountryId}
    />
  )
}