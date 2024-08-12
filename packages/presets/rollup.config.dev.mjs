import path from 'path';
import { common, iifePackage } from '../../rollup.base.config.mjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import rimraf from 'rimraf';
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const utilsPath = path.join(__dirname, '../utils');
// rimraf(path.join(utilsPath, 'esm'), () => undefined);

const typePath = path.join(__dirname, '../types');
// rimraf(path.join(typePath, 'esm'), () => undefined);

iifePackage.plugins = [
  ...common.plugins,
  alias({
    entries: [
      {
        find: '@tc-track/utils',
        replacement: path.join(utilsPath, 'src')
      },
      {
        find: '@tc-track/types',
        replacement: path.join(typePath, 'src')
      },
      {
        find: '@tc-track/xhr',
        replacement: path.join(__dirname, '../xhr/src')
      },
      {
        find: '@tc-track/fetch',
        replacement: path.join(__dirname, '../xhr/src')
      },
      {
        find: '@tc-track/router-history',
        replacement: path.join(__dirname, '../router_history/src')
      },
      {
        find: '@tc-track/router-hash',
        replacement: path.join(__dirname, '../router_hash/src')
      },
      {
        find: '@tc-track/performance',
        replacement: path.join(__dirname, '../performance/src')
      },
      {
        find: '@tc-track/vue',
        replacement: path.join(__dirname, '../vue/src')
      },
      {
        find: '@tc-track/dom',
        replacement: path.join(__dirname, '../dom/src')
      }
    ],
    customResolver: nodeResolve({ extensions: ['.tsx', '.ts'] })
  })
];

// 本地调试开启sourcemap
iifePackage.output = {
  ...iifePackage.output,
  sourcemap: true
};

export default [iifePackage];
