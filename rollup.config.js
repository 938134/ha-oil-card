import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'src/ha-oil-card.js',
  output: {
    file: 'dist/ha-oil-card.js',
    format: 'es',
  },
  plugins: [
    nodeResolve(),
  ],
};
