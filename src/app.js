const express = require('express');
const { createServer } = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { createConnection } = require('./router/socket.router');
const { setupRedisAdapter } = require('./utils/setupAdaspter');
const Redis = require('../src/cache/redis');

const { FRONT_URL } = process.env;

const app = express();
const server = createServer(app);

app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: FRONT_URL.split(','),
    methods: 'POST,GET',
    credentials: true,
  },
  transports: ['websocket'],
});

const redis = new Redis(io);

// redis.setupRedisAdapter();

io.on('connection', (socket) => {
  createConnection(socket, io, redis.pubClient);
  console.log(`client socekt id : ${socket.id} `);
});

app.use(cors({ origin: FRONT_URL.split(','), credentials: true }));

module.exports = { server, io };
