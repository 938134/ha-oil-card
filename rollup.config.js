import babel from '@rollup/plugin-babel';

export default {
  input: 'src/oil-card.js',
  output: {
    file: 'dist/oil-card.js',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    babel({
      babelHelpers: 'bundled',
      plugins: ['@babel/plugin-proposal-decorators']
    }),
  ],
};
