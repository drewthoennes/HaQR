const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./webpack.base.config.js');
const config = require('./index.js')('production');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(base, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      __host__: `'${config.host}'`,
      __name__: `'${config.name}'`
    })
  ],
  optimization: {
    minimizer: [
      new TerserPlugin()
    ]
  }
});
