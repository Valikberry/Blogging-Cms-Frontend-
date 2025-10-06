'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import type { Header } from '@/payload-types'
import { HeaderNav } from './Nav'
import { Facebook, Twitter, Youtube, Instagram, Search, ShoppingCart } from 'lucide-react'
import { LanguageDropdown } from '@/components/LanguageDropdown'

interface HeaderClientProps {
  data: Header
  locale: string
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const [currentLanguage, setCurrentLanguage] = useState('en')
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
    // Detect language from URL
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

    // Update URL with new language
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
      {/* Top Bar */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {data.topBar?.socialLinks?.map((item: any, i: number) => {
                const Icon = icons[item.icon]
                return (
                  <a
                    href={item.url}
                    key={i}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-orange-500 transition-colors"
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                  </a>
                )
              })}
            </div>

            {/* Right Side: Cart + Language Dropdown */}
            <div className="flex items-center gap-3">
              {/* Language Dropdown */}
              {data.topBar?.languageButton?.enabled && (
                <LanguageDropdown
                  currentLanguage={currentLanguage}
                  onLanguageChange={handleLanguageChange}
                  buttonLabel={data.topBar.languageButton.label || 'Language'}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="text-2xl font-bold">
                <span className="text-white">GEO</span>
                <span className="text-orange-500">SNIPPET</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <HeaderNav data={data} />
          </div>
        </div>
      </div>
    </header>
  )
}
