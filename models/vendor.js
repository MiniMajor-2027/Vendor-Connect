const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const vendorSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['vendor'],
      default: 'vendor',
    },
    ownerName: {
      type: String,
      required: [true, 'Owner name is required'],
      trim: true,
      maxlength: [100, 'Owner name cannot exceed 100 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    shopName: {
      type: String,
      required: [true, 'Shop name is required'],
      trim: true,
      maxlength: [150, 'Shop name cannot exceed 150 characters'],
    },
    category: {
      type: String,
      required: [true, 'Business category is required'],
      enum: ['Vegetables & Fruits', 'Kirana / Grocery', 'Flowers', 'Clothing & Textiles', 'Electronics Repair', 'Food & Snacks', 'Dairy & Milk', 'Stationery', 'Medicine & Pharmacy', 'Hardware & Tools', 'Other'],
    },
    address: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      default: '',
    },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [76.1004, 13.0057] },
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending',
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

// Hash password
vendorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
vendorSchema.methods.comparePassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

vendorSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Vendor', vendorSchema);
