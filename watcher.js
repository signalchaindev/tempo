import fs from 'fs'
import path from 'path'
import chokidar from 'chokidar'
import chalk from 'chalk'
import child_process from 'child_process'

const tempoDevEnv = path.join(process.cwd(), 'packages', 'tempo')
const nodeModules = path.join(process.cwd(), 'node_modules')
const tempo = path.join(process.cwd(), 'node_modules', 'tempo')

function run() {
  if (!fs.existsSync(tempo)) {
    fs.mkdirSync(tempo)
  }

  child_process.execSync('go build && tempo', { cwd: tempo }, cb)
}

/**
 * Write type defs from node modules to __tempo__
 */
chokidar
  .watch('.', {
    ignored: /__tempo__|node_modules/,
  })
  .on('ready', () => {
    run()
  })

/**
 * build executable and run
 */
chokidar
  .watch('./src/**/*.js', {
    ignored: /__tempo__|node_modules/,
  })
  .on('change', event => {
    console.log(chalk.blue(`[tempo] Change in ${event}`))
    run()
  })

/**
 * copy packages in packages dir into node modules
 */
chokidar
  .watch('./packages/tempo/**/*', {
    ignored: /__tempo__|node_modules/,
  })
  .on('change', event => {
    console.log(chalk.blue(`[tempo] Change in ${event}`))
    child_process.execSync(`cp -rf ${tempoDevEnv} ${nodeModules}`, cb)
    run()
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
