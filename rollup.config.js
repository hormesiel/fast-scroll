import copy from 'rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import scss from 'rollup-plugin-scss';
import typescript from '@rollup/plugin-typescript';

const plugins = [
  copy({
    /* Changes to these files won't be automatically picked in watch mode. To work around this, one will have to save
    a file that *is* watched for the copy to happen again. */
    targets: [
      { src: 'src/settings/index.html', dest: '_build/settings/' }
    ]
  }),
  resolve(),
  scss(),
  typescript(),
];

export default [{
  input: 'src/index.ts',
  output: {
    file: '_build/index.js',
    format: 'iife'
  },
  plugins
}, {
  input: 'src/settings/index.ts',
  output: {
    file: '_build/settings/index.js',
    format: 'iife'
  },
  plugins
}];
