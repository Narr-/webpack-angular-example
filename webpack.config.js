'use strict';

module.exports = function(option) {
  var cssAsStyle = true;
  var debug = option && option.debug;

  var appPath = __dirname + '/client';
  var distPath = __dirname + '/dist';
  var labelJsonPath = debug ? './client/label/label.json' : './res/json/label.json';

  var webpack = require('webpack');
  var Sprite = require('sprite-webpack-plugin');
  var ExtractTextPlugin = cssAsStyle ? null : require('extract-text-webpack-plugin');
  var HtmlWebpackPlugin = require('html-webpack-plugin');

  var webpackDefineObj = { // this should be JSON.
    WEBPACK_VAR: {
      mode: {
        production: !debug
      },
      labelJsonPath: JSON.stringify(labelJsonPath)
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
      './core/bootstrap.js'
    ],
    output: {
      path: distPath,
      filename: 'bundle.js?[hash]', // js/bundle.js?[hash]
      chunkFilename: '[name].js?[hash]' // js/[name].js?[hash]
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
        loader: ExtractTextPlugin ?
          ExtractTextPlugin.extract('style', ['css' + (debug ? '?sourceMap' : ''), 'sass']) : null,
        loaders: !ExtractTextPlugin ? ['style', 'css' + (debug ? '?sourceMap' : ''), 'sass'] : null
      }, {
        test: /\.scss$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin ? ExtractTextPlugin.extract('style', [
          'css' + (debug ? '?sourceMap' : ''),
          'autoprefixer?browsers=last 2 versions', 'resolve-url', 'sass'
        ]) : null,
        loaders: !ExtractTextPlugin ? ['style', 'css' + (debug ? '?sourceMap' : ''),
          'autoprefixer?browsers=last 2 versions', 'resolve-url', 'sass'
        ] : null
      }, {
        test: /\.html$/,
        loader: 'ngtemplate?module=todomvc&relativeTo=' + appPath + '&prefix=partials!html'
      }, {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'url?limit=10000&name=res/img/[hash].[ext]',
          'image-webpack?bypassOnDebug&optimizationLevel=7' // https://github.com/tcoopman/image-webpack-loader#bypassondebug-all
        ]
      }, {
        test: /\.ico$/,
        loaders: [
          'url?limit=10000&name=res/img/[name].[ext]?[hash]',
          'image-webpack?bypassOnDebug&optimizationLevel=7'
        ]
      }, {
        test: /\.(woff|woff2|ttf|otf|svg|eot)(\?.*?)?$/,
        loader: 'url?limit=10000&name=res/font/[name].[ext]?[hash]'
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
    config.entry.push('webpack/hot/dev-server'); // for Hot Module Replacement
    config.output.publicPath = option.publicPath; // https://webpack.github.io/docs/configuration.html#output-publicpath, for url in Blob CSS
    config.plugins.push(new webpack.HotModuleReplacementPlugin()); // for Hot Module Replacement
  } else {
    config.bail = true; // Report the first error as a hard error instead of tolerating it.
    config.plugins.push(new webpack.optimize.DedupePlugin()); // https://github.com/webpack/docs/wiki/optimization#deduplication
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
      // beautify: true,
      // mangle: false
    }));
  }
  if (ExtractTextPlugin) {
    // https://github.com/webpack/extract-text-webpack-plugin#api
    config.plugins.push(new ExtractTextPlugin('bundle.css?[contenthash]', { // css/bundle.css?[contenthash]
      allChunks: true
    }));
  }

  return config;
};
