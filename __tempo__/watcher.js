import chokidar from 'chokidar'
import chalk from 'chalk'
import { buildBinary, run } from './package/builder.js'
import child_process from 'child_process'
import kill from 'tree-kill'

/**
 * Run root server (replaces nodemon)
 */
let server

function serve(options) {
  if (server) {
    kill(server.pid, 'SIGKILL', err => {
      if (err) {
        console.log('err:', err)
      }
    })
  }

  run(options)

  server = child_process.spawn('node', ['-r esm', 'src/server.js'], {
    stdio: ['ignore', 'inherit', 'inherit'],
    shell: true,
  })
}

export function watch(options) {
  if (process.env.PACKAGE_DEV) watchDevDirs()
  serve(options)

  const watchDirs = []
  for (const dir of options.dirs) {
    watchDirs.push(`./${dir}/**/*.js`)
    watchDirs.push(`./${dir}/**/*.graphql`)
  }

  chokidar
    .watch(watchDirs, {
      ignored: [/node_modules/, /__tempo__/],
    })
    .on('ready', () => {
      console.log(chalk.blue('[tempo] Server is ready'))
      serve(options)
    })
    .on('change', path => {
      console.log(chalk.blue(`[tempo] Changed file ${path}`))
      serve(options)
    })
    .on('unlink', path => {
      console.log(chalk.blue(`[tempo] Removed file ${path}`))
      serve(options)
    })
    .on('unlinkDir', path => {
      console.log(`[tempo] Removed directory ${path}`)
      serve(options)
    })
    .on('error', error => {
      console.log(`[tempo] Watcher error: ${error}`)
    })
}

function watchDevDirs() {
  /**
   * Watch __tempo__ directory
   */
  chokidar
    .watch(['./__tempo__/**/*.js', './__tempo__/**/*.go'], {
      ignored: ['./__tempo__/.bin/**/*', './__tempo__/build/**/*'],
    })
    .on('ready', () => {
      console.log(chalk.blue('[tempo] Binary is building...'))
      buildBinary()
    })
    .on('change', () => {
      console.log(chalk.blue('[tempo] Binary is building...'))
      buildBinary()
    })
}
