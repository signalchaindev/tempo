import { ApolloServer } from 'apollo-server-express'
import { typeDefs } from './package/typeDefs.js'
import { resolvers } from './build/registerAPI.js'

/**
 * @function tempo
 *
 * @const {Object} typeDefs - Schema AST generated by Tempo
 * @const {Object} resolvers - Resolver map generated by Tempo
 *
 * @param {Express App Instance} app - This argument is passed to the applyMiddleware method. It has been abstracted to a stand alone argument for convenience since the most basic starting point only requires this parameter to work.
 * @param {Object} obj - Apollo server and middleware options
 *
 * https://www.apollographql.com/docs/apollo-server/api/apollo-server/#apolloserver
 * @param {Object} obj.server - Apollo Server Express options
 * @param {Object} obj.server.context
 *
 * https://www.apollographql.com/docs/apollo-server/api/apollo-server/#apolloserverapplymiddleware
 * @param {Object} obj.middleware - applyMiddleWare options
 * @param {Object} obj.middleware.app
 * @param {Object} obj.middleware.path
 * @param {Object} obj.middleware.cors
 * @param {Object} obj.middleware.bodyParserConfig
 */
export function tempo(app, obj) {
  const graphQLServer = new ApolloServer({
    ...obj.server,
    typeDefs,
    resolvers: {
      ...obj.server.resolvers,
      ...resolvers,
    },
  })

  graphQLServer.applyMiddleware({
    app,
    path: '/__graphql',
    ...obj.middleware
  })
}