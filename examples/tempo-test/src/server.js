import express from "express";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import dotenv from "dotenv";
import typeDefs from "tempo/typeDefs.js";
import resolvers from "tempo/registerAPI.js";

const app = express();
const port = 3001;
const gqlServerEndpoint = "localhost:3001";
const gqlServerPath = "__playground";

const corsOptions = {
  origin: "http://localhost:3001",
  credentials: true,
  methods: "GET,POST,PUT,PATCH,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const graphQLServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    return { req, res };
  },
});

graphQLServer.applyMiddleware({
  app,
  path: `/${gqlServerPath}`,
  cors: corsOptions,
});

// Start app
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
app.listen({ port }, (err) => {
  if (err) {
    console.error(
      "🚨  UNABLE TO START: An error occurred on the sapper server"
    );
    console.error(err.stack);
    process.exit(1);
  }
  console.log(`[playground] ${gqlServerEndpoint}/${gqlServerPath}`);
});
