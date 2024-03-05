class UserHandler {
  constructor(socket, io) {
    this.socket = socket;
    this.io = io;
  }

  userConnect = async (callback) => {
    console.log(callback);
  };

  sendMessage = async (data, cb) => {
    this.socket.broadcast.emit('message', data);
    cb({ ok: true, message: 'Message sent' });
  };
}

module.exports = UserHandler;
