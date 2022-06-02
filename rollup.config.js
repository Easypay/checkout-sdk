// Rollup plugins
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'umd',
    name: 'easypayCheckout',
    sourcemap: 'bundle',
    globals: ['dialog-polyfill'],
  },
  context: 'window',
  plugins: [
    postcss({ inject: false }),
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    typescript({ tsconfig: './tsconfig.json' }),
    commonjs(),
  ],
}
