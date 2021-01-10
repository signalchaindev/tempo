import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import child_process from 'child_process'

const binDir = path.join(process.cwd(), '__tempo__', '.bin')
const buildDir = path.join(process.cwd(), '__tempo__', 'build')
const devEnv = path.join(process.cwd(), '__tempo__', 'package')
const exeName = 'tempo'

/**
 * Build the Go binary
 */
export function buildBinary() {
  if (!fs.existsSync(binDir)) {
    fs.mkdirSync(binDir)
  }
  child_process.exec(
    `go build -o ${path.join(binDir, exeName)}.exe`,
    { cwd: devEnv },
    cb,
  )
}

/**
 * Run the Go binary to build the resolver map and type def AST
 */
export function run(options) {
  const opts = {
    dirs: options && options.dirs ? options.dirs : [],
  }

  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir)
  }

  child_process.exec(
    `${exeName} ${process.cwd()} ${opts.dirs.join(' ')}`,
    { cwd: binDir },
    cb,
  )
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
  if (stdout.match(/time to build/gi)) {
    console.log(chalk.blue(stdout))
    return
  }
  console.log(stdout)
}
