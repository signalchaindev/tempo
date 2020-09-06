import fs from 'fs'
import path from 'path'
import { mergeTypeDefs } from '@graphql-tools/merge'

/**
 * @function loadGQLFiles
 *
 * @return {Object} - GraphQL AST
 */
function loadGQLFiles() {
  const schema = path.join(process.cwd(), '__tempo__', 'build', 'schema.graphql')
  let syncFiles = fs.readFileSync(schema, 'utf-8')
  return mergeTypeDefs([syncFiles])
}

export const typeDefs = loadGQLFiles()
