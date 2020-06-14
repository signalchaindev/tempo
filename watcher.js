import path from 'path'
import chokidar from 'chokidar'
import chalk from 'chalk'
import child_process from 'child_process'

chokidar.watch(['./**/*.graphql', '!./__tempo__']).on('change', event => {
  console.log(chalk.blue(`\n[watcher] Change in ${event}\n`))

  const tempo = path.join(process.cwd(), 'packages', 'tempo')
  const node_modules = path.join(process.cwd(), 'node_modules')

  child_process.exec(
    // copy packages in packages dir into node modules
    `cp -r ${tempo} ${node_modules} && go build && tempo`,
    { cwd: `${path.join(node_modules, 'tempo')}` },
    (error, stdout, stderr) => {
      if (error) {
        console.error(`error: ${error.message}`)
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
