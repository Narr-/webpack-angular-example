'use strict';

var webpack = require('webpack');
var APP = __dirname + '/app';

module.exports = {
  context: APP,
  entry: [
    'webpack/hot/dev-server',
    './core/bootstrap.ts'
  ],
  output: {
    path: APP,
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loader: "style!css"
    }, {
      test: /\.scss$/,
      loader: 'style!css!sass'
    }, {
      test: /\.js$/,
      loader: 'ng-annotate!babel?presets[]=es2015!jshint',
      exclude: /node_modules|bower_components/
    }, {
      test: /\.html/,
      loader: 'raw'
    }, {
      test: /\.(woff|woff2|ttf|eot|svg)(\?]?.*)?$/,
      loader: 'file-loader?name=res/[name].[ext]?[hash]'
    }, {
      test: /\.json/,
      loader: 'json'
    }, {
      test: /\.ts(x?)$/,
      loader: 'ng-annotate!babel?presets[]=es2015!ts-loader'
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      MODE: {
        production: process.env.NODE_ENV === 'production'
      }
    })
  ],
  resolve: {
    root: APP,
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    // extensions: ['', '.webpack.js', '.web.js', '.tsx', '.js']
  }
};
