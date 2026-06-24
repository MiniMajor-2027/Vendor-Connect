const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Admin name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Admin password must be at least 8 characters'],
      select: false,
    },

    role: {
      type: String,
      enum: ['admin', 'superadmin'],
      default: 'admin',
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // Full audit log of admin actions
    activityLog: [
      {
        action: {
          type: String,
          required: true,
          // e.g. 'approved_vendor', 'rejected_vendor', 'deleted_product', 'responded_to_message'
        },
        targetModel: {
          type: String,
          enum: ['Vendor', 'User', 'Product', 'ContactMessage'],
        },
        targetId: {
          type: mongoose.Schema.Types.ObjectId,
        },
        note: {
          type: String,
          default: '',
        },
        performedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    lastLoginAt: {
      type: Date,
    },

    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

adminSchema.index({ email: 1 });

module.exports = mongoose.model('Admin', adminSchema);
