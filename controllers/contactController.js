// vendor/api/contact.js
const express = require('express');
const router = express.Router();
const ContactMessage = require('../db/contactMessage');

// Receives the contact form submission and saves it to MongoDB

router.post('/', async (req, res) => {
  try {
    // Destructure using the field names defined in your Mongoose schema
    const { name, phone, email, topic, message } = req.body;

    const contactMessage = new ContactMessage({
      name,    // matches 'Your Name *'
      phone,   // matches 'Phone Number'
      email,   // matches 'Email Address (optional)'
      topic,   // matches 'What is this about? *'
      message, // matches 'Your Message *'
    });

    await contactMessage.save();

    res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully' 
    });
  } catch (error) {
    console.error('Error saving contact message:', error);
    
    // Check if error is a validation error (e.g., invalid enum topic)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
});

// If you actually needed a GET route to retrieve messages for an admin panel:
router.get('/', async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch messages' });
  }
});

module.exports = router;