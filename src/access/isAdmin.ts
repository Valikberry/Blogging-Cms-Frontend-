import type { AccessArgs } from 'payload'

import type { User } from '@/payload-types'

type IsAdmin = (args: AccessArgs<User>) => boolean

export const isAdmin: IsAdmin = ({ req: { user } }) => {
  // Check if user exists and has admin role
  return Boolean(user?.roles?.includes('admin'))
}
