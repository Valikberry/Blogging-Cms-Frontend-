// components/RichText/index.tsx

interface RichTextProps {
  content: any
  className?: string
}

export function RichText({ content, className = '' }: RichTextProps) {
  if (!content) {
    return null
  }

  return (
    <div className={`rich-text ${className}`}>
      {serializeLexical({ nodes: content.root.children })}
    </div>
  )
}

// utilities/serializeLexical.tsx
import React, { Fragment, JSX } from 'react'
import escapeHTML from 'escape-html'
import Link from 'next/link'
import Image from 'next/image'

interface SerializeLexicalProps {
  nodes: any[]
}

export function serializeLexical({ nodes }: SerializeLexicalProps): JSX.Element {
  return (
    <Fragment>
      {nodes?.map((node, index): JSX.Element | null => {
        if (node.type === 'text') {
          let text = <span dangerouslySetInnerHTML={{ __html: escapeHTML(node.text) }} />
          if (node.format & 1) {
            text = <strong key={index}>{text}</strong>
          }
          if (node.format & 2) {
            text = <em key={index}>{text}</em>
          }
          if (node.format & 8) {
            text = <code key={index}>{text}</code>
          }
          if (node.format & 16) {
            text = <u key={index}>{text}</u>
          }
          if (node.format & 64) {
            text = <s key={index}>{text}</s>
          }
          return <Fragment key={index}>{text}</Fragment>
        }

        if (!node) {
          return null
        }

        switch (node.type) {
          case 'heading':
            const HeadingTag = node.tag as keyof JSX.IntrinsicElements
            return <HeadingTag key={index}>{serializeLexical({ nodes: node.children })}</HeadingTag>

          case 'paragraph':
            return <p key={index}>{serializeLexical({ nodes: node.children })}</p>

          case 'list':
            const ListTag = node.tag as keyof JSX.IntrinsicElements
            return <ListTag key={index}>{serializeLexical({ nodes: node.children })}</ListTag>

          case 'listitem':
            return <li key={index}>{serializeLexical({ nodes: node.children })}</li>

          case 'quote':
            return <blockquote key={index}>{serializeLexical({ nodes: node.children })}</blockquote>

          case 'link':
            const linkProps =
              node.fields?.linkType === 'internal'
                ? {
                    href: node.fields?.doc?.value?.slug ? `/${node.fields.doc.value.slug}` : '/',
                  }
                : {
                    href: node.fields?.url || '/',
                    target: node.fields?.newTab ? '_blank' : undefined,
                    rel: node.fields?.newTab ? 'noopener noreferrer' : undefined,
                  }

            return (
              <Link key={index} {...linkProps}>
                {serializeLexical({ nodes: node.children })}
              </Link>
            )

          case 'linebreak':
            return <br key={index} />

          case 'horizontalrule':
            return <hr key={index} />

          case 'block':
            // Handle custom blocks (Banner, Code, MediaBlock)
            const blockType = node.fields?.blockType

            if (blockType === 'code') {
              return (
                <pre
                  key={index}
                  className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"
                >
                  <code>{node.fields?.code || ''}</code>
                </pre>
              )
            }

            if (blockType === 'mediaBlock' && node.fields?.media) {
              const media = node.fields.media
              if (typeof media === 'object' && media.url) {
                return (
                  <figure key={index} className="my-8">
                    <Image
                      src={media.url}
                      alt={media.alt || ''}
                      width={media.width || 800}
                      height={media.height || 600}
                      className="rounded-lg w-full h-auto"
                    />
                    {media.caption && (
                      <figcaption className="text-sm text-gray-600 mt-2 text-center">
                        {media.caption}
                      </figcaption>
                    )}
                  </figure>
                )
              }
            }

            if (blockType === 'banner') {
              return (
                <div
                  key={index}
                  className={`p-6 rounded-lg my-6 ${
                    node.fields?.style === 'info'
                      ? 'bg-blue-50 border border-blue-200'
                      : node.fields?.style === 'warning'
                        ? 'bg-yellow-50 border border-yellow-200'
                        : node.fields?.style === 'error'
                          ? 'bg-red-50 border border-red-200'
                          : 'bg-green-50 border border-green-200'
                  }`}
                >
                  {serializeLexical({ nodes: node.fields?.content?.root?.children || [] })}
                </div>
              )
            }

            return null

          default:
            return null
        }
      })}
    </Fragment>
  )
}
