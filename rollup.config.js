import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/oil-card.js',
  output: {
    dir: 'dist', // 使用 `dir` 而不是 `file`
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript(),
  ],
};
