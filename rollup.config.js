import resolve from '@rollup/plugin-node-resolve';
import scss from 'rollup-plugin-scss';
import typescript from '@rollup/plugin-typescript';

const plugins = [
  resolve(),
  scss(),
  typescript(),
];

export default [{
  input: 'index.ts',
  output: {
    file: 'build/index.js',
    format: 'iife'
  },
  plugins
}, {
  input: 'settings/index.ts',
  output: {
    file: 'build/settings/index.js',
    format: 'iife'
  },
  plugins
}];
