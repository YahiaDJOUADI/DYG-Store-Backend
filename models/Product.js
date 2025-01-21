const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Basic Product Information
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0, // Ensure price is not negative
  },

  // Inventory Management
  stock: {
    type: Number,
    required: true,
    min: 0, // Ensure stock is not negative
  },

  // Product Category
  category: {
    type: String,
    required: true,
    trim: true,
  },

  // Product Image
  image: {
    type: String, // URL to the product image
    required: true,
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;