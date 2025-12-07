import React from 'react'
import { Subscribe } from '@/components/Subscribe'
import type { Metadata } from 'next'
import { getServerSideURL } from '@/utilities/getURL'

const siteUrl = getServerSideURL()

export const metadata: Metadata = {
  title: 'Subscribe | AskGeopolitics',
  description: 'Subscribe to AskGeopolitics and get the latest geopolitics content delivered straight to your inbox.',
  alternates: {
    canonical: `${siteUrl}/subscribe/`,
  },
  openGraph: {
    title: 'Subscribe | AskGeopolitics',
    description: 'Subscribe to AskGeopolitics and get the latest geopolitics content delivered straight to your inbox.',
    url: `${siteUrl}/subscribe/`,
  },
}

export default function SubscribePage() {
  return <Subscribe />
}
