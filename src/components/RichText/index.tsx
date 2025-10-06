

import { serializeLexical } from "@/utilities/serializeLexical"

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



