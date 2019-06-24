const merge = require('webpack-merge');
const base = require('./webpack.base.config.js');

module.exports = merge(base, {
  mode: 'production'
});