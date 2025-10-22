'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState, useRef } from 'react'
import type { Header } from '@/payload-types'
import { Search, Menu, X } from 'lucide-react'
import Image from 'next/image'

interface HeaderClientProps {
  data: Header
  locale: string
  countries?: any[]
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, countries = [] }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
  console.log(data.logo)

  return (
    <header className="w-full relative z-40">
      <div className="w-full bg-[#6366f1]">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 relative">
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

            {/* Search Bar Overlay - Appears over navigation when open */}
            {searchOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setSearchOpen(false)} />
                <div className="absolute right-14 md:right-14 top-1/2 -translate-y-1/2 z-20 left-4 md:left-auto">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full md:w-80 bg-white/95 border border-white/30 px-4 py-2 rounded-md text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg transition-colors"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setSearchOpen(false)
                      }
                    }}
                  />
                </div>
              </>
            )}

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
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
              {data.showSearch && (
                <button
                  className="text-white hover:bg-white/10 transition-colors p-2 rounded-full relative z-20"
                  aria-label="Search"
                  onClick={() => setSearchOpen(!searchOpen)}
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </nav>

            {/* Mobile Menu Buttons */}
            <div className="flex md:hidden items-center gap-2">
              {data.showSearch && (
                <button
                  className="text-white hover:bg-white/10 transition-colors p-2 rounded-full relative z-20"
                  aria-label="Search"
                  onClick={() => setSearchOpen(!searchOpen)}
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
              {data.navItems?.length ? (
                <button
                  className="text-white hover:bg-white/10 transition-colors p-2 rounded-full"
                  aria-label="Toggle menu"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              ):''}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#6366f1] border-t border-white/10">
            <nav className="container mx-auto max-w-3xl px-4 py-2">
              {data.navItems?.map((item: any, index: number) => {
                if (item.type === 'simple') {
                  const isActive = isActivePath(item.url || '/')
                  return (
                    <Link
                      key={index}
                      href={`/${item.url}` || '/'}
                      className={`block px-4 py-3 text-white hover:bg-white/10 rounded transition-colors text-sm font-medium ${
                        isActive ? 'bg-white/20' : ''
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
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
                    <div key={index} className="py-1">
                      <Link
                        href={continentPath}
                        className={`block px-4 py-3 text-white hover:bg-white/10 rounded transition-colors text-sm font-medium ${
                          isActive ? 'bg-white/20' : ''
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                      {continentCountries.length > 0 && (
                        <div className="pl-4 mt-1 space-y-1">
                          {continentCountries.map((country: any) => {
                            const countryPath = `/${continent?.slug}/${country.slug}`
                            const isCountryActive = pathname === countryPath
                            return (
                              <Link
                                key={country.id}
                                href={countryPath}
                                className={`block px-4 py-2 text-sm text-white/90 hover:bg-white/10 rounded transition-colors ${
                                  isCountryActive ? 'bg-white/20 font-medium' : ''
                                }`}
                                onClick={() => setMobileMenuOpen(false)}
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
          </div>
        )}
      </div>
    </header>
  )
}
