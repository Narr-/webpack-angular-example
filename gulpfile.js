'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var ip = require('ip');
var webpackConfig = require('./webpack.config.js');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var spawn = require('child_process').spawn; // https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
var runSequence = require('run-sequence');
// var fs = require('fs'); // to write a log file(fs.writeFile('filename.txt', 'contents', cb);)

////////////////////////
// The development server (the recommended option for development)
gulp.task('webpack-dev-server', function() {
  del.sync('./client/res/img/icon/sprite-*');

  // https://nodejs.org/api/net.html#net_server_listen_port_hostname_backlog_callback
  // if true, can't access by current ip but localhost
  var onlyThisHost = false;
  var myIp = ip.address(); // localhost
  var port = 8080;
  var publicPath = 'http://' + myIp + ':' + port + '/';
  var devConfig = Object.create(webpackConfig({
    debug: true,
    publicPath: publicPath
  }));
  // var proxyAddr = '192.168.99.100:8000'; // server IP and PORT
  var proxyAddr = 'localhost:3000';

  // Start a webpack-dev-server
  new WebpackDevServer(webpack(devConfig), {
    hot: true, // for Hot Module Replacement
    stats: {
      colors: true
    },
    proxy: {
      '/api*': {
        target: 'http://' + proxyAddr
      }
      // '/socket.io*': { // "webpack-dev-server": "^1.14.0" can't proxy ws yet
      //   target: 'ws://' + proxyAddr,
      //   ws: true,
      // }
    }
  }).listen(port, !onlyThisHost ? null : 'localhost', function(err) {
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
gulp.task('build', function(cb) {
  del.sync('./client/res/img/icon/sprite-*');
  del.sync('./dist');
  gulp.src('./client/label/label.json').pipe(gulp.dest('./dist/res/json'));

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
    cb();
  });
});

////////////////////////
// Lint sever and unit test files
gulp.task('lint-unit', function() {
  return gulp.src(['./server/**/*.js', './test/{client,server}/**/*.js', '!./test/**/coverage/**/*'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'));
});

////////////////////////
// Client Unit test
gulp.task('unit-client', function(cb) {
  var karma = spawn('node', ['./node_modules/karma/bin/karma', 'start', './test/client/karma.conf.js'], {
    stdio: 'inherit'
  });

  karma.on('close', function(code) {
    cb(code);
  });
});

////////////////////////
// Server Unit test
gulp.task('unit-server', function() {
  del.sync('./test/server/coverage');

  var mocha = require('gulp-spawn-mocha');
  return gulp.src(['./server/**/*.spec.js'])
    .pipe(mocha({
      istanbul: {
        dir: './test/server/coverage',
        x: '*.spec.js', // exculde pattern // "istanbul help cover" on terminal
        report: ['html'],
        print: 'none'
      }
    }));
});

gulp.task('unit', ['lint-unit', 'unit-client', 'unit-server']);

gulp.task('bu', function(cb) {
  runSequence('build', ['unit'], cb);
});

////////////////////////
// Start Server
gulp.task('server', function(cb) {
  spawn('node', ['./server/server'], {
    stdio: 'inherit'
  });
});

////////////////////////
// e2e
gulp.task('lint-e2e', function() {
  return gulp.src(['./test/e2e/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'));
});

var gp = require('gulp-protractor');

// Download and update the selenium driver
gulp.task('webdriver_update', gp.webdriver_update);

gulp.task('e2e', ['lint-e2e', 'webdriver_update'], function(cb) {
  var protractor = gp.protractor;

  gulp.src([])
    .pipe(protractor({
      configFile: './test/e2e/protractor.conf.js'
    }))
    .on('error', function(e) {
      throw e;
    });
});

gulp.task('e2e:firefox', ['lint-e2e', 'webdriver_update'], function(cb) {
  var protractor = gp.protractor;

  gulp.src([])
    .pipe(protractor({
      configFile: './test/e2e/protractor.conf.firefox.js'
    }))
    .on('error', function(e) {
      throw e;
    });
});
