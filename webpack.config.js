var path = require('path');
var webpack = require('webpack');

console.log(__dirname);
module.exports = {
  entry: './index.js',
  output: { path:  path.resolve(__dirname, 'examples/assets/js'), filename: 'react-dom-inspector.js' },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
};

