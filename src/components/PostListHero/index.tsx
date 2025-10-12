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
  countryIds?: string[]
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
    countryIds = [],
  } = props

  const payload = await getPayload({ config: configPromise })

  // Fetch countries
  let countries: any[] = []
  let selectedContinentId: string | null = null
  
  if (countryIds.length > 0) {
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
    // HOME PAGE: No continent or country specified, fetch the first continent by default
    const continentsResult = await payload.find({
      collection: 'continents',
      limit: 1,
      sort: 'name', // or any other sort field you prefer
    })
    
    const firstContinent = continentsResult.docs[0]
    
    if (firstContinent) {
      selectedContinentId = firstContinent.id
      const countriesResult = await payload.find({
        collection: 'countries',
        where: { continent: { equals: firstContinent.id } },
        limit: 1000,
      })
      countries = countriesResult.docs
    }
  }

  // For each country, fetch posts for each category
  const countriesWithCategoriesAndPosts = await Promise.all(
    countries.map(async (country) => {
      const categoriesWithPosts = await Promise.all(
        categories.map(async (cat) => {
          // Build query
          const whereQuery: any = {
            _status: { equals: 'published' },
            country: { equals: country.id },
          }

          // Add category filters
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

          return {
            label: cat.label,
            icon: cat.icon,
            posts: result.docs.map((post: any) => {
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

      return {
        id: country.id,
        name: country.name,
        slug: country.slug,
        categories: categoriesWithPosts,
      }
    })
  )

  return (
    <PostListClient
      title={title}
      description={description}
      countries={countriesWithCategoriesAndPosts}
      groupByDate={groupByDate}
      showSubmitter={showSubmitter}
    />
  )
}