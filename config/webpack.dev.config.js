const merge = require('webpack-merge');
const base = require('./webpack.base.config.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

/*
  plugins: [
    new BundleAnalyzerPlugin()
  ]
*/

module.exports = merge(base, {
  mode: 'development'
});