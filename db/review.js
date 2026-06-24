const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    // The user who wrote the review
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },

    // Target: either a product review or a shop review
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      default: null,
    },

    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },

    // Display name shown on the review (e.g. "Kavya T.")
    reviewerDisplayName: {
      type: String,
      trim: true,
      maxlength: [60, 'Display name cannot exceed 60 characters'],
    },

    text: {
      type: String,
      trim: true,
      maxlength: [1000, 'Review text cannot exceed 1000 characters'],
      default: '',
    },

    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Enforce: a user can only leave one review per product and one per vendor
reviewSchema.index({ user: 1, product: 1 }, { unique: true, sparse: true });
reviewSchema.index({ user: 1, vendor: 1 }, { unique: true, sparse: true });
reviewSchema.index({ product: 1 });
reviewSchema.index({ vendor: 1 });

// After save, recalculate averageRating on the parent Product or Vendor
reviewSchema.statics.calcAverageRatings = async function (targetModel, targetId) {
  const Model = mongoose.model(targetModel);
  const stats = await this.aggregate([
    { $match: { [targetModel === 'Product' ? 'product' : 'vendor']: targetId } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Model.findByIdAndUpdate(targetId, {
      averageRating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].count,
    });
  } else {
    await Model.findByIdAndUpdate(targetId, { averageRating: 0, reviewCount: 0 });
  }
};

reviewSchema.post('save', function () {
  if (this.product) this.constructor.calcAverageRatings('Product', this.product);
  if (this.vendor)  this.constructor.calcAverageRatings('Vendor',  this.vendor);
});

reviewSchema.post('remove', function () {
  if (this.product) this.constructor.calcAverageRatings('Product', this.product);
  if (this.vendor)  this.constructor.calcAverageRatings('Vendor',  this.vendor);
});

module.exports = mongoose.model('Review', reviewSchema);
