import path from 'path'
import { buildBinary } from './builder.js'
import { rimraf } from './utils/rimraf.js'

const binDir = path.join(process.cwd(), '__tempo__', '.bin')

rimraf(binDir)
buildBinary()
