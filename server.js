// require('dotenv').config();
// const app = require('./app');
// const connectDB = require('./config/db');

// // Connect to Database
// connectDB();

// const PORT = process.env.PORT || 5001;

// const server = app.listen(PORT, '127.0.0.1', () => {
//   console.log(`
//    VendorConnect FINAL running
//    URL: http://127.0.0.1:${PORT}
//   `);
// });

// // Handle unhandled promise rejections
// process.on('unhandledRejection', (err, promise) => {
//   console.log(`Error: ${err.message}`);
//   // Close server & exit process
//   server.close(() => process.exit(1));
// });


require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`
   VendorConnect FINAL running
   URL: http://0.0.0.0:${PORT}
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});