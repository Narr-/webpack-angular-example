'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var ip = require('ip');
var webpackConfig = require('./webpack.config.js');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var spawn = require('child_process').spawn; // https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options
// var fs = require('fs'); // to write a log file(fs.writeFile('filename.txt', 'contents', cb);)

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
// Client Unit test
gulp.task('unit-client', function(done) {
  var karma = spawn('node', ['node_modules/karma/bin/karma', 'start', 'test/client/karma.conf.js'], {
    stdio: 'inherit'
  });

  karma.on('close', function(code) {
    done(code);
  });
});

////////////////////////
// Server Unit test
gulp.task('lint-server', function() {
  var jshint = require('gulp-jshint');
  var jscs = require('gulp-jscs');

  return gulp.src('server/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'));
});

gulp.task('unit-server', ['lint-server'], function() {
  del.sync('./test/server/coverage');

  var mocha = require('gulp-spawn-mocha');
  return gulp.src(['server/**/*.spec.js'])
    .pipe(mocha({
      istanbul: {
        dir: 'test/server/coverage',
        x: '*.spec.js', // exculde pattern // "istanbul help cover" on terminal
        report: ['html'],
        print: 'none'
      }
    }));
});

gulp.task('unit', ['unit-client', 'unit-server']);

////////////////////////
// Production build
gulp.task('webpack:build', ['unit'], function(done) {
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
  spawn('node', ['server/server'], {
    stdio: 'inherit'
  });
});

////////////////////////
// e2e
var gp = require('gulp-protractor');

// Download and update the selenium driver
gulp.task('webdriver_update', gp.webdriver_update);

gulp.task('e2e', ['webdriver_update'], function(done) {
  var protractor = gp.protractor;

  gulp.src([])
    .pipe(protractor({
      configFile: 'test/e2e/protractor.conf.js'
    }))
    .on('error', function(e) {
      throw e;
    });
});

gulp.task('e2e:firefox', ['webdriver_update'], function(done) {
  var protractor = gp.protractor;

  gulp.src([])
    .pipe(protractor({
      configFile: 'test/e2e/protractor.conf.firefox.js'
    }))
    .on('error', function(e) {
      throw e;
    });
});
