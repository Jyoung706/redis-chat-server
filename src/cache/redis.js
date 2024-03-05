const redis = require('redis');

const url = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

const redisClient = redis.createClient({
  url,
  password: process.env.REDIS_PASSWORD,
});

module.exports = redisClient;
