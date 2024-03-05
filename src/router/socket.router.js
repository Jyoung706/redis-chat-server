const { UserHandler } = require('../handlers');

const createConnection = async (socket, io) => {
  const userHandler = new UserHandler(socket, io);

  socket.on('login', userHandler.userConnect);
  socket.on('sendMessage', userHandler.sendMessage);
};

module.exports = { createConnection };
