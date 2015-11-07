'use strict';

var webpack = require('webpack');
var APP = __dirname + '/app';

module.exports = {
  context: APP,
  entry: [
    'webpack/hot/dev-server',
    './core/bootstrap.js'
  ],
  output: {
    path: APP,
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.scss$/,
      loader: 'style!css!sass'
    }, {
      test: /\.js$/,
      loader: 'ng-annotate!babel?presets[]=es2015!jshint',
      exclude: /node_modules|bower_components/
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
