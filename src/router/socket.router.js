const { UserHandler } = require('../handlers');
// const { UserRepository } = require('../repository');

const createConnection = async (socket, io, redis) => {
  const userHandler = new UserHandler(socket, io, redis);
  // const userRepository = new UserRepository();

  socket.on('login', userHandler.userConnect);
  socket.on('sendMessage', userHandler.sendMessage);
  socket.on('joinRoom', userHandler.joinRoom);
};

module.exports = { createConnection };
