# Tempo

A Node Graphql framework. That uses Golang to create a resolver map and concatenate the SDL from GraphQL files into a useable schema for JavaScript APIs.

(name suggestions welcome. Tempo is taken on NPM)

## Database

Requires MongoDB for package development

Website: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

## FYI

- Filenames cannot be repeated

ex. if you have a `hello.js` query file, you can not have a `hello.js` mutation file

## Quick start

1. Create a `src` folder in the root directory

1. Copy the `__tempo__` directory into the root of your project

1. Create a `src/server.js` file (Any Apollo/Node server set up should do fine)

1. Import typeDefs and resolvers from the tempo package

```js
import typeDefs from '../__tempo__/typeDefs.js'
import resolvers from '../__tempo__/registerAPI.js'
```

## NPM Scripts

```js
"scripts": {
  "dev": "run-p --race api watch",
  "api": "nodemon -r esm -e js,graphql src/server.js --ignore __tempo__",
  "watch": "nodemon -r esm __tempo__/watcher.js --ignore __tempo__"
},
```

## Project structure

A folder in the `src` directory denotes a collection of like functionality

That folder should have a schema file (`schema.graphql`), `query` directory, and/or a `mutation` directory.

Files in the `query` or `mutation` folders should have _one_ default export; a function of the same name as the file. These are your resolvers and automatically receive `parent, args, context, info` as params, as you would expect any other graphql resolver to have.

Prefixing files with an underscore will cause them to be skipped by the compiler.
