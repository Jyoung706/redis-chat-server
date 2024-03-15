const mongoose = require('mongoose');

const { MONGO_CONN_URI } = process.env;

const mongoConn = async () => {
  try {
    await mongoose.connect(MONGO_CONN_URI);
    console.log('Connected to mongoDB');
  } catch (error) {
    console.error('Error in connecting to mongoDB : ', error);
  }
};

module.exports = mongoConn;
