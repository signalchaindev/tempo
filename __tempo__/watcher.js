import fs from 'fs'
import path from 'path'
import chokidar from 'chokidar'
import chalk from 'chalk'
import child_process from 'child_process'

const devEnv = path.join(process.cwd(), '__tempo__', 'package')
const buildDir = path.join(process.cwd(), '__tempo__', 'build')
const exeName = 'tempo'

function run() {
  child_process.exec(exeName, { cwd: buildDir }, cb)
}

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

function buildBinary() {
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir)
  }
  child_process.execSync(`go build -o ${buildDir}/${exeName}.exe`, { cwd: devEnv }, cb)
}

/**
 * Build and run on src file change
 */
chokidar
  .watch(['./src/**/*.js', './src/**/*.graphql'], {
    ignored: [/node_modules/, /__tempo__/, /__sapper__/],
  })
  .on('ready', () => {
    setTimeout(() => {
      run()
    }, 300)
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
