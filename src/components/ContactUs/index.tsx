'use client'

import React from 'react'
import Link from 'next/link'
import { Mail, ChevronRight, Settings } from 'lucide-react'

// Social media icons as SVG components
const FacebookIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const XTwitterIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const LinkedInIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const ThreadsIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.182.408-2.256 1.332-3.023.88-.73 2.083-1.146 3.39-1.174.957-.02 1.83.104 2.6.369.034-.694.004-1.363-.093-2.026l2.012-.336c.126.848.166 1.728.108 2.626 1.093.525 1.985 1.235 2.639 2.098.886 1.17 1.228 2.549 1.228 3.867 0 1.755-.574 3.362-1.71 4.78C18.873 22.78 16.12 23.976 12.186 24zm.394-8.47c-1.073.02-2.023.283-2.68.743-.524.367-.788.83-.764 1.338.024.508.334.962.872 1.276.638.373 1.462.536 2.322.488 1.04-.056 1.867-.456 2.46-1.188.437-.541.749-1.274.918-2.163-.923-.295-1.978-.466-3.128-.494z"/>
  </svg>
)

const TelegramIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
)

interface SocialLink {
  platform: string
  region: string
  url: string
}

const socialLinks: SocialLink[] = [
  // Facebook
  { platform: 'Facebook', region: 'United States', url: '#' },
  { platform: 'Facebook', region: 'United Kingdom', url: '#' },
  { platform: 'Facebook', region: 'Canada', url: '#' },
  // X (Twitter)
  { platform: 'X (Twitter)', region: 'United States', url: '#' },
  { platform: 'X (Twitter)', region: 'United Kingdom', url: '#' },
  { platform: 'X (Twitter)', region: 'Canada', url: '#' },
  // LinkedIn
  { platform: 'LinkedIn', region: 'United States', url: '#' },
  // Threads
  { platform: 'Threads', region: 'United States', url: '#' },
  { platform: 'Threads', region: 'Canada', url: '#' },
  // Telegram
  { platform: 'Telegram', region: 'United States', url: '#' },
  { platform: 'Telegram', region: 'United Kingdom', url: '#' },
  { platform: 'Telegram', region: 'Canada', url: '#' },
]

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case 'Facebook':
      return <FacebookIcon />
    case 'X (Twitter)':
      return <XTwitterIcon />
    case 'LinkedIn':
      return <LinkedInIcon />
    case 'Threads':
      return <ThreadsIcon />
    case 'Telegram':
      return <TelegramIcon />
    default:
      return null
  }
}

const getPlatformColor = (platform: string) => {
  switch (platform) {
    case 'Facebook':
      return 'text-blue-600'
    case 'X (Twitter)':
      return 'text-black'
    case 'LinkedIn':
      return 'text-blue-700'
    case 'Threads':
      return 'text-black'
    case 'Telegram':
      return 'text-sky-500'
    default:
      return 'text-gray-600'
  }
}

export function ContactUs() {
  // Group social links by platform
  const groupedLinks = socialLinks.reduce((acc, link) => {
    if (!acc[link.platform]) {
      acc[link.platform] = []
    }
    acc[link.platform].push(link)
    return acc
  }, {} as Record<string, SocialLink[]>)

  return (
    <div className="bg-white">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-700">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-indigo-600">Contact</span>
        </nav>

        {/* Header Section */}
        <div className="bg-indigo-50 rounded-lg p-8 mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-gray-600 max-w-xl mx-auto text-[15px]">
            We&apos;re here to connect with our readers, answer questions, and continually improve the quality of our political explainers and voting features. Whether you have feedback, corrections, partnership inquiries, or technical issues — we&apos;d love to hear from you
          </p>
        </div>

        {/* Contact Sections */}
        <div className="space-y-6 mb-8">
          {/* General & Editorial Inquiries */}
          <div className='border-b border-gray-200 pb-2'>
            <h2 className="font-semibold text-gray-900 mb-2 text-[16px]">General & Editorial Inquiries</h2>
            <p className="text-gray-600 text-[14px] mb-2">
              For general questions, content feedback, news-related inquiries, or corrections:
            </p>
            <a
              href="mailto:editor@askgeopolitics.com"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-[15px]"
            >
              <Mail className="w-4 h-4" />
              <span className="underline">editor@askgeopolitics.com</span>
            </a>
          </div>

          {/* Business, Partnerships & Press */}
      <div className='border-b border-gray-200 pb-2'>
            <h2 className="font-semibold text-gray-900 mb-2 text-[16px]">Business, Partnerships & Press</h2>
            <p className="text-gray-600 text-[14px] mb-2">
              For collaborations, advertising, media requests, or brand opportunities:
            </p>
            <a
              href="mailto:business@askgeopolitics.com"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-[15px]"
            >
              <Mail className="w-4 h-4" />
              <span className="underline">business@askgeopolitics.com</span>
            </a>
          </div>

          {/* Technical Support */}
      <div className='border-b border-gray-200 pb-2'>
            <h2 className="font-semibold text-gray-900 mb-2 text-[16px]">Technical Support</h2>
            <p className="text-gray-600 text-[14px] mb-2">
              For issues with the website, voting system, or account features:
            </p>
            <a
              href="mailto:support@askgeopolitics.com"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-[15px]"
            >
              <Mail className="w-4 h-4" />
              <span className="underline">support@askgeopolitics.com</span>
            </a>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="mb-8">
          <h2 className="font-semibold text-gray-900 mb-4 text-[16px]">Our Social Media</h2>

          <div className="space-y-2">
            {Object.entries(groupedLinks).map(([platform, links]) => (
              <div key={platform} className="space-y-2 border-b">
                {links.map((link, index) => (
                  <a
                    key={`${platform}-${index}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 py-1 hover:opacity-70 transition-opacity ${getPlatformColor(platform)}`}
                  >
                    {getPlatformIcon(platform)}
                    <span className="text-gray-900 text-[15px]">
                      {platform} - {link.region}
                    </span>
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Box */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-indigo-600 text-[16px]">We Value Your Feedback</h3>
          </div>
          <p className="text-[14px] text-gray-700">
            Your insights help us improve our Q&A explainers and our interactive voting polls. If there&apos;s a feature you&apos;d like us to build, a news format you prefer, or a question you want answered, let us know — we listen.
          </p>
        </div>
      </div>
    </div>
  )
}
