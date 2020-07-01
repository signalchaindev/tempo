const { User } = require('../model.js')

module.exports = function createUser(_, args) {
  const user = {
    name: args.name || 'James',
    email: args.email || 'james@mail.com',
    password: args.password || 'asdfasdf',
  }

  User.create(user)

  return user
}
