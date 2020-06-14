export default function createUser(_, args) {
  const email = args.email || 'james@mail.com'

  return {
    email,
    password: 'asdfasdf',
  }
}
