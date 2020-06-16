// Resolvers
import testConnection from '../src/base/query/testConnection.js'
import populateDb from '../src/base/mutation/populateDb.js'
import resetDb from '../src/base/mutation/resetDb.js'
import createUser from '../src/user/mutation/createUser.js'
import allUsers from '../src/user/query/allUsers.js'
import singleUser from '../src/user/query/singleUser.js'

// Scalars
import scalar from 'tempo/scalars'
const Date = scalar.Date

const Resolvers = {
  Mutation: {
    populateDb,
    resetDb,
    createUser,
  },
  Query: {
    testConnection,
    allUsers,
    singleUser,
  },
  Date,
}

export default Resolvers