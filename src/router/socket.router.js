const { UserHandler } = require('../handlers');
const UserList = require('../models/userList.model');
const { UserRepository } = require('../repository');

const userRepository = new UserRepository(UserList);

/**
 * 소켓 연결 및 이벤트 핸들러
 * @param {Socket} socket
 * @param {SocketServer} io
 * @param {Redis} redis
 */
const createConnection = async (socket, io, redis) => {
  const userHandler = new UserHandler(socket, io, redis, userRepository);
  // const userRepository = new UserRepository();

  socket.on('login', userHandler.userConnect);
  socket.on('sendMessage', userHandler.sendMessage);
  socket.on('joinRoom', userHandler.joinRoom);
  socket.on('leaveRoom', userHandler.leaveRoom);
  socket.on('homeEnter', userHandler.homeEnter);
  // socket.on('disconnect', userHandler.changeOffline);
};

module.exports = { createConnection };
