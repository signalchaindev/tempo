import path from 'path'
import chokidar from 'chokidar'
import chalk from 'chalk'
import child_process from 'child_process'

chokidar
  .watch(['./**/*.graphql', './packages/tempo/**/*', '!./__tempo__'])
  .on('change', event => {
    console.log(chalk.blue(`\n[watcher] Change in ${event}\n`))

    const tempo = path.join(process.cwd(), 'packages', 'tempo')
    const node_modules = path.join(process.cwd(), 'node_modules')

    // copy packages in packages dir into node modules
    child_process.execSync(`cp -r ${tempo} ${node_modules}`, function cb(
      error,
      stdout,
      stderr,
    ) {
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
    })

    // build executable and run
    child_process.execSync(
      'go build && tempo',
      { cwd: `${path.join(node_modules, 'tempo')}` },
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
      },
    )
  })
