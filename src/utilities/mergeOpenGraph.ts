import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Ask Geopolitics - Your source for global political insights and analysis.',
  images: [
    {
      url: `${getServerSideURL()}/og-image.jpg`,
      width: 1200,
      height: 630,
    },
  ],
  siteName: 'Ask Geopolitics',
  title: 'Ask Geopolitics',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
