const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./webpack.base.config.js');
const config = require('./index.js')('development');

module.exports = merge(base, {
  mode: 'development',
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      __host__: `'${config.host}'`,
      __name__: `'${config.name}'`
    })
  ]
});
