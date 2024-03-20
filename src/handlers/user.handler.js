/**
 * @typedef {import('../repository/user.repository')} UserRepository
 */

class UserHandler {
  /**
   *
   * @param {Socket} socket
   * @param {SocketServer} io
   * @param {Redis} redis
   * @param {UserRepository} userRepository
   */
  constructor(socket, io, redis, userRepository) {
    this.socket = socket;
    this.io = io;
    this.redis = redis;
    this.userRepository = userRepository;
  }

  updateRoomUsers = async (roomId, user) => {
    const users = await this.redis.smembers(`room:${roomId}:users`);
    const counts = await this.redis.scard(`room:${roomId}:users`);

    this.io.emit('updateRoomUsers', { users, counts });
  };

  userConnect = async (data, cb) => {
    const userForm = data;

    const isDuplicated = await this.userRepository.findUserByAccount(
      userForm.account
    );

    const friendList = await this.userRepository.findAll(userForm.account);

    if (isDuplicated) {
      await this.userRepository.updateUserSocketId(userForm);
      cb({ ok: true, myInfo: isDuplicated, friendList });
    } else {
      userForm.chatRoom = [];
      const result = await this.userRepository.create(userForm);
      cb({ ok: true, myInfo: result, friendList });
    }

    // this.redis.set('user', JSON.stringify(callback));
  };

  sendMessage = async (data, cb) => {
    // await this.socket.to(data.roomId).emit('message', data);
    console.log(data);

    cb({ ok: true, message: 'Message sent' });
  };

  joinRoom = async (data, cb) => {
    //1:1채팅방 몽고저장

    // 기존에 둘만의 대화방이 있는지 확인하는 로직
    const result = await this.userRepository.checkChatRoomExist(data);
    if (result.length) {
      cb({ ok: true, message: result });
    } else {
      const result = await this.userRepository.updateUserChatRoom(data);
      this.socket.emit('roomInfoChange', result);
      cb({ ok: true, message: result });
    }

    // this.io.to(data.room).emit('message', {
    //   type: 'system',
    //   message: `${data.userId} joined room`,
    // });

    // await this.redis.sadd(`room:${data.room}:users`, data.userId);

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

  changeOffline = async (data, cb) => {
    const user = await this.userRepository.findUserBySocketId(this.socket.id);
    await this.userRepository.updateUserOfflineById(user._id);
  };

  homeEnter = async (data, cb) => {
    const chatRoomList = await this.userRepository.findByUserId(data.userId);
    cb({ ok: true, message: chatRoomList });
  };
}

module.exports = UserHandler;
