// components/PostListHero/index.tsx
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PostListClient } from './Component.client'

interface PostListHeroProps {
  title?: string
  description?: string
  categories?: any[]
  postsPerPage?: number
  groupByDate?: boolean
  showSubmitter?: boolean
  dateFormat?: 'short' | 'long' | 'full'
  continentSlug?: string
  countrySlug?: string
}

export async function PostListHero(props: PostListHeroProps) {
  const {
    title = 'Getting Started',
    description,
    categories = [],
    postsPerPage = 20,
    groupByDate = true,
    showSubmitter = true,
    dateFormat = 'short',
    continentSlug,
    countrySlug,
  } = props

  const payload = await getPayload({ config: configPromise })

  // Fetch continent/country if provided
  let continent = null
  let country = null
  let countryIds: string[] = []

  if (countrySlug) {
    const countryResult = await payload.find({
      collection: 'countries',
      where: { slug: { equals: countrySlug } },
      depth: 1,
      limit: 1,
    })
    country = countryResult.docs[0]
    if (country) {
      countryIds = [country.id]
    }
  } else if (continentSlug) {
    const continentResult = await payload.find({
      collection: 'continents',
      where: { slug: { equals: continentSlug } },
      limit: 1,
    })
    continent = continentResult.docs[0]

    if (continent) {
      // Get all countries in this continent
      const countriesResult = await payload.find({
        collection: 'countries',
        where: { continent: { equals: continent.id } },
        limit: 1000,
      })
      countryIds = countriesResult.docs.map((c: any) => c.id)
    }
  }

  // Fetch posts grouped by categories with location filter
  const categoriesWithPosts = await Promise.all(
    categories.map(async (cat) => {
      let posts = []
      
      // Build query based on filter type
      const whereQuery: any = {
        _status: {
          equals: 'published',
        },
      }

      // Add location filter if we have country IDs
      if (countryIds.length > 0) {
        whereQuery.country = {
          in: countryIds,
        }
      }

      if (cat.filterType === 'featured') {
        whereQuery.featured = { equals: true }
      } else if (cat.filterType === 'category' && cat.filterCategories?.length > 0) {
        if (cat.filterCategories.length === 1) {
          whereQuery.categories = {
            contains: cat.filterCategories[0],
          }
        } else {
          whereQuery.categories = {
            in: cat.filterCategories,
          }
        }
      }

      // Determine sort order
      let sortField = '-publishedAt'
      if (cat.sortBy === 'publishedAt_asc') {
        sortField = 'publishedAt'
      } else if (cat.sortBy === 'title') {
        sortField = 'title'
      } else if (cat.sortBy === 'viewCount') {
        sortField = '-viewCount'
      }

      const result = await payload.find({
        collection: 'posts',
        where: whereQuery,
        limit: postsPerPage,
        sort: sortField,
        depth: 1,
      })
      posts = result.docs

      return {
        label: cat.label,
        icon: cat.icon,
        posts: posts.map((post: any) => {
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
            submittedBy: post.submittedBy || post.populatedAuthors?.[0]?.name || null,
          }
        }),
      }
    })
  )

  // Update title based on location
  let displayTitle = title
  if (country) {
    displayTitle = `${title} - ${country.name}`
  } else if (continent) {
    displayTitle = `${title} - ${continent.name}`
  }

  return (
    <PostListClient
      title={displayTitle}
      description={description}
      categories={categoriesWithPosts}
      groupByDate={groupByDate}
      showSubmitter={showSubmitter}
    />
  )
}