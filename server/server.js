'use strict';

var logger = require('./util/logger')(module);
var express = require('express');
var app = express();
var config = require('./config');
var redis = require('redis');
var redisClient = redis.createClient(config.REDIS_URL);
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var morgan = require('morgan');
var bodyParser = require('body-parser');
var compression = require('compression');
var path = require('path');
var root = path.join(__dirname, '../dist');
var indexPath = path.join(root, 'index.html');
var server = require('http').createServer(app);
require('./socket')(server); // http://stackoverflow.com/questions/25013735/socket-io-nodejs-doesnt-work-on-heroku

app.enable('trust proxy'); // or req.headers['x-forwarded-for'] || req.connection.remoteAddress
app.use(session({
  store: new RedisStore({
    client: redisClient
  }),
  secret: 'webpack ng',
  resave: false,
  saveUninitialized: false
}));
app.use(morgan('combined', {
  'stream': logger.stream
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  'extended': false
}));
app.use(compression());
app.use(express.static(root));
app.use('/api', require('./route/api'));
app.get('*', function(req, res) {
  res.sendFile(indexPath);
});

server
  .listen(config.PORT, function(err) {
    logger.info('Our app is running on http://localhost:' + config.PORT);
  })
  .on('error', function(err) {
    if (err.code === 'EADDRINUSE') {
      logger.error('The port is already in use..!!');
    }
  });

module.exports = app;
