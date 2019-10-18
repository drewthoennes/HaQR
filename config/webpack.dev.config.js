const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./webpack.base.config.js');
const config = require('./index.js')('development');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(base, {
  mode: 'development',
  plugins: [
    new webpack.DefinePlugin({
      __host__: `'${config.host}'`,
      __name__: `'${config.name}'`
    }),
    /*new BundleAnalyzerPlugin()*/
  ]
});
