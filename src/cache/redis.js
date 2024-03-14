// const { createCluster } = require('redis');
const IoRedis = require('ioredis');
const { createAdapter } = require('@socket.io/redis-adapter');

const {
  REDIS_CLUSTER_HOST_1,
  REDIS_CLUSTER_HOST_2,
  REDIS_CLUSTER_HOST_3,
  REDIS_CLUSTER_PORT,
  REDIS_PASSWORD,
} = process.env;

class Redis {
  constructor(io) {
    this.io = io;
    this.pubClient = null;
    this.subClient = null;
    this.init();
  }

  init() {
    const clusterNodes = [
      {
        host: REDIS_CLUSTER_HOST_1,
        port: REDIS_CLUSTER_PORT,
      },
      {
        host: REDIS_CLUSTER_HOST_2,
        port: REDIS_CLUSTER_PORT,
      },
      {
        host: REDIS_CLUSTER_HOST_3,
        port: REDIS_CLUSTER_PORT,
      },
    ];

    const options = {
      redisOptions: {
        password: REDIS_PASSWORD,
      },
    };

    this.pubClient = new IoRedis.Cluster(clusterNodes, options);
    this.subClient = new IoRedis.Cluster(clusterNodes, options);

    this.io.adapter(createAdapter(this.pubClient, this.subClient));

    this.pubClient
      .on('connect', () => console.log('Redis pubClient connected'))
      .on('error', (err) => console.error('Redis pubClient error : ', err));
    this.subClient
      .on('connect', () => console.log('Redis subClient connected'))
      .on('error', (err) => console.error('Redis subClient error : ', err));
  }
}

module.exports = Redis;
