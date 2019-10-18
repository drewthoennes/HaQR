const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');
const config = require('./index.js')();

require('dotenv').config({path: path.resolve(__dirname, '../.env')});

function resolve(dir) {
  return path.join(__dirname, '../', dir);
}

module.exports = {
  entry: './src/frontend/index.js',
  output: {
    filename: '[contenthash].js',
    path: resolve('dist'),
    publicPath: '/public/'
  },
  devServer: {
    contentBase: resolve('dist'),
    compress: true
  },
  resolve: {
    extensions: ['.js', '.json', '.scss'],
    alias: {
        '@f': resolve('src/frontend'),
        '@theme': resolve('src/frontend/assets/scss/_theme.scss')
    }
  },
  devtool: 'source-map',
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: false,
        lodash: {
          test: /[\\/]node_modules[\\/]/,
          minSize: 100,
          reuseExistingChunk: true,
          name: 'vendor',
        },
      }
    }
  },
  module: {
    rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: [
                '@babel/preset-env',
                '@babel/preset-react'
              ],
              plugins: [
                '@babel/plugin-proposal-class-properties'
              ],
              cacheDirectory: true
            }
          }
        },
        {
          test:/\.(s*)css$/,
          use: ['style-loader', 'css-loader', 'sass-loader']
        }
      ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/frontend/index.html',
      title: config.name,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      }
    })
  ]
};
