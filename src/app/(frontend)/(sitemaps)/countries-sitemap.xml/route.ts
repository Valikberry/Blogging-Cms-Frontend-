import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'

const getCountriesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://askgeopolitics.com'

    const results = await payload.find({
      collection: 'countries',
      overrideAccess: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const dateFallback = new Date().toISOString()

    const sitemap = results.docs
      ? results.docs
          .filter((country) => Boolean(country?.slug))
          .map((country) => {
            const normalizedSlug = country.slug.replace(/[^a-zA-Z0-9]/g, "")
            return {
              loc: `${SITE_URL}/${normalizedSlug}`,
              lastmod: country.updatedAt || dateFallback,
            }
          })
      : []

    return sitemap
  },
  ['countries-sitemap'],
  {
    tags: ['countries-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getCountriesSitemap()

  return getServerSideSitemap(sitemap)
}
