const { User } = require('../model.js')

export function deleteUser(_, args) {
  const user = User.find({ _id: args.id })
  console.log('user:', user)
  return user
}
