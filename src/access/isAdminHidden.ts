import type { ClientUser } from 'payload'

export const isAdminHidden = ({ user }: { user: ClientUser }): boolean => {
  // Hide from non-admin users (authors)
  // Return true to hide, false to show
  const roles = (user as unknown as { roles?: string[] })?.roles
  return !roles?.includes('admin')
}
