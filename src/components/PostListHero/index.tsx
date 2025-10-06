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
  } = props

  const payload = await getPayload({ config: configPromise })

  // Fetch posts grouped by categories
  const categoriesWithPosts = await Promise.all(
    categories.map(async (cat) => {
      let posts = []
      
      // Build query based on filter type
      const whereQuery: any = {
        _status: {
          equals: 'published',
        },
      }

      if (cat.filterType === 'featured') {
        whereQuery.featured = { equals: true }
      } else if (cat.filterType === 'category' && cat.filterCategories?.length > 0) {
        // Handle single or multiple categories
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

  return (
    <PostListClient
      title={title}
      description={description}
      categories={categoriesWithPosts}
      groupByDate={groupByDate}
      showSubmitter={showSubmitter}
    />
  )
}