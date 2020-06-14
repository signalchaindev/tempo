import merge from 'lodash/merge'
import Scalars from './scalars'

// Resolvers
import createUser from './user/mutation/user.js'
import allUsers from './user/query/user.js'

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
