// app/_components/Header/index.tsx
import { HeaderClient } from './Component.client'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

export async function Header() {
  const payload = await getPayloadHMR({ config: configPromise })
  
  const [headerData, countriesData] = await Promise.all([
    payload.findGlobal({
      slug: 'header',
      depth: 2,
    }),
    payload.find({
      collection: 'countries',
      depth: 1,
      limit: 1000,
    })
  ])

  return (
    <HeaderClient 
      data={headerData} 
      countries={countriesData.docs} 
      locale="en" 
    />
  )
}