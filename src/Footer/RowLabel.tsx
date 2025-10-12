// src/Footer/RowLabel.tsx
'use client'

import React from 'react'
import { useRowLabel } from '@payloadcms/ui'
import type { Footer } from '@/payload-types'

export const RowLabel: React.FC = () => {
  const data = useRowLabel<NonNullable<Footer['navItems']>[number]>()

  const label = data?.data?.link?.label
    ? `Nav item ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}: ${data?.data?.link?.label}`
    : 'Row'

  return <div>{label}</div>
}