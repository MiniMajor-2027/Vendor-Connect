const express = require('express');
const { 
  registerUser, loginUser, 
  registerVendor, loginVendor, 
  loginAdmin 
} = require('../controllers/authController');

const router = express.Router();

router.post('/user/register', registerUser);
router.post('/user/login', loginUser);

router.post('/vendor/register', registerVendor);
router.post('/vendor/login', loginVendor);

router.post('/admin/login', loginAdmin);

module.exports = router;
