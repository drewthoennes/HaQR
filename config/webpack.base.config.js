const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const config = require('./index.js')();

require('dotenv').config({path: path.resolve(__dirname, '../.env')});

function resolve(dir) {
  return path.join(__dirname, '../', dir);
}

module.exports = {
  entry: {
    app: './src/frontend/index.js'
  },
  output: {
    filename: '[name].bundle.[hash].js',
    chunkFilename: '[name].bundle.[hash].js',
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
        '@theme': resolve('src/frontend/assets/_theme.scss'),
        'jquery': 'jquery/dist/jquery.slim.js'
    }
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        // react: {
        //   name: 'react',
        //   chunks: 'all',
        //   test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
        //   priority: 30
        // },
        // bootstrap: {
        //   name: 'bootstrap',
        //   chunks: 'all',
        //   test: /[\\/]node_modules[\\/]bootstrap[\\/]/,
        //   priority: 20
        // },
        vendor: {
          name: 'vendor',
          chunks: 'initial',
          test: /[\\/]node_modules[\\/]/,
          enforce: true
        }
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
    }),
    new webpack.ProvidePlugin({
      $: 'jquery/dist/jquery.slim.js',
      jQuery: 'jquery/dist/jquery.slim.js',
      Button: 'exports-loader?Button!bootstrap/js/dist/button',
      Modal: 'exports-loader?Modal!bootstrap/js/dist/modal'
    })
  ]
};
