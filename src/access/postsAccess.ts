import type { AccessArgs, Where } from 'payload'

type AccessResult = boolean | Where

export const readPostsAccess = ({ req: { user } }: AccessArgs): AccessResult => {
  // Public/unauthenticated users can only see published posts
  if (!user) {
    return {
      _status: {
        equals: 'published',
      },
    } as Where
  }

  // Admins can see all posts
  if (user.roles?.includes('admin')) return true

  // Authors can only see their own posts (in admin panel)
  // Frontend queries for published posts are typically unauthenticated
  return {
    authors: {
      contains: user.id,
    },
  } as Where
}

export const updatePostsAccess = ({ req: { user } }: AccessArgs): AccessResult => {
  if (!user) return false
  // Admins can update any post
  if (user.roles?.includes('admin')) return true
  // Authors can only update their own posts
  return {
    authors: {
      contains: user.id,
    },
  } as Where
}

export const deletePostsAccess = ({ req: { user } }: AccessArgs): AccessResult => {
  if (!user) return false
  // Admins can delete any post
  if (user.roles?.includes('admin')) return true
  // Authors can only delete their own posts
  return {
    authors: {
      contains: user.id,
    },
  } as Where
}
