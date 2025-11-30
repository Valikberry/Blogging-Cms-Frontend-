import React from 'react'
import { Subscribe } from '@/components/Subscribe'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Subscribe | AskGeopolitics',
  description: 'Subscribe to AskGeopolitics and get the latest geopolitics content delivered straight to your inbox.',
  openGraph: {
    title: 'Subscribe | AskGeopolitics',
    description: 'Subscribe to AskGeopolitics and get the latest geopolitics content delivered straight to your inbox.',
  },
}

export default function SubscribePage() {
  return <Subscribe />
}
