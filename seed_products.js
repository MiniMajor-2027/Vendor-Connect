const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Vendor = require('./models/vendor');
const Product = require('./models/product');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vendorconnect_final');
    console.log('Connected to DB for seeding...');

    // 1. Find your approved vendors
    const vendors = await Vendor.find({ status: 'approved' });

    if (vendors.length === 0) {
      console.log('No approved vendors found. Please approve some vendors in your DB first!');
      process.exit();
    }

    // 2. Clear existing products (optional, for clean start)
    await Product.deleteMany({});

    const demoProducts = [
      { name: 'Sona Masuri Rice', price: 65, category: 'Kirana / Grocery', description: 'Premium grade Karnataka rice.' },
      { name: 'Farm-Fresh Tomatoes', price: 40, category: 'Vegetables & Fruits', description: 'Freshly harvested today.' },
      { name: 'Toor Dal', price: 130, category: 'Kirana / Grocery', description: 'High quality pulses.' },
      { name: 'Garlic Bunches', price: 80, category: 'Vegetables & Fruits', description: 'Pungent local garlic.' },
      { name: 'Fresh Jasmine', price: 30, category: 'Flowers', description: 'Morning fresh mallige.' }
    ];

    // 3. Assign products to your actual vendors
    for (const vendor of vendors) {
      const productsToCreate = demoProducts.map(p => ({
        ...p,
        vendor: vendor._id
      }));
      await Product.insertMany(productsToCreate);
      console.log(` Added 5 products to: ${vendor.shopName}`);
    }

    console.log('\n SEEDING COMPLETE! Refresh your Shop page now.');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
