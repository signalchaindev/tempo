import path from 'path'
import { run } from '../builder.js'
import { rimraf } from '../../utils/rimraf.js'

const buildDir = path.join(process.cwd(), '__tempo__', 'build')

rimraf(buildDir)
run()
