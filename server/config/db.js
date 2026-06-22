const mongoose = require('mongoose');

global.isMongoConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskflow');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.isMongoConnected = true;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️ MongoDB is not active. Falling back to Local JSON database storage.');
    global.isMongoConnected = false;
  }
};

module.exports = connectDB;
