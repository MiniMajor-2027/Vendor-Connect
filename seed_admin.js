const mongoose = require('mongoose');
const Admin    = require('./models/admin');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vendorconnect_final';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB:', MONGO_URI);

    // Remove existing admin with this email (clean slate)
    await Admin.deleteOne({ email: 'admin@vendorconnect.com' });

    // Create fresh admin — password gets hashed by the pre('save') hook
    await Admin.create({
      name:     'Super Admin',
      email:    'admin@vendorconnect.com',
      password: 'Admin@2026',
      role:     'admin',
    });

    console.log('🎉 Admin created successfully!');
    console.log('   Email   : admin@vendorconnect.com');
    console.log('   Password: Admin@2026');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seed();
