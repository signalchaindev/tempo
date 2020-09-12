import fs from 'fs'
import path from 'path'
import chalk from 'chalk'

export function rimraf(dir_path) {
  if (!dir_path) {
    throw new Error(chalk.red('rimraf requires a directory path'))
  }

  if (fs.existsSync(dir_path)) {
    fs.readdirSync(dir_path).forEach(function (entry) {
      const entry_path = path.join(dir_path, entry)
      if (fs.lstatSync(entry_path).isDirectory()) {
        rimraf(entry_path)
      } else {
        fs.unlinkSync(entry_path)
      }
    })
    fs.rmdirSync(dir_path)
  }
}
