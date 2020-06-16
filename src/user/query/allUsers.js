import { User } from '../model.js'

export default function allUsers() {
  const users = User.find()
  return users
}
