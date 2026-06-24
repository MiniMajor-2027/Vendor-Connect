const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Vendor = require('../models/vendor');
const Admin = require('../models/admin');

// Sign Token
const signToken = (id) => {
  const secret = process.env.JWT_SECRET || 'vendor_final_fallback_secret_2026';
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// User authentication
exports.registerUser = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    const token = signToken(newUser._id);
    res.status(201).json({ success: true, token, data: { user: newUser } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = signToken(user._id);
    res.status(200).json({ success: true, token, data: { user } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Vendor authentication
exports.registerVendor = async (req, res) => {
  try {
    const newVendor = await Vendor.create(req.body);
    res.status(201).json({ success: true, message: 'Application submitted! Please wait for admin approval.' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.loginVendor = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`🔑 Attempting login for vendor: ${username}`);
    
    const vendor = await Vendor.findOne({ username }).select('+password');
    
    if (!vendor) {
      console.log(`❌ Vendor not found: ${username}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await vendor.comparePassword(password, vendor.password);
    if (!isMatch) {
      console.log(`❌ Password mismatch for: ${username}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (vendor.status !== 'approved') {
      console.log(`⚠️ Login blocked: Vendor ${username} is ${vendor.status}`);
      return res.status(403).json({ message: `Account ${vendor.status}. Please contact admin for approval.` });
    }

    const token = signToken(vendor._id);
    console.log(`✅ Login successful for vendor: ${username}`);
    res.status(200).json({ success: true, token, data: { vendor } });
  } catch (error) {
    console.error('🔥 Login Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin authentication
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email }).select('+password');
    
    if (!admin || !(await admin.comparePassword(password, admin.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = signToken(admin._id);
    res.status(200).json({ success: true, token, data: { admin } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
