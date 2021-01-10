// Uncomment after "signUpUser" mutation is implemented
// import signUpUser from "../../auth/mutation/signUpUser.js";

export async function populateDb(_, args, ctx) {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error(
      "You're trying to populate the production database with fake data dummy! Don't do that.",
    )
  }

  const users = [
    {
      name: 'Admin',
      email: 'admin@mail.com',
      permissions: ['ADMIN', 'USER', 'SUPER_ADMIN'],
    },
    {
      name: 'Jamey',
      email: 'jamey@mail.com',
      password: 'asdfasdf',
    },
  ]
  console.log('users:', users)

  // Uncomment after "signUpUser" mutation is implemented
  // // Sign them up
  // for await (const user of users) {
  //   const input = { input: { ...user } };
  //   await signUpUser(_, input, ctx);
  // }

  return { successMessage: 'Populated DB' }
}
