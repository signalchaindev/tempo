import { User } from '../model.js'

export function getAllUsers() {
  const users = User.find()
  return users
}
