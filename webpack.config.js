module.exports = [{
  entry: ['./settings/index.scss', './settings/index.mjs'],
  output: {
    path: __dirname + '/build',
    filename: 'settings/index.js'
  },
  module: {
    rules: [{
      test: /\.scss$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: 'settings/index.css',
          },
        },
        { loader: 'extract-loader' },
        { loader: 'css-loader' },
        {
          loader: 'sass-loader',
          options: {
            includePaths: ['./node_modules']
          }
        },
      ]
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015'],
      },
    }]
  },
}];
