import chokidar from 'chokidar'
import chalk from 'chalk'
import { buildBinary, run } from './builder.js'
import child_process from 'child_process'
import kill from 'tree-kill'

export function watch() {
  /**
   * Run root server (replaces nodemon)
   */
  let server

  function serve() {
    if (server) {
      kill(server.pid, 'SIGKILL', (err) => {
        if (err) {
          console.log('err:', err)
        }
      })
    }

    run()

    server = child_process.spawn('node', ['-r esm', 'src/server.js'], {
      stdio: ['ignore', 'inherit', 'inherit'],
      shell: true
    })
  }

  /**
   * Watch src directory
   */
  chokidar
    .watch(['./src/**/*.js', './src/**/*.graphql'], {
      ignored: [/node_modules/, /__tempo__/],
    })
    .on('ready', () => {
      console.log(chalk.blue('[tempo] Server is ready'))
      serve()
    })
    .on('change', path => {
      console.log(chalk.blue(`[tempo] Changed file ${path}`))
      serve()
    })
    .on('unlink', path => {
      console.log(chalk.blue(`[tempo] Removed file ${path}`))
      serve()
    })
    .on('unlinkDir', path => {
      console.log(`[tempo] Removed directory ${path}`)
      serve()
    })
    .on('error', error => {
      console.log(`[tempo] Watcher error: ${error}`)
    })

  /**
   * Watch __tempo__ directory
   */
  if (process.env.PACKAGE_DEV) {
    chokidar
      .watch(['./__tempo__/**/*.js', './__tempo__/**/*.go'], {
        ignored: ['./__tempo__/.bin/**/*', './__tempo__/build/**/*']
      })
      .on('ready', () => {
        console.log(chalk.blue('[tempo] Server is ready'))
        buildBinary()
        run()
      })
      .on('change', event => {
        console.log(chalk.blue(`[tempo] Change in ${event}`))
        buildBinary()
        serve()
      })
  }
}
