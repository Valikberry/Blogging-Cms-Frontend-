import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

import type { Page, Post } from '@/payload-types'

type CMSLinkType = {
  appearance?: 'inline' | 'link' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Post | string | number | { id: string }
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    reference,
    size: sizeFromProps,
    url,
  } = props

  let href = ''

  // Handle reference type links
  if (type === 'reference' && reference) {
    const relationTo = reference.relationTo
    const value = reference.value

    // Check if value is a full object with slug
    if (typeof value === 'object' && value !== null && 'slug' in value) {
      const slug = value.slug
      href = relationTo === 'pages' ? `/${slug}` : `/${relationTo}/${slug}`
    } 
    // Handle case where only ID is returned (shouldn't happen with proper depth)
    else if (typeof value === 'object' && value !== null && 'id' in value) {
      console.error('Reference not populated! Only ID available:', value.id)
      // Fallback: use ID (not ideal but prevents crash)
      href = relationTo === 'pages' ? `/${value.id}` : `/${relationTo}/${value.id}`
    }
    // Handle string ID
    else if (typeof value === 'string') {
      console.error('Reference not populated! Only ID available:', value)
      href = relationTo === 'pages' ? `/${value}` : `/${relationTo}/${value}`
    }
  } 
  // Handle custom URL links
  else if (type === 'custom' && url) {
    href = url
  }

  // If no valid href, don't render anything
  if (!href) {
    console.warn('CMSLink: No valid href found', { type, reference, url, label })
    return null
  }

  const size = appearance === 'link' ? 'clear' : sizeFromProps
  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  // For navigation links (appearance: 'link' or 'inline')
  if (appearance === 'inline' || appearance === 'link') {
    return (
      <Link 
        className={cn('text-gray-300 hover:text-white transition-colors text-sm font-medium', className)} 
        href={href} 
        {...newTabProps}
      >
        {label || children}
      </Link>
    )
  }

  // For button-style links
  return (
    <Button asChild className={className} size={size} variant={appearance}>
      <Link href={href} {...newTabProps}>
        {label || children}
      </Link>
    </Button>
  )
}