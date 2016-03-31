/**
 * Created by glenn on 29/03/16.
 */

const path    = require('path');
const webpack = require('webpack');

module.exports = {
  devtool  : 'source-map',
  resolve  : {
    root      : [
      path.join(__dirname, 'src'),
    ],
    extensions: ['', '.js'],
  },
  entry    : {
    'jquery.inputsearch': [
      'babel-polyfill',
      './src/jquery.inputsearch.js',
    ],
  },
  output   : {
    path      : path.join(__dirname, 'dist'),
    filename  : '[name].min.js',
    publicPath: '/dist/',
  },
  plugins  : [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),

    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      },
    }),
  ],
  module   : {
    loaders: [
      {
        test   : /\.js$/,
        include: [
          path.join(__dirname, 'src'),
        ],
        loader : 'babel',
        query  : {
          presets: ['es2015', 'stage-2'],
        },
      },
    ],
  },
  devServer: {
    noInfo: true,   // Suppress boring information.
    port  : 3000,
  },
};
