import type { Theme } from './types'

export const themeLocalStorageKey = 'payload-theme'

// Force light theme only
export const defaultTheme: Theme = 'light'

export const getTheme = (): Theme => {
  // You could still check localStorage if you want persistence
  const stored = window.localStorage.getItem(themeLocalStorageKey)
  if (stored === 'light') return 'light'

  // Ignore OS preference
  return defaultTheme
}
