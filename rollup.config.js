import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import polyfills from 'rollup-plugin-node-polyfills'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'
import child_process from 'child_process'
import kill from 'tree-kill'
import pkg from './package.json'
import tempo from './__tempo__/index.js'

const dev = process.env.ROLLUP_WATCH

function serve() {
  let server

  function toExit() {
    kill(server.pid, 'SIGKILL', err => {
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
        shell: true,
      })

      process.on('SIGTERM', toExit)
      process.on('exit', toExit)
    },
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

const server = {
  input: 'src/server.js',
  output: {
    sourcemap: true,
    format: 'cjs',
    name: 'app',
    file: 'dist/bundle.js',
  },
  plugins: [
    tempo({
      dev,
      dirs: ['src', 'api'],
    }),

    polyfills(),
    json(),
    resolve(),
    commonjs(),

    dev && serve(),
    !dev &&
      terser({
        module: true,
      }),
  ],
  external: Object.keys(pkg.dependencies).concat(
    require('module').builtinModules || Object.keys(process.binding('natives')),
  ),

  preserveEntrySignatures: 'strict',
  onwarn,
  watch: {
    clearScreen: false,
    exclude: ['node_modules/**', '__tempo__/**/*'],
  },
}

export default server
