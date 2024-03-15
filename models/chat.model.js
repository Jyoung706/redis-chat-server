const { Schema, model } = require('mongoose');

const chatRoomSchema = new Schema({
  roomName: {
    type: String,
    required: true,
    unique: true,
  },
  messages: [
    {
      id: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      senderAccount: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        required: true,
        default: Date.now,
      },
    },
  ],
  userList: {
    account: {
      type: String,
      required: true,
    },
  },
  totalUserCount: {
    type: Number,
    required: true,
  },
});

chatRoomSchema.pre('save', async function (next) {
  this.totalUserCount = this.userList.length;
  next();
});

const ChatRoom = model('chatRoom', chatRoomSchema);

module.exports = ChatRoom;
