import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import polyfills from 'rollup-plugin-node-polyfills'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'
import child_process from 'child_process'
import kill from 'tree-kill'
import pkg from './package.json'
import { run } from './__tempo__/builder.js'

const production = !process.env.ROLLUP_WATCH

let server

function serve() {
  function toExit() {
    kill(server.pid, 'SIGKILL', (err) => {
      if (err) {
        console.log('err:', err)
      }
    })
  }

  return {
    writeBundle() {
      if (server) {
        toExit()
      }

      server = child_process.spawn('node', ['-r esm', 'dist/bundle.js'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true
      })

      process.on('SIGTERM', toExit)
      process.on('exit', toExit)
    }
  }
}

const onwarn = (warning, onwarn) => {
  if (warning.loc.file.match(/depd/gi)) {
    return
  }

  return (
    (warning.code === 'CIRCULAR_DEPENDENCY' &&
      /[/\\]@sapper[/\\]/.test(warning.message)) ||
    onwarn(warning)
  )
}

export default {
  input: 'src/server.js',
  output: {
    sourcemap: true,
    format: 'cjs',
    name: 'app',
    file: 'dist/bundle.js',
  },
  plugins: [
    run(),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    polyfills(),
    json(),
    resolve(),
    commonjs(),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser()
  ],
  external: Object.keys(pkg.dependencies).concat(
    require('module').builtinModules || Object.keys(process.binding('natives')),
  ),

  preserveEntrySignatures: 'strict',
  onwarn,
  watch: {
    clearScreen: false,
    exclude: ['node_modules/**', '__tempo__/**/*']
  }
}
