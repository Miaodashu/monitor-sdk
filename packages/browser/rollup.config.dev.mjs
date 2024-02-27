import path from 'path';
import { common, iifePackage } from '../../rollup.base.config.mjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import rimraf from 'rimraf';
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const corePath = path.join(__dirname, '../core');
// rimraf(path.join(corePath, 'esm'), () => undefined);

const utilsPath = path.join(__dirname, '../utils');
// rimraf(path.join(utilsPath, 'esm'), () => undefined);

const typePath = path.join(__dirname, '../types');
// rimraf(path.join(typePath, 'esm'), () => undefined);


iifePackage.plugins = [
  ...common.plugins,
  alias({
    entries: [
      {
        find: '@monitor-sdk/core',
        replacement: path.join(corePath, 'src')
      },
      {
        find: '@monitor-sdk/utils',
        replacement: path.join(utilsPath, 'src')
      },
      {
        find: '@monitor-sdk/types',
        replacement: path.join(typePath, 'src')
      }
    ],
    customResolver: nodeResolve({ extensions: ['.tsx', '.ts'] })
  })
];

const footer = `if (window.__MONITOR_OPTIONS__ && MONITOR_BROWSER) {MONITOR_BROWSER(window.__MONITOR_OPTIONS__);}`;

export default [
  {
    ...iifePackage,
    output: {
      ...iifePackage.output,
      sourcemap: true,
      footer
    }
  }
];