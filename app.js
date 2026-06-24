const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config();

const app = express();

// MANUAL CORS HANDLER
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    res.header('Access-Control-Allow-Origin', '*');
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Body parser
app.use(express.json());

// Logger
app.use((req, res, next) => {
  console.log(`📡 ${req.method} request to: ${req.url}`);
  next();
});

// Serve frontend
app.use(express.static(path.resolve(__dirname)));

// API Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/shops', require('./routes/vendorRoutes'));
app.use('/api/v1/products', require('./routes/productRoutes'));
app.use('/api/v1/contact', require('./routes/contactRoutes'));
app.use('/api/v1/admin', require('./routes/adminRoutes'));

// Root fallback
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

module.exports = app;
