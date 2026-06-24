const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  // 'Your Name *' field from the form
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },

  // 'Phone Number' field from the form
  phone: {
    type: String,
    trim: true
  },

  // 'Email Address (optional)' field from the form
  email: {
    type: String,
    trim: true,
    lowercase: true 
  },

  // 'What is this about? *' dropdown field

  topic: {
    type: String,
    required: [true, 'Please select what this message is about'],
    enum: {
      values: [
        'Help with Registration',
        'Problem with my Shop Listing',
        'I Forgot my Password',
        'Question about Features',
        'Report a Problem',
        'Suggestion or Feedback',
        'I Want to Know More',
        'Something Else'
      ],
      message: '{VALUE} is not a supported topic'
    }
  },

  // 'Your Message *' textarea field
  message: {
    type: String,
    required: [true, 'Please enter your message'],
    maxlength: [1000, 'Message cannot be more than 1000 characters'],
    trim: true
  },

  // Timestamps for record keeping
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Full-text search index for admin dashboard searches
contactMessageSchema.index({ name: 'text', email: 'text', message: 'text' });

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

module.exports = ContactMessage;