const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');
const config = require('./index.js')();

function resolve(dir) {
  return path.join(__dirname, '../', dir);
}

module.exports = {
  entry: './src/frontend/index.js',
  output: {
    filename: 'main.js',
    path: resolve('dist'),
    publicPath: '/public/'
  },
  resolve: {
    extensions: ['.js', '.json', '.scss'],
    alias: {
        '@': resolve('src/frontend'),
        '@theme': resolve('src/frontend/assets/scss/_theme.scss')
    }
  },
  devtool: 'source-map',
  module: {
    rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test:/\.(s*)css$/,
          use:['style-loader','css-loader', 'sass-loader']
        },
        {
          test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
          loader: 'url-loader?limit=100000'
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
