// components/Header/index.tsx
import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import type { Header } from '@/payload-types'

interface HeaderProps {
  locale?: 'en' | 'fr'
}

export async function Header({ locale = 'en' }: HeaderProps) {

  const headerData = (await getCachedGlobal('header', 3, locale)()) as Header

  return <HeaderClient data={headerData} locale={locale} />
}
