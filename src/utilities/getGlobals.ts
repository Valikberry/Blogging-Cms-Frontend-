import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Global = keyof Config['globals']

async function getGlobal(slug: Global, depth = 0) {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
  })

  return global
}



type Locale = 'en' | 'fr' 

export const getCachedGlobal = (
  slug: keyof Config['globals'], 
  depth = 1, // Increase default depth to populate relationships
  locale: Locale = 'en'
) =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      
      const global = await payload.findGlobal({
        slug,
        depth, // This is important for populating relationships
        locale,
      })

      return global
    },
    [slug, locale, depth.toString()],
    {
      tags: [`global_${slug}_${locale}`],
    },
  )
