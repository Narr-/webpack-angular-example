'use strict';

var env = process.env;
var port = env.PORT || 3000;
var dbHost = 'localhost';
var redisHost = 'localhost';
if (env.DOCKER_ENV) {
  dbHost = 'mongo';
  redisHost = 'redis';
}
var mongo = 'mongodb://' + dbHost + ':27017/todoDb';
var redisPort = 6379;

module.exports = {
  PORT: port,
  DB: mongo,
  REDIS_HOST: redisHost,
  REDIS_PORT: redisPort
};
