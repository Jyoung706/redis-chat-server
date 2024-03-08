const express = require('express');
const { createServer } = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { createConnection } = require('./router/socket.router');
const { setupRedisAdapter } = require('./utils/setupAdaspter');

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

setupRedisAdapter(io);

io.on('connection', (socket) => {
  createConnection(socket, io);
});

app.use(cors({ origin: FRONT_URL.split(','), credentials: true }));

module.exports = { server, io };
