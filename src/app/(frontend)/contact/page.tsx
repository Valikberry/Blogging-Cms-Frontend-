import React from 'react'
import { ContactUs } from '@/components/ContactUs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | AskGeopolitics',
  description: 'Get in touch with AskGeopolitics. Contact us for general inquiries, business partnerships, press, or technical support.',
  openGraph: {
    title: 'Contact Us | AskGeopolitics',
    description: 'Get in touch with AskGeopolitics. Contact us for general inquiries, business partnerships, press, or technical support.',
  },
}

export default function ContactPage() {
  return <ContactUs />
}
