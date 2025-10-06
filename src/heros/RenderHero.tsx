// components/RenderHero.tsx

import { PostListHero } from '@/components/PostListHero'

export function RenderHero({ type, ...props }: any) {
  switch (type) {
    case 'postList':
      return <PostListHero {...props.postListConfig} />
    default:
      return null
  }
}
