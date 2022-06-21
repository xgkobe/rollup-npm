
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import { eslint } from 'rollup-plugin-eslint';

import pkg from './package.json';

const isDev = process.env.NODE_ENV !== 'production';

export default [
	// browser-friendly UMD build
	{
		input: 'src/main.js',
		output: {
			name: 'timeout',
			file: pkg.browser,
			format: 'umd'
		},
		plugins: [
			resolve(),  // 这样 Rollup 能找到 `ms`
			commonjs(), // 这样 Rollup 能转换 `ms` 为一个ES模块
			eslint({
				throwOnError: true,
				throwOnWarning: true,
				include: ['src/**'],
				exclude: ['node_modules/**']
			}),
			babel({
				exclude: 'node_modules/**',
				// 使plugin-transform-runtime生效
				runtimeHelpers: true,
			}),
			!isDev && terser()
		]
	},
	{
		input: 'src/main.js',
		external: ['ms'],
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		]
	}
];