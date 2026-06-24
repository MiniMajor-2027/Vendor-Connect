const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    // The vendor who owns this product
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: [true, 'Product must belong to a vendor'],
    },

    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [150, 'Product name cannot exceed 150 characters'],
    },

    // Emoji icon chosen from the dashboard emoji picker (e.g. "🍅")
    emoji: {
      type: String,
      default: '🛍️',
    },

    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },

    unit: {
      type: String,
      enum: [
        'per kg',
        'per litre',
        'per piece',
        'per bunch',
        'per dozen',
        'per pack',
        'per metre',
        'per strip',
        'per 500 ml',
        'other',
      ],
      default: 'per piece',
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
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

    // Stock status shown on the product card
    stockStatus: {
      type: String,
      enum: ['in', 'out'],
      default: 'in',
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },

    // Promotional badge label (e.g. "Daily Stock", "Best Seller", "Offer")
    badgeText: {
      type: String,
      trim: true,
      default: null,
    },

    // Badge style variant
    badge: {
      type: String,
      enum: ['fresh', 'popular', 'sale', 'new', null],
      default: null,
    },

    // Extra detail rows shown in the product modal (e.g. { label: "Min. Order", value: "½ metre" })
    details: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],

    // Aggregated rating data (updated when a review is added/removed)
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

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ vendor: 1 });
productSchema.index({ category: 1 });
productSchema.index({ stockStatus: 1 });
// Text search across name and description
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
