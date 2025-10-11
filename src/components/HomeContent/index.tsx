import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import type { RequiredDataFromCollectionSlug } from 'payload'
import PageClient from '@/app/(frontend)/[slug]/page.client'

interface HomeTemplateProps {
  page: RequiredDataFromCollectionSlug<'pages'>
  url: string
  draft: boolean
  continentSlug?: string
  countrySlug?: string
}

export function HomeTemplate({ page, url, draft, continentSlug, countrySlug }: HomeTemplateProps) {
  const { hero, layout } = page

  return (
    <>
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}
      
      <RenderHero {...hero} continentSlug={continentSlug} countrySlug={countrySlug} />
      <RenderBlocks blocks={layout ?? []} />
    </>
  )
}