'use strict';

module.exports = function(config) {
  var del = require('del');
  var path = require('path');
  var coveragePath = path.join(__dirname, 'coverage');
  del.sync(coveragePath);
  var srcBasePath = path.join(__dirname, '../../client');
  var webpack = require('webpack');

  config.set({
    basePath: '',
    browsers: ['PhantomJS'],
    exclude: [],
    files: [
      'test.webpack.js'
    ],
    frameworks: ['jasmine'],
    plugins: [
      'karma-webpack',
      'karma-sourcemap-loader',
      'karma-jasmine',
      'karma-phantomjs-launcher',
      'karma-spec-reporter',
      'karma-coverage'
    ],
    preprocessors: {
      'test.webpack.js': ['webpack', 'sourcemap']
    },
    reporters: ['spec', 'coverage'],
    singleRun: true,

    coverageReporter: {
      type: 'html',
      dir: coveragePath
    },
    webpack: {
      devtool: 'inline-source-map',
      module: {
        preLoaders: [{
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'jscs!jshint'
        }],
        loaders: [{
          test: /\.scss$/,
          loader: 'null'
        }, {
          test: /\.html$/,
          loader: 'ngtemplate?module=todomvc&relativeTo=' + srcBasePath + '&prefix=partials!html'
        }, {
          test: /\.(jpe?g|png|gif|svg)$/i,
          loader: 'null'
        }, {
          test: /\.js$/,
          loader: 'ng-annotate!babel?presets[]=es2015',
          exclude: /node_modules/
        }],
        postLoaders: [{
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'istanbul-instrumenter'
        }]
      },
      jshint: {
        emitErrors: true,
        failOnHint: true
      },
      jscs: {
        emitErrors: true,
        failOnHint: true
      },
      plugins: [
        new webpack.DefinePlugin({
          WEBPACK_VAR: {
            mode: {
              production: false
            },
            labelJsonPath: JSON.stringify('./client/label/label.json')
          }
        })
      ],
      resolve: {
        root: srcBasePath
      }
    }
  });
};
