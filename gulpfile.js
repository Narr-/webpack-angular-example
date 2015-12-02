'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var ip = require('ip');
var webpackConfig = require('./webpack.config.js');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var spawn = require('child_process').spawn; // https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options

////////////////////////
// The development server (the recommended option for development)
gulp.task('webpack-dev-server', function(done) {
  del.sync('./client/res/img/icon/sprite-*');

  var onlyThisHost = false; // https://nodejs.org/api/net.html#net_server_listen_port_hostname_backlog_callback
  var myIp = ip.address(); // my ip address
  var host = !onlyThisHost ? myIp : 'localhost';
  var port = 8080;
  var publicPath = 'http://' + host + ':' + port + '/';
  var devConfig = Object.create(webpackConfig({
    debug: true,
    publicPath: publicPath
  }));

  // Start a webpack-dev-server
  new WebpackDevServer(webpack(devConfig), {
    hot: true, // for Hot Module Replacement
    stats: {
      colors: true
    }
  }).listen(port, !onlyThisHost ? null : host, function(err) {
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
  gulp.src('client/label/label.json').pipe(gulp.dest('dist/res/json'));

  var myIp = ip.address();
  var config = Object.create(webpackConfig({
    publicPath: 'http://' + myIp + ':' + (process.env.PORT || 3000) + '/'
  }));
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

////////////////////////
// Start Server
gulp.task('server', function(done) {
  spawn('node', ['./server/server'], {
    stdio: 'inherit'
  });
});
