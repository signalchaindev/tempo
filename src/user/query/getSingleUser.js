const { User } = require('../model.js')

module.exports = function getSingleUser(_, args) {
  const user = User.findOne({ email: args.email })
  return user
}
