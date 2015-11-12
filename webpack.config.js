'use strict';

var webpack = require('webpack');
var appPath = __dirname + '/app';
var distPath = __dirname + '/dist';
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: appPath, // for resolving the entry option
  entry: [
    'webpack/hot/dev-server',
    './core/bootstrap.js'
  ],
  output: {
    path: distPath,
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loader: "style!css"
    }, {
      test: /\.js$/,
      loader: 'ng-annotate!jshint',
      exclude: /node_modules|bower_components/
    }, {
      test: /\.(woff|woff2|ttf|eot|svg)(\?]?.*)?$/,
      loader: 'file-loader?name=res/[name].[ext]?[hash]'
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      MODE: {
        production: process.env.NODE_ENV === 'production'
      }
    }),
    new HtmlWebpackPlugin({
      template: appPath + '/index.html'
    })
  ],
  resolve: {
    root: appPath
  }
};
