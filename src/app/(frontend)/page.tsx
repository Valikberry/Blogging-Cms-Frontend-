import { HomePage } from '@/components/HomePage'
import type { Metadata } from 'next'
import { getServerSideURL } from '@/utilities/getURL'

const siteUrl = getServerSideURL()

export const metadata: Metadata = {
  title: 'AskGeopolitics – Asking Political Questions That Matter',
  description: 'AskGeopolitics breaks big global stories into clear questions that reveal what\'s at stake, who\'s involved, and what could happen next.',
  alternates: {
    canonical: `${siteUrl}/`,
  },
  openGraph: {
    title: 'AskGeopolitics – Asking Political Questions That Matter',
    description: 'AskGeopolitics breaks big global stories into clear questions that reveal what\'s at stake, who\'s involved, and what could happen next.',
    url: `${siteUrl}/`,
  },
}

export default function Home() {
  return <HomePage />
}

// Revalidate the home page every 60 seconds
export const revalidate = 60
