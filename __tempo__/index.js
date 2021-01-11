import path from 'path'
import fg from 'fast-glob'
import { run } from './package/builder.js'
import { typeDefs } from './package/typeDefs.js'
import { resolvers } from './build/registerAPI.js'

export { typeDefs, resolvers }

export default function tempo(options = {}) {
  return {
    name: 'tempo',

    async buildStart() {
      run({
        dev: options.dev,
        dirs: options.dirs,
      })

      const files = []
      for (const dir of options.dirs) {
        const gqlFiles = await fg(`${dir}/**/*.graphql`)
        const jsFiles = await fg(`${dir}/**/*.js`)
        files.push(...gqlFiles)
        files.push(...jsFiles)
      }

      for (const file of files) {
        this.addWatchFile(path.join(process.cwd(), file))
      }
    },
  }
}
