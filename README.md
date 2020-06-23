# Tempo (name suggestions welcome. Tempo is taken on NPM)

A Node Graphql framework.

[WIP]

## FYI

- Filenames cannot be repeated

- Sometimes in a new project you have to copy paste the tempo directory into `node_modules` manually to kick start it

ex. if you have a `hello.js` query file, you can not have a `hello.js` mutation file

## Quick start

1. Create a `src` folder in the root directory

1. Create a `src/server.js` file (Any Apollo/Node server set up should do fine)

1. Copy the `watcher.js` file into the root directory

1. Copy the `packages/tempo` directory into the root directory

1. Write you SDL schema or schemas in the `src` dir

1. Make sure you are importing you typeDefs and resolvers from the tempo package

```js
import typeDefs from 'tempo/typeDefs.js'
import resolvers from 'tempo/registerAPI.js'
```

## NPM Scripts

```js
"scripts": {
  "dev": "run-p --race api watch",
  "api": "nodemon -e js,graphql -r esm src/server.js",
  "watch": "cross-env NODE_ENV=development nodemon -r esm watcher.js --watch src/**/*.graphql",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

Run with `npm run dev`
