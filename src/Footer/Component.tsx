import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react'

import type { Footer as FooterType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

const socialIcons: Record<string, React.ElementType> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  tiktok: Instagram, // Using Instagram icon as placeholder for TikTok
}

export async function Footer() {
  const footerData = (await getCachedGlobal('footer', 1)()) as FooterType

  const navItems = footerData?.navItems || []
  const socialMedia = footerData?.socialMedia || []
  const copyrightText =
    footerData?.copyrightText || 'Copyright © 2025 Company Name LLC. All rights reserved.'

  return (
    <footer className="w-full border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 py-2">
          {navItems.map(({ link }, i) => {
            return (
              <CMSLink
                key={i}
                {...link}
                className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
              />
            )
          })}
        </nav>

        {/* Copyright */}
        <div className="text-center py-2 border-t border-gray-200">
          {/* Social Media Links */}
          {socialMedia.length > 0 && (
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
              {socialMedia.map((social: any, index: number) => {
                const Icon = socialIcons[social.platform] || Instagram
                return (
                  <Link
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm capitalize">{social.platform}</span>
                  </Link>
                )
              })}
            </div>
          )}
          {/* <p className="text-gray-500 text-xs">{copyrightText}</p> */}
        </div>
      </div>
    </footer>
  )
}
