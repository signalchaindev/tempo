import fs from 'fs'
import path from 'path'
import { mergeTypeDefs } from 'graphql-toolkit'

/**
 * @function loadGQLFiles
 *
 * @returns An array of the same length as the 'options.files' array, where the file path is replaced with the contents of that file as a utf-8 string
 */
function loadGQLFiles() {
  const srcDir = path.join(process.cwd(), 'node_modules', 'tempo')
  let syncFiles = [
    fs.readFileSync(path.join(srcDir, 'schema.graphql'), 'utf-8'),
  ]
  return mergeTypeDefs(syncFiles)
}

export default loadGQLFiles()
