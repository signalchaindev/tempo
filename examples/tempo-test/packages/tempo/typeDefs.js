import fs from 'fs'
import path from 'path'
import { mergeTypeDefs } from 'graphql-toolkit'

export default loadGQLFiles({
  src: 'node_modules/tempo',
  files: ['/schema.graphql'],
})

/**
 * @function loadGQLFiles
 *
 * @param {Object} options
 * @param {String} options.src - Will be prepended to the file paths in the files option
 * @default src defaults to the root of the running process
 *
 * @param {Array!} files - An array of file paths to your graphql files
 *
 * @returns An array of the same length as the 'options.files' array, where the file path is replaced with the contents of that file as a utf-8 string
 */
function loadGQLFiles(options) {
  const srcDir = options.src
    ? path.join(process.cwd(), path.join(options.src))
    : path.join(process.cwd())

  let syncFiles = []

  for (const file of options.files) {
    syncFiles = [
      ...syncFiles,
      fs.readFileSync(path.join(srcDir, file), 'utf-8'),
    ]
  }

  return mergeTypeDefs(syncFiles)
}
