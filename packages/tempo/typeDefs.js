import fs from 'fs'
import path from 'path'
import { mergeTypeDefs } from 'graphql-toolkit'

/**
 * @function loadGQLFiles
 */
function loadGQLFiles() {
  const srcDir = path.join(process.cwd(), 'node_modules', 'tempo')
  let syncFiles = fs.readFileSync(path.join(srcDir, 'schema.graphql'), 'utf-8')
  return mergeTypeDefs([syncFiles])
}

export default loadGQLFiles()
