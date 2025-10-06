

import { serializeLexical } from "@/utilities/serializeLexical"

interface RichTextProps {
  content: any
  className?: string
}

 function RichText({ content, className = '' }: RichTextProps) {
  if (!content) {
    return null
  }

  return (
    <div className={`rich-text ${className}`}>
      {serializeLexical({ nodes: content.root.children })}
    </div>
  )
}

export default RichText

