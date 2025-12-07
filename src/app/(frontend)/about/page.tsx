import React from 'react'
import { AboutUs } from '@/components/AboutUs'
import type { Metadata } from 'next'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { AboutUs as AboutUsType } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const siteUrl = getServerSideURL()

export const metadata: Metadata = {
  title: 'About Us | AskGeopolitics',
  description: 'Learn about AskGeopolitics - our mission, team, and commitment to delivering insightful geopolitical analysis and news coverage.',
  alternates: {
    canonical: `${siteUrl}/about/`,
  },
  openGraph: {
    title: 'About Us | AskGeopolitics',
    description: 'Learn about AskGeopolitics - our mission, team, and commitment to delivering insightful geopolitical analysis and news coverage.',
    url: `${siteUrl}/about/`,
  },
}

export default async function AboutPage() {
  const aboutData = (await getCachedGlobal('about-us', 1)()) as AboutUsType

  return <AboutUs data={aboutData} />
}
