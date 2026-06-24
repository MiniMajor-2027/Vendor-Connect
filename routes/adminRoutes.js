const express = require('express');
const { getAllVendors, approveVendor, rejectVendor } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All admin routes require a valid JWT + admin role
router.use(protect);
router.use(authorize('admin', 'superadmin'));

// Vendor management
router.get('/vendors',                 getAllVendors);
router.patch('/vendors/:id/approve',   approveVendor);
router.patch('/vendors/:id/reject',    rejectVendor);

module.exports = router;
