const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./webpack.base.config.js');
const config = require('./index.js')('production');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

/*
  new UglifyJsPlugin({
    cache: true,
    parallel: true
  })
*/

module.exports = merge(base, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      __host__: `'${config.host}'`
    })
  ],
  optimization: {
    minimizer: [
    ]
  }
});