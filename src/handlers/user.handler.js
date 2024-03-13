class UserHandler {
  constructor(socket, io, redis) {
    this.socket = socket;
    this.io = io;
    this.redis = redis;
  }

  updateRoomUsers = async (roomId, user) => {
    const users = await this.redis.smembers(`room:${roomId}:users`);
    const counts = await this.redis.scard(`room:${roomId}:users`);

    this.io.emit('updateRoomUsers', { users, counts });
  };

  userConnect = (callback) => {
    console.log(callback);
    // this.redis.set('user', JSON.stringify(callback));
  };

  sendMessage = (data, cb) => {
    this.socket.broadcast.emit('message', data);
    cb({ ok: true, message: 'Message sent' });
  };

  joinRoom = async (data, cb) => {
    this.socket.join(data.room);

    console.log('join Room Data : ', data);
    this.redis
      .sAdd(`room:${data.room}:users`, data.userId)
      .then(() => {
        console.log('redis sAdd success');
      })
      .catch((err) => {
        console.log('redis sAdd error : ', err);
      });

    cb({ ok: true, message: 'Joined room' });
  };
}

module.exports = UserHandler;
