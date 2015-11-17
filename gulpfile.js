'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config.js');

////////////////////////
// The development server (the recommended option for development)
gulp.task('webpack-dev-server', function(done) {
  var port = 8080;
  // Modify some webpack config options
  var devConfig = Object.create(webpackConfig);
  devConfig.entry.unshift('webpack-dev-server/client?http://localhost:' + port); // for Inline mode
  devConfig.plugins = devConfig.plugins.concat(
    new webpack.DefinePlugin({
      MODE: {}
    })
  );
  devConfig.devtool = 'source-map';
  devConfig.debug = true; // Switch loaders to debug mode.

  // Start a webpack-dev-server
  new WebpackDevServer(webpack(devConfig), {
    stats: {
      colors: true
    }
  }).listen(port, 'localhost', function(err) {
    if (err) {
      throw new gutil.PluginError('webpack-dev-server', err);
    }
    gutil.log('[webpack-dev-server:Inline Mode]', 'http://localhost:' + port);
    gutil.log('[webpack-dev-server:Iframe Mode]', 'http://localhost:' + port + '/webpack-dev-server/index.html');
  });
});

gulp.task('default', ['webpack-dev-server']);

////////////////////////
// Production build
gulp.task('webpack:build', function(done) {
  del.sync('dist');

  // modify some webpack config options
  var config = Object.create(webpackConfig);
  config.bail = true; // Report the first error as a hard error instead of tolerating it.
  config.plugins = config.plugins.concat(
    new webpack.optimize.DedupePlugin(), // https://github.com/webpack/docs/wiki/optimization#deduplication
    new webpack.optimize.UglifyJsPlugin({
      // beautify: true,
      // mangle: false
    }),
    new webpack.DefinePlugin({
      MODE: {
        production: true
      }
    })
  );
  // config.devtool = 'source-map';

  // create a single instance of the compiler
  var compiler = webpack(config);
  // run
  compiler.run(function(err, stats) {
    if (err) {
      console.log(err.module.resource); // show the file name where error occured
      if (err.module.errors.length > 0) {
        console.log(err.module.errors[0].error); // show the error detail e.g. jshint or jscs loader
      }
      throw new gutil.PluginError('webpack:build', err);
    }
    gutil.log('[webpack:build]', stats.toString({
      colors: true
    }));
    done();
  });
});

gulp.task('build', ['webpack:build']);
