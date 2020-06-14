import path from 'path'
import chokidar from 'chokidar'
import chalk from 'chalk'
import child_process from 'child_process'

chokidar.watch(['./**/*.graphql', '!./__tempo__']).on('change', event => {
  console.log(chalk.blue(`[watcher] Change in ${event}`))

  child_process.exec(
    `cp -r ${path.join(process.cwd(), 'packages', 'tempo')} ${path.join(
      process.cwd(),
      'node_modules',
    )} && go build && tempo`,
    { cwd: `${path.join(process.cwd(), 'node_modules', 'tempo')}` },
    (error, stdout, stderr) => {
      if (error) {
        console.error(`error: ${error.message}`)
        return
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`)
        return
      }
      console.log(`stdout: ${stdout}`)
    },
  )
})
