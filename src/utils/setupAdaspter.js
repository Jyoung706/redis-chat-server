const { createClient } = require('redis');
const { createAdapter } = require('@socket.io/redis-adapter');

const setupRedisAdapter = (io) => {
  const url = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
  const pubClient = createClient({
    url,
    password: process.env.REDIS_PASSWORD,
  });
  const subClient = pubClient.duplicate();

  Promise.all([pubClient.connect(), subClient.connect()])
    .then(() => {
      console.log('Redis client connected');
      io.adapter(createAdapter(pubClient, subClient));
    })
    .catch((err) => {
      console.error('Redis client connection error : ', err);
    });
};

module.exports = { setupRedisAdapter };
