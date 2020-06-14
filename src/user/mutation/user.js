function createUser(_, args) {
  console.log('args:', args)

  const email = email || 'james@mail.com'

  return {
    email,
    password: 'asdfasdf',
  }
}
