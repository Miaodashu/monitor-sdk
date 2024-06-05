import path, { dirname } from 'path';
import commonJs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import size from 'rollup-plugin-sizes';
import esbuild from 'rollup-plugin-esbuild';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import { babel } from '@rollup/plugin-babel';
import { fileURLToPath } from 'node:url';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

const currentWorkingDirectory = dirname(fileURLToPath(import.meta.url));
// export default {
//   ...,
//   // 为 <currentdir>/src/some-file.js 生成绝对路径
//   external: [fileURLToPath(new URL('src/some-file.js', import.meta.url))]
// };
const packageDir = process.cwd();
const packageDirDist = `${packageDir}/dist`;
const packageDirESM = `${packageDir}/esm`;

const name = path.basename(packageDir);

// 基础配置
export const common = {
    input: `${packageDir}/src/index.ts`,
    output: {
        name: `MONITOR_${name.toLocaleUpperCase()}`
    },
    plugins: [
        commonJs(),
        esbuild({
            // All options are optional
            include: /\.[jt]sx?$/, // default, inferred from `loaders` option
            exclude: /node_modules/, // default
            sourceMap: true, // default
            minify: process.env.NODE_ENV === 'production',
            target: 'es2015', // default, or 'es20XX', 'esnext'
            jsx: 'transform', // default, or 'preserve'
            jsxFactory: 'React.createElement',
            jsxFragment: 'React.Fragment',
            tsconfig: 'tsconfig.json', // default
            // Add extra loaders
            loaders: {
                // Add .json files support
                // require @rollup/plugin-commonjs
                '.json': 'json',
                // Enable JSX in .js files too
                '.js': 'jsx'
            }
        }),
        resolve({
            preferBuiltins: true
        }),
        babel({
            presets: ['@babel/preset-env'],
            babelHelpers: 'bundled'
        }),
        nodePolyfills(),
        json(),
        size()
    ]
};

// 构建为umd格式的
export const umdPackage = {
    ...common,
    output: {
        format: 'umd',
        file: `${packageDirDist}/${name}.umd.js`,
        ...common.output
    }
};

// 构建为esm格式的
export const esmPackage = {
    ...common,
    output: {
        dir: `${packageDirESM}`,
        format: 'es',
        plugins: []
    },
    plugins: [
        commonJs(),
        resolve({
            preferBuiltins: true
        }),
        babel({
            presets: [
                '@babel/preset-env'
                // [
                //     '@babel/preset-env',
                //     {
                //         targets: {
                //             // esmodules: true // 根据需要调整
                //         }
                //     }
                // ]
            ]
            // plugins: ['@babel/plugin-proposal-private-methods']
            // include: [`${packageDir}/node_modules/minimatch`]
        }),

        typescript({
            tsconfig: `${packageDir}/tsconfig.json`
        })
    ]
};

// {
//     ...common,
//     output: {
//         format: 'es',
//         dir: `${packageDirESM}`,
//         plugins: [
//             // typescript({
//             //     // removeComments: true,
//             //     // // 使用声明生成路径配置
//             //     // useTsconfigDeclarationDir: true
//             // })
//             babel({
//                 babelHelpers: 'bundled'
//             }),
//             // nodePolyfills(),
//             // terser()
//         ]
//     }
// };

// 构建为iife格式的
export const iifePackage = {
    ...common,
    output: {
        format: 'iife',
        file: `${packageDirDist}/${name}.iife.js`,
        ...common.output
    },
    plugins: [
        ...common.plugins,
        // 压缩代码
        terser()
    ]
};
