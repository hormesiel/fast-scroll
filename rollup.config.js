import resolve from '@rollup/plugin-node-resolve';
import scss from 'rollup-plugin-scss';

export default {
  input: 'settings/index.js',
  output: {
    file: 'build/settings/index.js',
    format: 'iife'
  },
  plugins: [
    resolve(),
    scss(),
  ]
};
