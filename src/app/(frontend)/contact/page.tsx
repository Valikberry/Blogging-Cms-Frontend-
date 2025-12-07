import React from 'react'
import { ContactUs } from '@/components/ContactUs'
import type { Metadata } from 'next'
import { getServerSideURL } from '@/utilities/getURL'

const siteUrl = getServerSideURL()

export const metadata: Metadata = {
  title: 'Contact Us | AskGeopolitics',
  description: 'Get in touch with AskGeopolitics. Contact us for general inquiries, business partnerships, press, or technical support.',
  alternates: {
    canonical: `${siteUrl}/contact/`,
  },
  openGraph: {
    title: 'Contact Us | AskGeopolitics',
    description: 'Get in touch with AskGeopolitics. Contact us for general inquiries, business partnerships, press, or technical support.',
    url: `${siteUrl}/contact/`,
  },
}

export default function ContactPage() {
  return <ContactUs />
}
