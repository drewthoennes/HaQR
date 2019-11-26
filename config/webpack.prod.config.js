const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./webpack.base.config.js');
const config = require('./index.js')('production');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(base, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      __host__: `'${config.host}'`,
      __name__: `'${config.name}'`
    }),
    // new BundleAnalyzerPlugin()
  ],
  optimization: {
    minimizer: [
      new TerserPlugin()
    ]
  }
});
