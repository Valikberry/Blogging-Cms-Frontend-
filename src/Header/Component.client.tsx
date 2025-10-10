'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import type { Header } from '@/payload-types'
import { HeaderNav } from './Nav'
import { Facebook, Twitter, Youtube, Instagram, Search } from 'lucide-react'
import { LanguageDropdown } from '@/components/LanguageDropdown'
import Image from 'next/image'

interface HeaderClientProps {
  data: Header
  locale: string
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const [currentLanguage, setCurrentLanguage] = useState('en')
  const [searchOpen, setSearchOpen] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setHeaderTheme(null)
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
  }, [headerTheme])

  useEffect(() => {
    const pathLang = pathname.split('/')[1]
    if (['en', 'fr', 'es', 'de', 'rw'].includes(pathLang)) {
      setCurrentLanguage(pathLang)
    }
  }, [pathname])

  const icons: any = {
    facebook: Facebook,
    twitter: Twitter,
    youtube: Youtube,
    instagram: Instagram,
  }

  const handleLanguageChange = (languageCode: string) => {
    setCurrentLanguage(languageCode)
    const segments = pathname.split('/')
    if (['en', 'fr', 'es', 'de', 'rw'].includes(segments[1])) {
      segments[1] = languageCode
    } else {
      segments.splice(1, 0, languageCode)
    }
    router.push(segments.join('/'))
  }

  return (
    <header className="w-full relative z-40">
      {/* Top Bar - Black background with social icons */}
      <div className="bg-white w-full">
        <div className="container mx-auto max-w-xl px-4">
          <div className="flex items-center gap-8  justify-between">
            <div className="flex items-center gap-8">
              {data.topBar?.socialLinks?.map((item: any, i: number) => {
                const Icon = icons[item.icon]
                return (
                  <a
                    href={item.url}
                    key={i}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black hover:text-gray-600 transition-colors flex items-center gap-2 text-sm"
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span className="capitalize">{item.icon}</span>
                  </a>
                )
              })}
            </div>
            {/* Language Dropdown */}
            {data.topBar?.languageButton?.enabled && (
              <div className=" border-gray-700 justify-between pl-8">
                <LanguageDropdown
                  currentLanguage={currentLanguage}
                  onLanguageChange={handleLanguageChange}
                  buttonLabel={data.topBar.languageButton.label || ''}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Row - Constrained Width */}
    <div className="w-full bg-[#1f2937]">
  <div className="flex max-w-full">
    <div className="container mx-auto max-w-xl px-4 flex items-center justify-between h-10 relative">
      <div className="flex items-center h-full">
        <Link href="/" className="flex items-center gap-1.5">
          <Image src="/logo.jpeg" alt={'Logo'} width={40} height={40} />
          <div className="font-bold text-sm py-[1px] text-white">MSF</div>
        </Link>
      </div>

      {/* Center - Navigation Links */}
      <nav className="flex items-center gap-2">
        <HeaderNav data={data} />
      </nav>

      {/* Search Icon Button */}
      <button
        className="text-white hover:text-gray-500 transition-colors p-2 rounded-full hover:bg-gray-100"
        aria-label="Search"
        onClick={() => setSearchOpen(!searchOpen)}
      >
        <Search className="w-6 h-6" />
      </button>

      {/* Search Input - Absolute positioned above navigation */}
      {searchOpen && (
        <div className="absolute top-full right-4 -mt-10 z-50">
          <input
            type="text"
            placeholder="Search..."
            className="bg-white border border-gray-300 px-4 py-1 pr-10 rounded w-64 focus:outline-none focus:ring-1 focus:ring-gray-500"
            autoFocus
            onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
          />
        </div>
      )}
    </div>
  </div>
</div>
    </header>
  )
}
