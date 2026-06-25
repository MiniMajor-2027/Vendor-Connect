# VendorConnect - A Local Business Support System

A comprehensive full-stack vendor registration and management platform built with modern web technologies. VendorConnect streamlines the process of vendor onboarding, product management and administrative oversight with a focus on user-friendly interfaces and regional language support.

## 🌟 Key Features

### User-Friendly Interface
- Intuitive and responsive design optimized for desktop and mobile devices
- Clean, modern UI that prioritizes usability and accessibility
- Seamless navigation across all platforms
- Real-time feedback and validation for better user experience

### English to Kannada Language Toggle
- Built-in language switcher supporting English and Kannada (ಕನ್ನಡ)
- Dynamic translation system for all UI elements
- Regional language support for enhanced accessibility

### Three Core Modules

#### 1. **User Module**
- Secure user registration and login system
- Profile management and account settings
- Browse and search product catalog

#### 2. **Vendor Module**
- Vendor registration with detailed business information
- Dashboard for managing product inventory
- Product upload and management

#### 3. **Admin Module**
- Comprehensive admin dashboard
- Vendor approval and rejection workflows
- User and vendor management
- Product verification

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** bcrypt password hashing

## 📱 Application Routes

### User Routes
- `GET /` - Home page
- `GET /shop` - Product catalog
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login

### Vendor Routes
- `GET /vendor-register` - Vendor registration page
- `POST /api/v1/vendors/register` - Submit vendor registration
- `GET /api/v1/vendors/dashboard` - Vendor dashboard (protected)
- `POST /api/v1/vendors/products` - Add new product

### Admin Routes
- `GET /admin-dashboard` - Admin dashboard (protected)
- `POST /api/v1/admin/approve-vendor` - Approve vendor
- `POST /api/v1/admin/reject-vendor` - Reject vendor

## 🔐 Security Features

- JWT-based authentication for secure API access
- bcrypt password encryption
- Protected routes with middleware authentication
- Input validation and sanitization
- CORS configuration for controlled access

## 🌐 Language Support

### Available Languages
- English (EN) - Default
- Kannada (KN) - Regional support

### Toggle Language
The language switcher is available in the navigation bar. Simply click to switch between English and Kannada interfaces.

## 📈 Project Structure

```
VendorConnect/
├── controllers/           # Route controllers
│   ├── adminController.js
│   ├── vendorController.js
│   ├── userController.js
│   └── authController.js
├── models/               # Database models
│   ├── vendor.js
│   ├── user.js
│   └── admin.js
├── middleware/           # Authentication and validation
│   └── auth.js
├── config/              # Configuration files
│   └── db.js
├── views/               # HTML templates
│   ├── index.html
│   ├── admin-dashboard.html
│   └── vendor-register.html
├── app.js              # Main application file
├── package.json        # Dependencies
└── .env                # Environment variables
```
