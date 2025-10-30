import type { Metadata } from 'next'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { HomeTemplate } from '@/components/HomeContent'


export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  
  const countries = await payload.find({
    collection: 'countries',
    depth: 1,
    limit: 1000,
  })

  return countries.docs.map((country) => {
    const continent = typeof country.continent === 'string' ? null : country.continent
    return {
      continent: continent?.slug || '',
      country: country.slug,
    }
  })
}

type Args = {
  params: Promise<{
    continent: string
    country: string
  }>
}

export default async function CountryPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { continent, country } = await paramsPromise
  const url = `/${continent}/${country}`

  const page = await queryPageBySlug({ slug: 'home' })

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  return <HomeTemplate page={page} url={url} draft={draft} continentSlug={continent} countrySlug={country} />
}

// Cache country query to prevent duplicate fetches
const queryCountryBySlug = cache(async (slug: string) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'countries',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })

  return result.docs[0] || null
})

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { country } = await paramsPromise
  const countryDoc = await queryCountryBySlug(country)

  return {
    title: countryDoc?.name || country,
    description: `Content from ${countryDoc?.name || country}`,
  }
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
    where: { slug: { equals: slug } },
  })

  return result.docs?.[0] || null
})