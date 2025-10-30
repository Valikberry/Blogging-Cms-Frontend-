import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { homeStatic } from '@/endpoints/seed/home-static'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { HomeTemplate } from '@/components/HomeContent'


export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  
  // Get regular pages
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  // Get continents
  const continents = await payload.find({
    collection: 'continents',
    limit: 1000,
    select: {
      slug: true,
    },
  })

  const params = [
    // Regular pages (excluding home)
    ...pages.docs
      .filter((doc) => doc.slug !== 'home')
      .map(({ slug }) => ({ slug })),
    // Continents
    ...continents.docs.map(({ slug }) => ({ slug })),
  ]

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

// Cache continent query to prevent duplicate fetches
const queryContinentBySlug = cache(async (slug: string) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'continents',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  return result.docs[0] || null
})

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  const url = '/' + slug

  // First, check if it's a continent
  const continent = await queryContinentBySlug(slug)

  // If it's a continent, fetch the home page and pass continent filter
  if (continent) {
    const page = await queryPageBySlug({ slug: 'home' })

    if (!page) {
      return <PayloadRedirects url={url} />
    }

    return <HomeTemplate page={page} url={url} draft={draft} continentSlug={slug} />
  }

  // Otherwise, treat it as a regular page
  let page: RequiredDataFromCollectionSlug<'pages'> | null

  page = await queryPageBySlug({
    slug,
  })

  // Remove this code once your website is seeded
  if (!page && slug === 'home') {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  // Check if this is the home page
  if (slug === 'home') {
    return <HomeTemplate page={page} url={url} draft={draft} />
  }

  // Regular page with article wrapper
  const { hero, layout } = page

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <RenderHero {...hero} />
      <RenderBlocks blocks={layout ?? []} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise

  // Check if it's a continent first (using cached query)
  const continent = await queryContinentBySlug(slug)

  if (continent) {
    return {
      title: continent.name,
      description: `Content from ${continent.name}`,
    }
  }

  // Otherwise, get page metadata (using cached query)
  const page = await queryPageBySlug({
    slug,
  })

  return generateMeta({ doc: page })
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})