import fs from 'fs'
import path from 'path'
// import chalk from 'chalk'
import child_process from 'child_process'


const devEnv = path.join(process.cwd(), '__tempo__', 'package')
const buildDir = path.join(process.cwd(), '__tempo__', 'build')
const exeName = 'tempo'

export function buildBinary() {
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir)
  }
  child_process.execSync(`go build -o ${buildDir}/${exeName}.exe`, { cwd: devEnv }, cb)
}
buildBinary()

export function run() {
  child_process.exec(`${exeName} ${process.cwd()}`, { cwd: buildDir }, cb)
}
run()

/**
 * Callback for errors and stdout
 */
function cb(error, stdout, stderr) {
  if (error) {
    // console.error(chalk.red(`Error: ${error.message}`))
    console.error(`Error: ${error.message}`)
    return
  }

  if (stderr) {
    // console.error(chalk.red(`Error: ${stderr}`))
    console.error(`Error: ${stderr}`)
    return
  }

  // Print stdout
  console.log(stdout)
}
