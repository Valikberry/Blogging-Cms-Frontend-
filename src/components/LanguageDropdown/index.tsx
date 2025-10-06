'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Globe, Check, ChevronDown } from 'lucide-react'

interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

export const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'rw', name: 'Kinyarwanda', nativeName: 'Ikinyarwanda', flag: '🇷🇼' },
]

interface LanguageDropdownProps {
  currentLanguage?: string
  onLanguageChange?: (languageCode: string) => void
  buttonLabel?: string
}

export const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  currentLanguage = 'en',
  onLanguageChange,
  buttonLabel = 'Language',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleLanguageSelect = (code: string) => {
    onLanguageChange?.(code)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-orange-500 text-white text-sm font-medium px-4 py-1.5 rounded hover:bg-orange-600 transition-colors flex items-center gap-2"
      >
        <span>{buttonLabel}</span>
        <span className="text-xs opacity-80">{currentLanguage.toUpperCase()}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-200">
            <div className="flex items-center gap-2 text-gray-700">
              <Globe className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-semibold">Select Language</span>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language.code)}
                className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${
                  currentLanguage === language.code ? 'bg-orange-50' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{language.flag}</span>
                  <div className="text-left">
                    <div className="font-medium text-gray-900 text-sm">
                      {language.nativeName}
                    </div>
                    <div className="text-xs text-gray-500">{language.name}</div>
                  </div>
                </div>
                {currentLanguage === language.code && (
                  <Check className="w-4 h-4 text-orange-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}