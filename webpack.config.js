var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './index.js',
  output: { path:  path.resolve(__dirname, 'examples/assets/js'), filename: 'react-dom-inspector.js' },
  module: {
    loaders: [
      {
        test: /\.less$/,
        loaders: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.(png|jpg|woff|woff2|eot|ttf|otf)$/,
        loaders: ['file-loader']
      },
      {
        test: /\.(svg)$/,
        loaders: ['svg-loader']
      },
      {
        test: /.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          plugins: [
            'transform-runtime',
            'transform-class-properties',
            'transform-es3-member-expression-literals',
            'transform-es3-property-literals',
            'syntax-class-properties'
          ],
          presets: ['es2015', 'react']
        }
      }
    ]
  },
};

