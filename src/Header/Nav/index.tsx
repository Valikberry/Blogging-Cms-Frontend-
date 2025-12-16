'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import type { Header, Country } from '@/payload-types'

interface HeaderNavProps {
  data: Header
  countries?: Country[] // Pass countries from server
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ data, countries = [] }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  return (
    <>
      {data.navItems?.map((item: any, index: number) => {
        // Simple Link (Home)
        if (item.type === 'simple') {
          return (
            <Link
              key={index}
              href={item.url || '/'}
              className="px-4 py-2 text-white hover:bg-white/10 rounded transition-colors text-sm font-medium"
            >
              {item.label}
            </Link>
          )
        }

        // Continent Dropdown
        if (item.type === 'continent' && item.continent) {
          const continent = typeof item.continent === 'string' ? null : item.continent
          
          // Filter countries for this continent
          const continentCountries = countries.filter(
            (country: Country) => {
              const countryContinent = typeof country.continent === 'string'
                ? country.continent
                : country.continent?.id
              const currentContinentId = typeof continent?.id === 'string'
                ? continent.id
                : continent?.id
              return countryContinent === currentContinentId
            }
          )

          return (
            <div
              key={index}
              className="relative group"
              onMouseEnter={() => setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className="px-4 py-2 text-white hover:bg-white/10 rounded transition-colors text-sm font-medium flex items-center gap-1">
                {item.label}
                <svg
                  className="w-4 h-4 transition-transform group-hover:rotate-180"
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
              </button>

              {/* Dropdown Menu */}
              {openDropdown === item.label && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-xl min-w-[220px] py-2 z-50 border border-gray-200">
                  {continentCountries.length > 0 ? (
                    continentCountries.map((country: Country) => (
                      <Link
                        key={country.id}
                        href={`/${country.slug}/polls`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        {country.name}
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      No countries available
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        }

        return null
      })}
    </>
  )
}