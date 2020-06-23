# Tempo (name suggestions welcome. Tempo is taken on NPM)

A Node Graphql framework.

[WIP]

## FYI

- Sometimes in a new project you have to copy paste the tempo directory into `node_modules` manually to kick start it (copy example for bare bones starting point)

- Filenames cannot be repeated

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

## The magic

A folder in the root of the `src` directory denotes a collection of like functionality

That file should have a `query` directory and/or a `mutation` directory. Typically schema (`*.graphql`) files live in the root of a collection directory.

Files in the `query` or `mutation` folders should have one default exported function the same name as the file. These are your resolvers and automatically receive `parent, args, context, info` as params, as you would expect any other graphql resolver to have.

TODO: setup export command to allow custom setup
