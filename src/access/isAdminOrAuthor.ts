import type { AccessArgs } from 'payload'

import type { User } from '@/payload-types'

type IsAdminOrAuthor = (args: AccessArgs<User>) => boolean

export const isAdminOrAuthor: IsAdminOrAuthor = ({ req: { user } }) => {
  // Check if user exists and has either admin or author role
  return Boolean(
    user?.roles?.includes('admin') ||
    user?.roles?.includes('author')
  )
}
