// components/RenderHero.tsx
import { PostListHero } from '@/components/PostListHero'

export function RenderHero({ type, continentSlug, countrySlug, ...props }: any) {
  switch (type) {
    case 'postList':
      return (
        <PostListHero 
          {...props.postListConfig} 
          continentSlug={continentSlug}
          countrySlug={countrySlug}
        />
      )
    default:
      return null
  }
}