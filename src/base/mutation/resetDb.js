import mongoose from 'mongoose'

export default async function resetDb() {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error(
      "You're trying to delete the production database dummy! Don't do that.",
    )
  }

  await mongoose.connection.dropDatabase()
  return 'Successfully reset database'
}
