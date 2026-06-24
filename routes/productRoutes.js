const express = require('express');
const { getProducts, addProduct, deleteProduct, getMyProducts, updateProduct } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, authorize('vendor'), addProduct);

router.get('/my', protect, authorize('vendor'), getMyProducts);

router.route('/:id')
  .put(protect, authorize('vendor', 'admin'), updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;
