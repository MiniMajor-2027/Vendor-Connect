const Vendor = require('../models/vendor');
const Product = require('../models/product');

// Public: Get all approved shops
exports.getAllShops = async (req, res) => {
  try {
    const shops = await Vendor.find({ status: 'approved' }).select('-password');
    res.status(200).json({ success: true, count: shops.length, data: shops });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching shops' });
  }
};

// Public: Get single shop
exports.getShopById = async (req, res) => {
  try {
    const shop = await Vendor.findById(req.params.id).select('-password');
    if (!shop) return res.status(404).json({ success: false, message: 'Shop not found' });
    res.status(200).json({ success: true, data: shop });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Public: Get products for a vendor
exports.getVendorProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.params.id });
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching products' });
  }
};
