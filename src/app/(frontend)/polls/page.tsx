import type { Metadata } from 'next'
import { PollsPage } from '@/components/PollsPage'
import { getServerSideURL } from '@/utilities/getURL'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = getServerSideURL()
  const canonicalUrl = `${siteUrl}/polls/`

  return {
    title: 'Polls - AskGeopolitics',
    description:
      'Vote on global political questions and see how people around the world react to major events.',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      url: canonicalUrl,
      title: 'Polls - AskGeopolitics',
      description:
        'Vote on global political questions and see how people around the world react to major events.',
    },
  }
}

export default function Page() {
  return <PollsPage />
}
