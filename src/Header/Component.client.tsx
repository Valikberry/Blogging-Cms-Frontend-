'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState, useRef } from 'react'
import type { Header } from '@/payload-types'
import { Menu, X, Mail } from 'lucide-react'
import Image from 'next/image'

interface HeaderClientProps {
  data: Header
  locale: string
  countries?: any[]
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, countries = [] }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHeaderTheme(null)
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
  }, [headerTheme])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen])

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <header className="w-full fixed top-0 left-0 right-0 z-40">
      <div className="w-full bg-[#6366f1]">
        <div className="container mx-auto max-w-[44rem] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 relative">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity"
            >
              {data.logo?.image && typeof data.logo.image !== 'string' && (
                <Image
                  src={data.logo.image.url || ''}
                  alt={data.logo.image.alt || 'AskGeopolitics logo'}
                  width={30}
                  height={30}
                  className="object-contain rounded-full"
                  priority
                />
              )}
              {data.logo?.text && <span className="font-bold text-xl">{data.logo.text}</span>}
            </Link>

            {/* Menu Button */}
            <div className="relative" ref={menuRef}>
              <button
                className="text-white hover:bg-white/10 transition-colors p-2 rounded-full"
                aria-label="Toggle menu"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl min-w-[200px] py-3 z-50 border border-gray-100">
                  {/* Subscribe Button */}
                  <div className="px-3 mb-2">
                    <Link
                      href="/subscribe"
                      className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors text-sm"
                      onClick={() => setMenuOpen(false)}
                    >
                      <Mail className="w-4 h-4" />
                      Subscribe
                    </Link>
                  </div>

                  {/* Countries List */}
                  {countries.length > 0 && (
                    <div className="border-t border-gray-100 pt-2">
                      {countries.map((country: any) => {
                        const countrySlug = country.slug
                          ? country.slug.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
                          : ''
                        const flagUrl = country.flag?.url

                        return (
                          <Link
                            key={country.id}
                            href={`/${countrySlug}`}
                            className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                            onClick={() => setMenuOpen(false)}
                          >
                            {flagUrl ? (
                              <Image
                                src={flagUrl}
                                alt={`${country.name} flag`}
                                width={24}
                                height={16}
                                className="object-cover rounded-sm"
                              />
                            ) : (
                              <div className="w-6 h-4 bg-gray-200 rounded-sm" />
                            )}
                            <span>{country.name}</span>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
