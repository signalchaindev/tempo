import { User } from '../model.js'

export default function getAllUsers() {
  const users = User.find()
  return users
}
