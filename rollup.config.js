import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/oil-card.js',
  output: {
    file: 'dist/oil-card.js',
    format: 'es',
  },
  plugins: [resolve(), commonjs()],
};
