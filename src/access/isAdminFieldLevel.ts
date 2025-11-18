import type { FieldAccess } from 'payload'

import type { User } from '@/payload-types'

export const isAdminFieldLevel: FieldAccess<User> = ({ req: { user } }) => {
  // Check if user exists and has admin role
  return Boolean(user?.roles?.includes('admin'))
}
