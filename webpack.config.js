'use strict';

module.exports = function(option) {
  var debug = option && option.debug;

  var appPath = __dirname + '/client';
  var distPath = __dirname + '/dist';

  var webpack = require('webpack');
  var Sprite = require('sprite-webpack-plugin');
  // var ExtractTextPlugin = require('extract-text-webpack-plugin');
  var HtmlWebpackPlugin = require('html-webpack-plugin');

  var webpackDefineObj = {
    MODE: {
      production: !debug
    }
  };
  var htmlWebpackPluginCfg = {
    minify: debug ? '' : {
      minifyCSS: true,
      minifyJS: true,
      removeComments: true,
      collapseWhitespace: true
    },
    template: appPath + '/index.tmpl' // to avoid conflict with ngtemplate loader, change extension of the index to tmpl
  };

  var config = {
    customObj: {
      appPath: appPath
    },
    context: appPath, // for resolving the entry option
    entry: [
      './core/bootstrap.js' // TODO multiple entry points
    ],
    output: {
      path: distPath,
      filename: 'bundle.js?[hash]'
    },
    module: {
      preLoaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'jscs!jshint'
      }],
      loaders: [{
        test: /\.scss$/,
        include: /node_modules/,
        // loader: ExtractTextPlugin.extract('style', ['css' + (debug ? '?sourceMap' : ''), 'sass'])
        loaders: ['style', 'css' + (debug ? '?sourceMap' : ''), 'sass']
      }, {
        test: /\.scss$/,
        exclude: /node_modules/,
        // loader: ExtractTextPlugin.extract('style', ['css' + (debug ? '?sourceMap' : ''), 'autoprefixer?browsers=last 2 versions', 'resolve-url', 'sass'])
        loaders: ['style', 'css' + (debug ? '?sourceMap' : ''), 'autoprefixer?browsers=last 2 versions', 'resolve-url', 'sass']
      }, {
        test: /\.html$/,
        loader: 'ngtemplate?module=todomvc&relativeTo=' + appPath + '&prefix=partials!html'
      }, {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'url?limit=10000&name=img/[hash].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7' // https://github.com/tcoopman/image-webpack-loader#bypassondebug-all
        ]
      }, {
        test: /\.(woff|woff2|ttf|otf|svg|eot)(\?.*?)?$/,
        loader: 'url?limit=10000&name=font/[name].[ext]?[hash]'
      }, {
        test: /\.js$/,
        loader: 'ng-annotate',
        exclude: /node_modules/
      }]
    },
    sassLoader: {
      sourceMap: true // https://github.com/sass/node-sass#options, this should be true to use resolve-url-loader
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
      new webpack.DefinePlugin(webpackDefineObj),
      new Sprite({
        'source': appPath + '/res/img/icon/',
        'imgPath': appPath + '/res/img/icon/',
        'cssPath': appPath + '/res/img/icon/',
        'processor': 'scss',
        'multiFolders': true,
        'prefix': 'sprite-icon'
      }),
      // new ExtractTextPlugin('[name].css?[contenthash]'),
      new HtmlWebpackPlugin(htmlWebpackPluginCfg)
    ],
    resolve: {
      root: appPath // for require
    }
  };

  if (debug) {
    config.devtool = 'source-map';
    config.debug = true; // Switch loaders to debug mode.
    config.entry.unshift('webpack-dev-server/client?' + option.publicPath); // for Inline mode
    config.output.publicPath = option.publicPath; // https://webpack.github.io/docs/configuration.html#output-publicpath, for url in Blob CSS
  } else {
    config.bail = true; // Report the first error as a hard error instead of tolerating it.
    config.plugins.push(new webpack.optimize.DedupePlugin()); // https://github.com/webpack/docs/wiki/optimization#deduplication
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
      // beautify: true,
      // mangle: false
    }));
  }

  return config;
};
