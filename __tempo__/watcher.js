import chokidar from 'chokidar'
import chalk from 'chalk'
import { buildBinary, run } from './builder.js'

/**
 * Build and run on src file change
 */
export function init() {
  chokidar
    .watch(['./src/**/*.js', './src/**/*.graphql'], {
      ignored: [/node_modules/, /__tempo__/],
    })
    .on('change', path => {
      console.log(chalk.blue(`[tempo] Changed file ${path}`))
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
      .on('change', event => {
        console.log(chalk.blue(`[tempo] Change in ${event}`))
        buildBinary()
        run()
      })
  }
}
