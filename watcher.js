import fs from 'fs'
import path from 'path'
import chokidar from 'chokidar'
import chalk from 'chalk'
import child_process from 'child_process'

const tempoDevEnv = path.join(process.cwd(), 'packages', 'tempo')
const nodeModules = path.join(process.cwd(), 'node_modules')
const tempo = path.join(nodeModules, 'tempo')

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
  .on('addDir', path => log(`[tempo] Added directory ${path}`))
  .on('change', path => {
    console.log(chalk.blue(`[tempo] Change in ${path}`))
    run()
  })
  .on('unlink', path => {
    console.log(chalk.blue(`[tempo] Removed file ${path}`))
    run()
  })
  .on('unlinkDir', path => log(`[tempo] Removed directory ${path}`))
  .on('error', error => log(`[tempo] Watcher error: ${error}`))
// .on('add', path => log(`[tempo] Added file ${path}`))

/**
 * For package dev
 * 
 * Copy packages in packages dir into node modules
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
