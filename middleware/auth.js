const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Vendor = require('../models/vendor');
const Admin = require('../models/admin');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vendor_final_fallback_secret_2026');

    // Check all roles
    const user = await User.findById(decoded.id);
    const vendor = await Vendor.findById(decoded.id);
    const admin = await Admin.findById(decoded.id);

    req.user = user || vendor || admin;

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Role ${req.user.role} is not authorized to access this route` 
      });
    }
    next();
  };
};
