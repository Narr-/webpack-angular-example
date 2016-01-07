'use strict';

var env = process.env;
var port = env.PORT || 3000;
var dockerMachineIp = '192.168.99.100';
var redisUrl;
var mongoUri;

if (env.DOCKER_ENV) {
  redisUrl = 'redis://redis:6379';
  mongoUri = 'mongodb://mongo:27017/todoDb';
} else if (env.DYNO) { // HEROKU
  redisUrl = env.REDIS_URL;
  mongoUri = env.MONGOLAB_URI;
} else {
  redisUrl = 'redis://' + dockerMachineIp + ':6379';
  mongoUri = 'mongodb://' + dockerMachineIp + ':27017/todoDb';
}

module.exports = {
  PORT: port,
  REDIS_URL: redisUrl,
  MONGO_URI: mongoUri
};
