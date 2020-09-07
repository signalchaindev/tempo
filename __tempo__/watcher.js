import fs from 'fs'
import path from 'path'
import chokidar from 'chokidar'
import chalk from 'chalk'
import child_process from 'child_process'

/**
 * Build and run on src file change
 */
export function init() {
  chokidar
    .watch(['./src/**/*.js', './src/**/*.graphql'], {
      ignored: [/node_modules/, /__tempo__/],
    })
    .on('ready', () => {
      buildBinary()
      run()
    })
    .on('change', path => {
      console.log(chalk.blue(`[tempo] Changed file ${path}`))
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
    })


  /**
   * For package dev
   */
  if (process.env.PACKAGE_DEV) {
    chokidar
      .watch('./__tempo__/package/**/*.go')
      .on('ready', () => {
        buildBinary()
      })
      .on('change', event => {
        console.log(chalk.blue(`[tempo] Change in ${event}`))
        buildBinary()
        run()
      })
  }
}

const devEnv = path.join(process.cwd(), '__tempo__', 'package')
const buildDir = path.join(process.cwd(), '__tempo__', 'build')
const exeName = 'tempo'

function run() {
  child_process.exec(`${exeName} ${process.cwd()}`, { cwd: buildDir }, cb)
}

export function buildBinary() {
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir)
  }
  child_process.execSync(`go build -o ${buildDir}/${exeName}.exe`, { cwd: devEnv }, cb)
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

  // Print stdout
  console.log(stdout)
}
