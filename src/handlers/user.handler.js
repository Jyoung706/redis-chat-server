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

  userConnect = async (data, cb) => {
    console.log(await this.redis.smembers('room:2:users'));
    cb({ ok: true, message: 'User connected' });
    // this.redis.set('user', JSON.stringify(callback));
  };

  sendMessage = (data, cb) => {
    this.socket.to(data.roomId).emit('message', data);
    cb({ ok: true, message: 'Message sent' });
  };

  joinRoom = async (data, cb) => {
    this.socket.join(data.room);
    this.io.to(data.room).emit('message', {
      type: 'system',
      message: `${data.userId} joined room`,
    });
    console.log('join Room Data : ', data);
    await this.redis.sadd(`room:${data.room}:users`, data.userId);

    cb({ ok: true, message: 'Joined room' });
  };

  leaveRoom = async (data, cb) => {
    this.socket.leave(data.room, async () => {
      this.io.to(data.room).emit('message', {
        type: 'system',
        message: `${data.userId} left room`,
      });
    });

    await this.redis.srem(`room:${data.room}:users`, data.userId);

    cb({ ok: true, type: 'system', message: `${data.userId} left room` });
  };
}

module.exports = UserHandler;
