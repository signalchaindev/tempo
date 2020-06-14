import merge from 'lodash/merge'
import Scalars from 'tempo/scalars'

// Resolvers
import createUser from './user/mutation/createUser.js'
import allUsers from './user/query/allUsers.js'

const Resolvers = {
  Mutation: {
    createUser,
  },
  Query: {
    allUsers,
  },
}

/**
 * Merge Resolvers
 */
const resolvers = merge(Scalars, Resolvers)

export default resolvers
