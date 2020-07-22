import fs from 'fs'
import path from 'path'
import chokidar from 'chokidar'
import chalk from 'chalk'
import child_process from 'child_process'

const tempoDevEnv = path.join(process.cwd(), '__tempo__', 'package')
const dist = path.join(process.cwd(), '__tempo__', 'tempo')

function run() {
  if (process.env.PACKAGE_DEV) {
    if (!fs.existsSync(dist)) {
      copyDevToDist()
    }

    child_process.execSync('go build && tempo', { cwd: dist }, cb)
    return
  }

  child_process.execSync('tempo', { cwd: dist }, cb)
}

/**
   * Build and run on src file change
   */
chokidar
  .watch(['./src/**/*.js', './src/**/*.graphql'], {
    ignored: [/node_modules/, /__tempo__/],
  })
  .on('ready', () => {
    run()
  })
  .on('addDir', path => {
    console.log(chalk.blue(`[tempo] Added directory ${path}`))
    run()
  })
  .on('change', path => {
    console.log(chalk.blue(`[tempo] Change in ${path}`))
    run()
  })
  .on('unlink', path => {
    console.log(chalk.blue(`[tempo] Removed file ${path}`))
    run()
  })
  .on('unlinkDir', path => {
    console.log(`[tempo] Removed directory ${path}`)
    run()
  })
  .on('error', error => {
    console.log(`[tempo] Watcher error: ${error}`)
    run()
  })

/**
 * For package dev
 */
let copyDevToDist

if (process.env.PACKAGE_DEV) {
  copyDevToDist = () => {
    if (!fs.existsSync(dist)) {
      fs.mkdirSync(dist)
    }

    child_process.execSync(`cp ${path.join(tempoDevEnv, 'main.go')} ${dist}`, cb)
  }

  chokidar
    .watch('./__tempo__/package/**/*')
    .on('change', event => {
      console.log(chalk.blue(`[tempo] Change in ${event}`))
      copyDevToDist()
      run()
    })
}

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
