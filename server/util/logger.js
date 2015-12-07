'use strict';

var fs = require('fs');
var path = require('path');
var winston = require('winston');

var logDir = path.join(__dirname, '../log');
try {
  fs.accessSync(logDir);
} catch (e) {
  fs.mkdirSync(logDir);
}

module.exports = function(module) {
  var logger = new winston.Logger({
    transports: [
      new winston.transports.Console({
        label: module.filename,
        level: 'debug',
        json: false,
        prettyPrint: true,
        depth: 0,
        handleExceptions: true,
        humanReadableUnhandledException: true,
        colorize: 'all'
      }),
      new winston.transports.File({
        label: module.filename,
        level: 'debug',
        filename: logDir + '/log.txt',
        json: false,
        prettyPrint: true,
        depth: 0,
        handleExceptions: true,
        humanReadableUnhandledException: true,
        maxsize: 5242880, //5MB
        maxFiles: 5
      })
    ],
    exitOnError: false
  });

  logger.level = 'debug';
  logger.stream = {
    write: function(message, encoding) {
      logger.info(message);
    }
  };

  return logger;
};
