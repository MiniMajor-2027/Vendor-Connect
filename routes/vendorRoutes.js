const express = require('express');
const { getAllShops, getShopById, getVendorProducts } = require('../controllers/vendorController');

const router = express.Router();

router.get('/', getAllShops);
router.get('/:id', getShopById);
router.get('/:id/products', getVendorProducts);

module.exports = router;
