const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const { ApolloServer } = require('apollo-server-express')
const cors = require('cors')
const dotenv = require('dotenv')
const scalar = require('./scalars')
const typeDefs = require('tempo/typeDefs.js')
const resolvers = require('tempo/registerAPI.js')

const Date = scalar.Date

const envPath = path.join(process.cwd(), '.env')
dotenv.config({ path: envPath })

const dbUri = process.env.DATABASE_URI
mongoose
  .connect(dbUri, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log('[database] connected'))
  .catch(err => console.error(`\n\nMongoose Error: \n${err}\n\n`))

const app = express()
const dev = process.env.NODE_ENV === 'development'
const port = parseInt(process.env.PORT) || 3001
const gqlServerEndpoint = process.env.GQL_SERVER_ENDPOINT_BASE
const gqlServerPath = process.env.GQL_SERVER_PATH

const corsOptions = {
  origin: 'http://localhost:3001',
  credentials: true,
  methods: 'GET,POST,PUT,PATCH,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))

const graphQLServer = new ApolloServer({
  typeDefs,
  resolvers: {
    ...resolvers,
    Date,
  },
  context: ({ req, res }) => {
    return { req, res }
  },
})

graphQLServer.applyMiddleware({
  app,
  path: `/${gqlServerPath}`,
  cors: corsOptions,
})

// Start app
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

app.listen({ port }, err => {
  if (err) {
    console.error('🚨  UNABLE TO START: An error occurred on the sapper server')
    console.error(err.stack)
    process.exit(1)
  }
  dev && console.log(`[playground] ${gqlServerEndpoint}/${gqlServerPath}`)
})
