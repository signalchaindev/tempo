import fs from 'fs'
import path from 'path'
import os from 'os'
import chalk from 'chalk'
import child_process from 'child_process'


const devEnv = path.join(process.cwd(), '__tempo__', 'package')
const buildDir = path.join(process.cwd(), '__tempo__', 'build')
const exeName = 'tempo'

export function buildBinary() {
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir)
  }

  // TODO: Test that binaries are being built for supported operating systems
  // https://www.digitalocean.com/community/tutorials/how-to-build-go-executables-for-multiple-platforms-on-ubuntu-16-04#step-4-%E2%80%94-building-executables-for-different-architectures

  // Windows - win32
  child_process.execSync(`env GOOS=windows GOARCH=386 go build -o ${buildDir}/win32/${exeName}.exe`, { cwd: devEnv }, cb)
  // Windows - win64
  child_process.execSync(`env GOOS=windows GOARCH=amd64 go build -o ${buildDir}/win64/${exeName}.exe`, { cwd: devEnv }, cb)
  // Mac - darwin
  child_process.execSync(`env GOOS=darwin GOARCH=amd64 go build -o ${buildDir}/darwin/${exeName}`, { cwd: devEnv }, cb)
}
buildBinary()

export function run() {
  child_process.exec(`${exeName} ${process.cwd()}`, { cwd: `${buildDir}/${os.platform()}` }, cb)
}
run()

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
  console.log(stdout)
}
