const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
  {
    // Account credentials
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9_]+$/,
        'Username can only contain letters, numbers, and underscores',
      ],
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

    // Owner details 
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
      match: [/^\+?[0-9\s\-]{7,15}$/, 'Please provide a valid phone number'],
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
      default: null,
    },

    // Shop details
    shopName: {
      type: String,
      required: [true, 'Shop name is required'],
      trim: true,
      maxlength: [150, 'Shop name cannot exceed 150 characters'],
    },

    category: {
      type: String,
      required: [true, 'Business category is required'],
      enum: [
        'Vegetables & Fruits',
        'Kirana / Grocery',
        'Flowers',
        'Clothing & Textiles',
        'Electronics Repair',
        'Food & Snacks',
        'Dairy & Milk',
        'Stationery',
        'Medicine & Pharmacy',
        'Hardware & Tools',
        'Other',
      ],
    },

    address: {
      type: String,
      trim: true,
      maxlength: [300, 'Address cannot exceed 300 characters'],
      default: '',
    },

    // Array of descriptive tags shown on the shop card (e.g. ["Fresh Veggies", "Organic"])
    tags: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },

    // Optional notes submitted during registration
    registrationNotes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },

    // Location (for map display on shops.html) 
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [76.1004, 13.0057], // Hassan city centre default
      },
    },

    // Shop hours 
    openingTime: {
      type: String,
      default: '09:00',
    },
    closingTime: {
      type: String,
      default: '21:00',
    },
    isOpenOnSunday: {
      type: Boolean,
      default: true,
    },

    // Ratings
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },

    // Admin approval workflow
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending',
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    rejectionReason: {
      type: String,
      default: '',
    },

    // Password reset 
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Geospatial index for map-based shop lookup
vendorSchema.index({ location: '2dsphere' });
vendorSchema.index({ username: 1 });
vendorSchema.index({ status: 1 });
vendorSchema.index({ category: 1 });

module.exports = mongoose.model('Vendor', vendorSchema);
