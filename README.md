# Tempo

A Node Graphql framework that uses Golang to create a resolver map and concatenate the SDL from GraphQL files into a useable schema for JavaScript APIs.

(name suggestions welcome. Tempo is taken on NPM)

## Docs

### Quick start

1. Create a `src` folder in the root directory

1. Copy the `__tempo__` directory into the root of your project

1. Create a `src/server.js` file (Any Apollo/Node server set up should do fine)

1. Import _typeDefs_, _resolvers_, and _init_ from the tempo package

```js
import { typeDefs, resolvers, init } from '../__tempo__'

init()
```

### NPM Scripts

```js
"scripts": {
  "dev": "npm run build && nodemon -r esm -e js,graphql src/server.js --ignore __tempo__",
  "dev:package": "npm run build && cross-env PACKAGE_DEV=true nodemon -r esm -e js,graphql src/server.js --ignore __tempo__",
  "build": "node -r esm __tempo__/builder.js"
},
```

### Project structure

A folder in the `src` directory denotes a collection of like functionality

That folder should have a schema file (`schema.graphql`), `query` directory, and/or a `mutation` directory.

Files in the `query` or `mutation` directories should have _one_ function that is a default export. This function needs to be named the same as the file. These functions are your resolvers and automatically receive `parent, args, context, info` as params, as you would expect any other graphql resolver to have.

Files being used for queries and mutations must have unique names. Because imports in the resolver map are set using the file's name, filenames cannot be repeated.

## Ignoring files and skip dirs

Tempo automatically skips files and directories with the names:

1. .git

1. node_modules

1. utils

1. Starting with the "underscore". **Prefixing files with an underscore will cause them to be skipped by the compiler.**

## Development

### NPM Dev Scripts

Use the _dev:package_ script when working on the _main.go_ file to get auto reloading/re-running during development.

### Database

Requires MongoDB for package development

Website: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)

## Known bugs

Changing filenames or deleting files can cause the node process to get stuck. Exiting the process and re-running the start script will fix this.