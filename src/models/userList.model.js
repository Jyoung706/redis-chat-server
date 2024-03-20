const { Schema, model } = require('mongoose');

const userListSchema = new Schema(
  {
    account: {
      type: String,
      required: true,
    },
    socketId: {
      type: String,
      required: true,
    },
    chatRoom: [
      {
        roomId: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        roomName: {
          type: String,
        },
        // private, groupchat, selfchat, etc
        roomType: {
          type: String,
        },
        messages: [
          {
            id: { type: Schema.Types.ObjectId, required: true },
            sender: {
              type: Schema.Types.ObjectId,
              ref: 'userList',
              required: true,
            },
            message: { type: String, required: true },
            createdAt: { type: Date, required: true, default: Date.now },
          },
        ],
        participant: [
          {
            id: {
              type: Schema.Types.ObjectId,
              ref: 'userList',
            },
            account: String,
          },
        ],
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

userListSchema.pre('save', async function (next) {
  if (!this.chatRoom.length) {
    next();
    return;
  }
  if (this.chatRoom.participant.length === 2) {
    this.chatRoom.roomType = 'private';
  } else if (this.chatRoom.participant.length > 2) {
    this.chatRoom.roomType = 'groupchat';
  } else if (this.chatRoom.participant.length === 1) {
    this.chatRoom.roomType = 'selfchat';
  }
  next();
});

const UserList = model('userList', userListSchema);

module.exports = UserList;
