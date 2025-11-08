import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Footer as FooterType } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export async function Footer() {
  const footerData = (await getCachedGlobal('footer', 1)()) as FooterType

  const navItems = footerData?.navItems || []
  const copyrightText =
    footerData?.copyrightText || 'Copyright © 2025 Company Name LLC. All rights reserved.'

  const midPoint = Math.ceil(navItems.length / 2)
  const firstRow = navItems.slice(0, midPoint)
  const secondRow = navItems.slice(midPoint)

  return (
    <footer className="w-full border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Links - Two Rows */}
        <div className="flex flex-col items-center gap-4">
          {/* First Row */}
          <nav className="flex flex-wrap justify-center items-center gap-6 sm:gap-8">
            {firstRow.map(({ link }, i) => {
              return (
                <CMSLink
                  key={i}
                  {...link}
                  className="text-gray-700 hover:text-gray-900 text-base font-normal transition-colors"
                />
              )
            })}
          </nav>

          {/* Second Row */}
          {secondRow.length > 0 && (
            <nav className="flex flex-wrap justify-center items-center gap-6 sm:gap-8">
              {secondRow.map(({ link }, i) => {
                return (
                  <CMSLink
                    key={i + midPoint}
                    {...link}
                    className="text-gray-700 hover:text-gray-900 text-base font-normal transition-colors"
                  />
                )
              })}
            </nav>
          )}
        </div>

        {/* Copyright */}
        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <p className="text-[#6C6C6C] text-[12px]">{copyrightText}</p>
        </div>
      </div>
    </footer>
  )
}
