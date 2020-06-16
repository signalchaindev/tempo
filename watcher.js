import path from 'path'
import chokidar from 'chokidar'
import chalk from 'chalk'
import child_process from 'child_process'

const root = path.join(process.cwd())
const tempoDevEnv = path.join(process.cwd(), 'packages', 'tempo')
const nodeModules = path.join(process.cwd(), 'node_modules')
const tempo = path.join(process.cwd(), 'node_modules', 'tempo')

chokidar
  .watch(['./**/*.graphql', './packages/tempo/**/*', '!./__tempo__'])
  .on('change', event => {
    console.log(chalk.blue(`[tempo] Change in ${event}`))

    // copy packages in packages dir into node modules
    if (process.env.NODE_ENV === 'development') {
      child_process.execSync(`cp -r ${tempoDevEnv} ${nodeModules}`, cb)

      // Remove after registerAPI generation is complete
      child_process.execSync(
        `cp -r ${tempo}/registerAPI.js ${root}/__tempo__/registerAPI.js`,
        cb,
      )
    }

    // Write type defs from node modules to __tempo__
    child_process.execSync(
      `cp -r ${tempo}/typeDefs.js ${root}/__tempo__/typeDefs.js`,
      cb,
    )

    // build executable and run
    child_process.execSync('go build && tempo', { cwd: tempo }, cb)
  })

/**
 * Callback for errors and stdout
 */
function cb(error, stdout, stderr) {
  if (error) {
    console.error(chalk.red(`Error: ${error.message}`))
    return
  }

  if (stderr) {
    console.error(chalk.red(`Error: ${stderr}`))
    return
  }

  // stdout
  console.log(chalk.blue(stdout))
}
