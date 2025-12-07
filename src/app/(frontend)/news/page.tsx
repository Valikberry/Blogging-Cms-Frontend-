import type { Metadata } from 'next'
import { NewsPage } from '@/components/NewsPage'
import { getServerSideURL } from '@/utilities/getURL'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = getServerSideURL()
  const canonicalUrl = `${siteUrl}/news/`

  return {
    title: 'News - AskGeopolitics',
    description:
      'Breaking political news turned into simple questions. Understand global events through clear, unbiased questions.',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      url: canonicalUrl,
      title: 'News - AskGeopolitics',
      description:
        'Breaking political news turned into simple questions. Understand global events through clear, unbiased questions.',
    },
  }
}

export default function Page() {
  return <NewsPage />
}
