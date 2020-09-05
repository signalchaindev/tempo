# Tempo

A Node Graphql framework that uses Golang to create a resolver map and concatenate the SDL from GraphQL files into a useable schema for JavaScript APIs.

(name suggestions welcome. Tempo is taken on NPM)

## Docs

### Quick start

1. Create a `src` folder in the root directory

1. Copy the `__tempo__` directory into the root of your project

1. Create a `src/server.js` file (Any Apollo/Node server set up should do fine)

1. Import typeDefs and resolvers from the tempo package

```js
import typeDefs from '../__tempo__/typeDefs.js'
import resolvers from '../__tempo__/registerAPI.js'
```

### NPM Scripts

```js
"scripts": {
  "dev": "run-p --race api watch",
  "api": "nodemon -r esm -e js,graphql src/server.js --ignore __tempo__",
  "watch": "nodemon -r esm __tempo__/watcher.js --ignore __tempo__"
},
```

### Project structure

A folder in the `src` directory denotes a collection of like functionality

That folder should have a schema file (`schema.graphql`), `query` directory, and/or a `mutation` directory.

Files in the `query` or `mutation` folders should have _one_ default export; a function of the same name as the file. These are your resolvers and automatically receive `parent, args, context, info` as params, as you would expect any other graphql resolver to have.

Files being used for queries and mutations must have unique names. Because imports in the resolver map are set using the file's name, filenames cannot be repeated.

## Ignoring files and skip dirs

Tempo automatically skips files and directories with the names:

1. .git

1. node_modules

1. utils

**Prefixing files with an underscore will cause them to be skipped by the compiler.**

## Development

### NPM Dev Scripts

```js
"scripts": {
  "dev:package": "run-p --race api watch:package",
  "api": "nodemon -r esm -e js,graphql src/server.js --ignore __tempo__",
  "watch:package": "cross-env PACKAGE_DEV=true nodemon -r esm __tempo__/watcher.js --ignore __tempo__"
},
```

### Database

Requires MongoDB for package development

Website: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
