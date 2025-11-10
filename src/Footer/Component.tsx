import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Footer as FooterType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export async function Footer() {
  const footerData = (await getCachedGlobal('footer', 1)()) as FooterType

  const navItems = footerData?.navItems || []
  const copyrightText =
    footerData?.copyrightText || 'Copyright © 2025 Company Name LLC. All rights reserved.'

  return (
    <footer className="w-full border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Navigation Links - Flex wrap with natural flow */}
        <nav className="flex flex-wrap justify-center items-center gap-x-4 gap-y-3 sm:gap-x-6 lg:gap-x-8 max-w-3xl mx-auto">
          {navItems.map(({ link }, i) => {
            return (
              <CMSLink
                key={i}
                {...link}
                className="text-gray-700 hover:text-gray-900 text-sm sm:text-base font-normal transition-colors whitespace-nowrap"
              />
            )
          })}
        </nav>

        {/* Copyright */}
        <div className="text-center mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-xs sm:text-sm">{copyrightText}</p>
        </div>
      </div>
    </footer>
  )
}
