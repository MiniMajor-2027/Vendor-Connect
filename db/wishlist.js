const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Wishlist item must belong to a user'],
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Wishlist item must reference a product'],
    },
  },
  {
    timestamps: true, // createdAt = "when the user saved this"
  }
);

// One entry per user-product pair
wishlistSchema.index({ user: 1, product: 1 }, { unique: true });
wishlistSchema.index({ user: 1 });

module.exports = mongoose.model('Wishlist', wishlistSchema);
