const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    account: {
      type: String,
      required: true,
    },
    socketId: {
      type: String,
      required: true,
    },
    online: {
      type: Boolean,
      required: true,
    },
  },
  { versionKey: false }
);

const UserList = model('userList', userListSchema);

module.exports = UserList;
