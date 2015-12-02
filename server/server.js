'use strict';

var express = require('express');
var compression = require('compression');
var path = require('path');
var root = path.join(__dirname, '../dist');
var indexPath = path.join(root, 'index.html');
var app = express();

app.use(compression());
app.use(express.static(root));
app.get('/api', function(req, res) {
  res.status(404).end();
});
app.get('*', function(req, res) {
  res.sendFile(indexPath);
});

var port = process.env.PORT || 3000;
var ip = require('ip');
var currentIp = ip.address();
var winston = require('winston');

winston.level = 'debug';
winston.add(winston.transports.File, {
  filename: path.join(__dirname, 'server.log')
});

app
  .listen(port, function() {
    winston.debug('Our app is running on http://' + currentIp + ':' + port);
  })
  .on('error', function(err) {
    if (err.code === 'EADDRINUSE') {
      winston.debug('The port is already in use..!!');
    }
  });

module.exports = app;
