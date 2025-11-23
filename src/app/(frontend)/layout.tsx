import type { Metadata } from 'next'
import Script from 'next/script'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const siteUrl = getServerSideURL()

  // Organization JSON-LD Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'NewsMediaOrganization',
        '@id': `${siteUrl}/#organization`,
        name: 'AskGeopolitics',
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/api/media/file/Ask%20Geopolitics%20Logo`,
          width: 600,
          height: 600,
        },
        image: {
          '@type': 'ImageObject',
          url: `${siteUrl}/og-image.jpg`,
          width: 1280,
          height: 720,
        },
        description:
          "AskGeopolitics breaks big global stories into clear questions that reveal what's at stake, who's involved, and what could happen next.",
        foundingDate: '2025-09-16',
        foundingLocation: {
          '@type': 'Place',
          name: 'United States',
        },
        founder: [
          {
            '@type': 'Person',
            name: 'Valentine',
          },
          {
            '@type': 'Person',
            name: 'Christine',
          },
        ],
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'Editorial Inquiries',
            email: 'editorial@askgeopolitics.com',
          },
          {
            '@type': 'ContactPoint',
            contactType: 'Press & Media',
            email: 'press@askgeopolitics.com',
          },
        ],
        areaServed: 'Global',
        inLanguage: ['en'],
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'AskGeopolitics',
        publisher: {
          '@id': `${siteUrl}/#organization`,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${siteUrl}/#webpage`,
        url: siteUrl,
        name: 'AskGeopolitics – Asking Political Questions That Matter.',
        isPartOf: {
          '@id': `${siteUrl}/#website`,
        },
        about: {
          '@id': `${siteUrl}/#organization`,
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: `${siteUrl}/og-image.jpg`,
        },
        dateModified: new Date().toISOString(),
        description:
          "AskGeopolitics breaks big global stories into clear questions that reveal what's at stake, who's involved, and what could happen next.",
      },
    ],
  }

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />

        {/* ✅ Google Site Verification */}
        <meta
          name="google-site-verification"
          content="il2Q98Bvcbun_uDG-OAfu8HVTlCqmkWSe7avgx454Ls"
        />

        {/* ✅ Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

        {/* ✅ Google Analytics */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-3QV12VHXQM" />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-3QV12VHXQM');
            `,
          }}
        />
      </head>

      <body className="flex flex-col min-h-screen">
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />
          <Header />
          <main className="flex-1 zoom-content">
            <div className="container mx-auto max-w-3xl py-4 px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@askgeopolitics',
  },
  icons: {
    icon: '/api/media/file/Ask%20Geopolitics%20Logo',
  },
}
