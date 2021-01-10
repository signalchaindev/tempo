import fs from 'fs'
import path from 'path'
import os from 'os'
import child_process from 'child_process'
import chalk from 'chalk'

const binDir = path.join(process.cwd(), '__tempo__', '.bin')
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

  if (process.env.NODE_ENV === 'production') {
    // TODO: Test that binaries are being built for all supported operating systems
    // https://www.digitalocean.com/community/tutorials/how-to-build-go-executables-for-multiple-platforms-on-ubuntu-16-04#step-4-%E2%80%94-building-executables-for-different-architectures

    // Windows - win32
    child_process.exec(
      `env GOOS=windows GOARCH=386 go build -o ${binDir}/win32/${exeName}.exe`,
      { cwd: devEnv },
      cb,
    )
    // Windows - win64
    child_process.exec(
      `env GOOS=windows GOARCH=amd64 go build -o ${binDir}/win64/${exeName}.exe`,
      { cwd: devEnv },
      cb,
    )
    // Mac - darwin
    child_process.exec(
      `env GOOS=darwin GOARCH=amd64 go build -o ${binDir}/darwin/${exeName}`,
      { cwd: devEnv },
      cb,
    )
  }
}

/**
 * Run the Go binary to build the resolver map and type def AST
 */
export function run(options) {
  const opts = {
    dirs: options && options.dirs ? options.dirs : [],
  }

  if (process.env.NODE_ENV === 'production') {
    child_process.exec(
      `${exeName} ${process.cwd()}  ${opts.dirs.join(' ')}`,
      { cwd: `${binDir}/${os.platform()}` },
      cb,
    )
    return
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
