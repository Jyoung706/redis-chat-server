const { createClient } = require('redis');
const { createAdapter } = require('@socket.io/redis-adapter');

class Redis {
  constructor(io) {
    this.io = io;
    this.pubClient = null;
    this.subClient = null;
  }

  setupRedisAdapter() {
    const url = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
    this.pubClient = createClient({
      url,
      password: process.env.REDIS_PASSWORD,
    });
    this.subClient = this.pubClient.duplicate();

    Promise.all([this.pubClient.connect(), this.subClient.connect()])
      .then(() => {
        console.log('Redis client connected');
        this.io.adapter(createAdapter(this.pubClient, this.subClient));
      })
      .catch((err) => {
        console.error('Redis client connection error : ', err);
      });
  }
}

module.exports = Redis;
