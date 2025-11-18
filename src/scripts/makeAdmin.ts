import { getPayload } from 'payload'
import config from '@payload-config'

const makeAdmin = async () => {
  const payload = await getPayload({ config })

  try {
    // Find the user by email
    const users = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'help.14x@gmail.com',
        },
      },
    })

    if (users.docs.length === 0) {
      console.error('❌ User not found with email: help.14x@gmail.com')
      process.exit(1)
    }

    const user = users.docs[0]

    // Update user to have admin role
    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        roles: ['admin'],
      },
    })

    console.log('✅ Successfully updated user to admin!')
    console.log(`User: ${user.email}`)
    console.log(`Name: ${user.name || 'N/A'}`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error updating user:', error)
    process.exit(1)
  }
}

makeAdmin()
