import { HomePage } from '@/components/HomePage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AskGeopolitics – Asking Political Questions That Matter',
  description: 'AskGeopolitics breaks big global stories into clear questions that reveal what\'s at stake, who\'s involved, and what could happen next.',
  openGraph: {
    title: 'AskGeopolitics – Asking Political Questions That Matter',
    description: 'AskGeopolitics breaks big global stories into clear questions that reveal what\'s at stake, who\'s involved, and what could happen next.',
  },
}

export default function Home() {
  return <HomePage />
}

// Revalidate the home page every 60 seconds
export const revalidate = 60
