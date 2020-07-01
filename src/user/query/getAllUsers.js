const { User } = require('../model.js')

module.exports = function getAllUsers() {
  const users = User.find()
  return users
}
