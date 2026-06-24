const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      maxlength: 200,
    },
  },
  {
    timestamps: true,
  }
);

// Statics for average product rating calculation
reviewSchema.statics.calcAverageRatings = async function(productId) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      reviewCount: stats[0].nRating,
      averageRating: stats[0].avgRating
    });
  } else {
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      reviewCount: 0,
      averageRating: 0
    });
  }
};

reviewSchema.post('save', function() {
  this.constructor.calcAverageRatings(this.product);
});

module.exports = mongoose.model('Review', reviewSchema);
