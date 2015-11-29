'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var webpackConfig = require('./webpack.config.js');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

////////////////////////
// The development server (the recommended option for development)
gulp.task('webpack-dev-server', function(done) {
  del.sync('./client/res/img/icon/sprite-*');

  var host = 'localhost';
  var port = 8080;
  var publicPath = 'http://' + host + ':' + port + '/';
  var devConfig = Object.create(webpackConfig({
    debug: true,
    publicPath: publicPath
  }));

  // Start a webpack-dev-server
  new WebpackDevServer(webpack(devConfig), {
    stats: {
      colors: true
    }
  }).listen(port, host, function(err) {
    if (err) {
      throw new gutil.PluginError('webpack-dev-server', err);
    }
    gutil.log('[webpack-dev-server:Inline Mode]', publicPath);
    gutil.log('[webpack-dev-server:Iframe Mode]', publicPath + 'webpack-dev-server/index.html');
  });
});

gulp.task('default', ['webpack-dev-server']);

////////////////////////
// Production build
gulp.task('webpack:build', function(done) {
  del.sync('client/res/img/icon/sprite-*');
  del.sync('dist');

  var config = Object.create(webpackConfig());
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
