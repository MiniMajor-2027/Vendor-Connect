const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vendorconnect_final';
    if (!process.env.MONGODB_URI) {
      console.warn('MONGODB_URI not found in .env, using local fallback...');
    }
    const conn = await mongoose.connect(uri);
    console.log(`Final DB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`DB Error: ${error.message}`);
    process.exit(1);
  }
   
};

module.exports = connectDB;
