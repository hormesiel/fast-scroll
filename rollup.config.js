import resolve from '@rollup/plugin-node-resolve';
import scss from 'rollup-plugin-scss';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'settings/index.ts',
  output: {
    file: 'build/settings/index.js',
    format: 'iife'
  },
  plugins: [
    resolve(),
    scss(),
    typescript(),
  ]
};
