'use strict';

var env = process.env;
var port = env.PORT || 3000;
var redisUrl;
var mongoUri;

if (env.DOCKER_ENV) {
  redisUrl = 'redis://redis:6379';
  mongoUri = 'mongodb://mongo:27017/todoDb';
} else if (env.DYNO) { // HEROKU
  redisUrl = env.REDIS_URL;
  mongoUri = env.MONGOLAB_URI;
} else {
  redisUrl = 'redis://localhost:6379';
  mongoUri = 'mongodb://localhost:27017/todoDb';
}

module.exports = {
  PORT: port,
  REDIS_URL: redisUrl,
  MONGO_URI: mongoUri
};
