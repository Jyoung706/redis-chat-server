const express = require('express');
const { createServer } = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { createConnection } = require('./router/socket.router');
const { createClient } = require('redis');
const { createAdapter } = require('@socket.io/redis-adapter');

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

const url = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

const pubClient = createClient({
  url,
  password: process.env.REDIS_PASSWORD,
});
const subClient = pubClient.duplicate();

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  console.log('Redis client connected');
  io.adapter(createAdapter(pubClient, subClient));
});

io.on('connection', (socket) => {
  createConnection(socket, io);
});

app.use(cors({ origin: FRONT_URL.split(','), credentials: true }));

module.exports = { server, io };
