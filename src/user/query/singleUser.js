import { User } from '../model.js'

export default function singleUser(_, args) {
  const user = User.findOne({ email: args.email })
  return user
}
