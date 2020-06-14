import path from 'path'
import chokidar from 'chokidar'
import chalk from 'chalk'
import child_process from 'child_process'

chokidar.watch(['./**/*.graphql', '!./__tempo__']).on('change', event => {
  console.log(chalk.blue(`[watcher] Change in ${event}`))

  const dev = process.env.NODE_ENV === 'development'
  // const command = dev
  //   ? 'cross-env cd packages/tempo && go build && ./tempo'
  //   : 'cross-env cd node_modules/tempo/tempo'

  child_process.exec(
    'go build && tempo',
    { cwd: `${path.join(process.cwd(), 'packages', 'tempo')}` },
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
