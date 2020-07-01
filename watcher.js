const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const chalk = require('chalk')
const child_process = require('child_process')

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
 * Initialize on process start
 */
chokidar
  .watch('.', {
    ignored: /node_modules/,
  })
  .on('ready', () => {
    run()
  })

/**
 * Build and run on src file change
 */
chokidar
  .watch(['./src/**/*.js', './src/**/*.graphql'], {
    ignored: /node_modules/,
  })
  .on('change', event => {
    console.log(chalk.blue(`[tempo] Change in ${event}`))
    run()
  })

/**
 * Copy packages in packages dir into node modules (for local dev)
 * TODO: Find a better dev workflow
 */
chokidar
  .watch('./packages/tempo/**/*', {
    ignored: /node_modules/,
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
  console.log(stdout)
}
