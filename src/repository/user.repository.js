const mongoose = require('mongoose');

/**
 * @typedef {import('../models/userList.model')} UserList
 */

class UserRepository {
  /**
   * @param {UserList} userList
   */
  constructor(userList) {
    this.userList = userList;
  }
  async findAll(account) {
    try {
      return await this.userList.find({ account: { $ne: account } });
    } catch (e) {
      console.error(e);
    }
  }

  async findUserByAccount(account) {
    try {
      return await this.userList.findOne({ account });
    } catch (e) {
      console.error(e);
    }
  }

  async findUserBySocketId(socketId) {
    try {
      return await this.userList.findOne({ socketId });
    } catch (e) {
      console.error(e);
    }
  }

  async create(user) {
    try {
      return await this.userList.create(user);
    } catch (e) {
      console.error(e);
    }
  }

  async updateUserSocketId(user) {
    try {
      return await this.userList.findOneAndUpdate(
        { account: user.account },
        { socketId: user.socketId },
        { new: true }
      );
    } catch (e) {
      console.error(e);
    }
  }

  async updateUserOfflineById(objectId) {
    try {
      return await this.userList.findOneAndUpdate(
        { _id: objectId },
        { online: false },
        { new: true }
      );
    } catch (e) {
      console.error(e);
    }
  }

  updateUserChatRoom(form) {
    try {
      const roomId = new mongoose.Types.ObjectId();
      const chatRoomForSender = {
        roomId,
        roomName: `${form.receiver.account}와의 대화방`,
        message: [],
        participant: [
          { id: form.sender.id, account: form.sender.account },
          { id: form.receiver.id, account: form.receiver.account },
        ],
      };

      const chatRoomForReciever = {
        roomId,
        roomName: `${form.sender.account}와의 대화방`,
        message: [],
        participant: [
          { id: form.sender.id, account: form.sender.account },
          { id: form.receiver.id, account: form.receiver.account },
        ],
      };

      const updateUserSender = this.userList.findOneAndUpdate(
        { _id: form.sender.id },
        { $push: { chatRoom: chatRoomForSender } },
        { new: true, runValidators: true }
      );

      const updateUserReciever = this.userList.findOneAndUpdate(
        { _id: form.receiver.id },
        { $push: { chatRoom: chatRoomForReciever } },
        { runValidators: true }
      );

      return Promise.all([updateUserSender, updateUserReciever]).then(
        (values) => {
          return values.filter((el) => el.account === form.sender.account);
        }
      );
    } catch (e) {
      console.error(e);
    }
  }

  async checkChatRoomExist(form) {
    return await this.userList.find({
      account: form.sender.account,
      $and: [
        { 'chatRoom.participant.id': { $eq: form.sender.id } },
        { 'chatRoom.participant.id': { $eq: form.receiver.id } },
      ],
    });
  }

  async findByUserId(userId) {
    return await this.userList.findById(userId);
  }
}

module.exports = UserRepository;
