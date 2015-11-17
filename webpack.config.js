'use strict';

var webpack = require('webpack');
var appPath = __dirname + '/app';
var distPath = __dirname + '/dist';
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: appPath, // for resolving the entry option
  entry: [
    // 'webpack-dev-server/client?http://localhost:8080', // for Inline mode
    './core/bootstrap.js'
  ],
  output: {
    path: distPath,
    filename: 'bundle.js'
  },
  module: {
    preLoaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'jscs!jshint'
    }],
    loaders: [{
      test: /\.css$/,
      loader: 'style!css'
    }, {
      test: /\.html$/,
      loader: 'ngtemplate?module=todomvc&relativeTo=' + appPath + '&prefix=partials!html'
    }, { // TODO
      test: /\.(woff|woff2|ttf|eot|svg)(\?.*?)?$/,
      loader: 'file-loader?name=res/[name].[ext]?[hash]'
    }, {
      test: /\.js$/,
      loader: 'ng-annotate',
      exclude: /node_modules/
    }]
  },
  // more options in the optional jshint object
  jshint: {
    // errors are displayed by default as warnings
    // set emitErrors to true to display them as errors
    emitErrors: true,
    // to not interrupt the compilation
    // if you want any file with jshint errors to fail
    // set failOnHint to true
    failOnHint: true
  },
  jscs: {
    emitErrors: true,
    failOnHint: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: appPath + '/index.tmpl' // to avoid conflict with ngtemplate loader, change extension of the index to tmpl
    })
  ],
  resolve: {
    root: appPath // for require
  }
};
