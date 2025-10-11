'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState, useRef } from 'react'
import type { Header } from '@/payload-types'
import { Search } from 'lucide-react'
import Image from 'next/image'

interface HeaderClientProps {
  data: Header
  locale: string
  countries?: any[]
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, countries = [] }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setHeaderTheme(null)
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
  }, [headerTheme])

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  const handleMouseEnter = (label: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setOpenDropdown(label)
  }

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null)
    }, 150)
  }

  const isActivePath = (path: string) => pathname === path

  return (
    <header className="w-full relative z-40">
      <div className="w-full bg-[#6366f1]">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between h-12">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity"
            >
              {data.logo?.image && typeof data.logo.image !== 'string' && (
                <Image
                  src={data.logo.image.url || ''}
                  alt={data.logo.image.alt || 'Logo'}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              )}
              {data.logo?.text && <span className="font-bold text-xl">{data.logo.text}</span>}
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-1">
              {data.navItems?.map((item: any, index: number) => {
                if (item.type === 'simple') {
                  const isActive = isActivePath(item.url || '/')
                  return (
                    <Link
                      key={index}
                      href={`/${item.url}` || '/'}
                      className={`px-4 py-2 text-white hover:bg-white/10 rounded transition-colors text-sm font-medium ${
                        isActive ? 'bg-white/20' : ''
                      }`}
                    >
                      {item.label}
                    </Link>
                  )
                }

                if (item.type === 'continent' && item.continent) {
                  const continent = typeof item.continent === 'string' ? null : item.continent

                  const continentCountries =
                    countries?.filter((country: any) => {
                      const countryContinent =
                        typeof country.continent === 'string'
                          ? country.continent
                          : country.continent?.id
                      return countryContinent === continent?.id
                    }) || []

                  const continentPath = `/${continent?.slug || ''}`
                  const isActive = pathname.startsWith(continentPath)

                  return (
                    <div
                      key={index}
                      className="relative"
                      onMouseEnter={() => handleMouseEnter(item.label)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Link
                        href={continentPath}
                        className={`px-4 py-2 text-white hover:bg-white/10 rounded transition-colors text-sm font-medium flex items-center gap-1 ${
                          isActive ? 'bg-white/20' : ''
                        }`}
                      >
                        {item.label}
                        <svg
                          className="w-4 h-4 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </Link>

                      {openDropdown === item.label && continentCountries.length > 0 && (
                        <div
                          className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg min-w-[200px] py-2 z-50 border border-gray-100"
                          onMouseEnter={() => handleMouseEnter(item.label)}
                          onMouseLeave={handleMouseLeave}
                        >
                          {continentCountries.map((country: any) => {
                            const countryPath = `/${continent?.slug}/${country.slug}`
                            const isCountryActive = pathname === countryPath
                            return (
                              <Link
                                key={country.id}
                                href={countryPath}
                                className={`block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors ${
                                  isCountryActive ? 'bg-indigo-50 text-indigo-600 font-medium' : ''
                                }`}
                                onClick={() => setOpenDropdown(null)}
                              >
                                {country.name}
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                }

                return null
              })}
            </nav>

            {/* Search Icon */}
            {data.showSearch && (
              <div className="relative">
                <button
                  className="text-white hover:bg-white/10 transition-colors p-2 rounded-full"
                  aria-label="Search"
                  onClick={() => setSearchOpen(!searchOpen)}
                >
                  <Search className="w-5 h-5" />
                </button>

                {searchOpen && (
                  <div className="absolute top-full right-0 mt-2 z-50">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="bg-white border border-gray-300 px-4 py-2 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg"
                      autoFocus
                      onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
