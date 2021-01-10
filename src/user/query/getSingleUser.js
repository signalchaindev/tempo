import { User } from '../model.js'

export function getSingleUser(_, args) {
  const user = User.findOne({ email: args.email })
  return user
}
