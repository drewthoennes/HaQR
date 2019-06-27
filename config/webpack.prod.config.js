const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./webpack.base.config.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

/*
  new UglifyJsPlugin({
    cache: true,
    parallel: true
  })
*/

module.exports = merge(base, {
  mode: 'production',
  optimization: {
    minimizer: [
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
});