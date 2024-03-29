// @ts-check

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isPrd = process.env.NODE_ENV === 'production';

/** @type { import('rollup').RollupOptions[] } */
export default ['background', 'contentScript'].map(name => ({
  input: path.join(__dirname, `src/${name}/index.ts`),
  external: [],
  plugins: [
    json({
      namedExports: false
    }),
    ts({
      check: true,
      tsconfig: path.resolve(__dirname, 'tsconfig.json'),
      cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache'),
      tsconfigOverride: {
        compilerOptions: {
          sourceMap: !!process.env.SOURCE_MAP,
          declaration: false,
          declarationMap: false
        },
        exclude: ['src/test.ts']
      }
    }),
    commonjs({
      sourceMap: false,
    }),
    nodeResolve({}),
    ...(isPrd ? [
      terser({
        module: false,
        compress: {
          ecma: 2015,
          pure_getters: true
        },
        safari10: true
      })
    ] : [])
  ],
  output: {
    file: path.join(__dirname, `build/${name}.js`),
    format: `iife`,
  },
  onwarn: (warning, defaultHandler) => {
    // if (!/Circular/.test(msg)) {
    //   warn(msg)
    // }
  },
  treeshake: {
    moduleSideEffects: false
  }
}))
