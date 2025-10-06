'use client'

import React from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { Search } from 'lucide-react'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems || []

  return (
    <nav className="hidden lg:flex items-center space-x-8">
      {navItems.map((navItem, i) => {
        // The link is nested inside the navItem
        const link = navItem.link
        
        if (!link) {
          console.warn('NavItem missing link:', navItem)
          return null
        }

        return (
          <CMSLink 
            key={i} 
            type={link.type}
            label={link.label}
            url={link.url}
            reference={link.reference}
            newTab={link.newTab}
            appearance="link"
          />
        )
      })}
      
      {data.showSearch && (
        <Link href="/search" className="text-gray-300 hover:text-white transition-colors">
          <span className="sr-only">Search</span>
          <Search className="w-5 h-5" />
        </Link>
      )}
    </nav>
  )
}